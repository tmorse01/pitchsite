import { Collection } from "mongodb";
import bcrypt from "bcryptjs";
import { getDatabase } from "../db/connection.js";
import {
  PitchDeck,
  SavePitchDeckRequest,
  SavePitchDeckResponse,
  GetPitchDeckResponse,
  IncrementViewResponse,
  DeletePitchDeckResponse,
} from "../types/pitchDeck.js";

export class PitchDeckService {
  private collection: Collection<PitchDeck> | null = null;

  constructor() {
    // Don't initialize collection in constructor
    // It will be initialized lazily when needed
  }

  // Lazy initialization of collection
  private getCollection(): Collection<PitchDeck> {
    if (!this.collection) {
      const db = getDatabase();
      this.collection = db.collection<PitchDeck>("pitchDecks");
    }
    return this.collection;
  }

  // Generate unique 6-character shareId
  private generateShareId(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Hash password if provided
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  private async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Save a new pitch deck
  async savePitchDeck(
    request: SavePitchDeckRequest,
    clientIp?: string,
    userAgent?: string
  ): Promise<SavePitchDeckResponse> {
    try {
      let shareId = this.generateShareId(); // Ensure shareId is unique
      let existingDeck = await this.getCollection().findOne({ shareId });
      while (existingDeck) {
        shareId = this.generateShareId();
        existingDeck = await this.getCollection().findOne({ shareId });
      }

      const now = new Date();
      const { formData, generatedContent, options } = request;

      // Calculate expiration date if specified
      let expiresAt: Date | undefined;
      if (options?.expiresIn) {
        expiresAt = new Date(
          now.getTime() + options.expiresIn * 24 * 60 * 60 * 1000
        );
      } else {
        // Default expiration: 30 days
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }

      // Hash password if provided
      let hashedPassword: string | undefined;
      if (options?.password) {
        hashedPassword = await this.hashPassword(options.password);
      }

      const pitchDeck: PitchDeck = {
        shareId,
        createdAt: now,
        expiresAt,
        isPublic: options?.isPublic ?? true,
        password: hashedPassword,
        formData,
        generatedContent,
        metadata: {
          viewCount: 0,
          creatorIp: clientIp,
          userAgent,
        },
      };

      await this.getCollection().insertOne(pitchDeck);

      const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const shareUrl = `${baseUrl}/share/${shareId}`;

      return {
        shareId,
        shareUrl,
        expiresAt,
      };
    } catch (error) {
      console.error("Error saving pitch deck:", error);
      throw new Error("Failed to save pitch deck");
    }
  }

  // Get a pitch deck by shareId
  async getPitchDeck(
    shareId: string,
    password?: string
  ): Promise<GetPitchDeckResponse> {
    try {
      const pitchDeck = await this.getCollection().findOne({
        shareId,
        isPublic: true,
      });

      if (!pitchDeck) {
        throw new Error("Pitch deck not found or not publicly accessible");
      }

      // Check if password is required
      const isPasswordProtected = !!pitchDeck.password;

      if (isPasswordProtected) {
        if (!password) {
          // Return minimal info indicating password is required
          return {
            pitchDeck: {
              _id: pitchDeck._id,
              shareId: pitchDeck.shareId,
              createdAt: pitchDeck.createdAt,
              expiresAt: pitchDeck.expiresAt,
              isPublic: pitchDeck.isPublic,
              formData: {
                projectName: pitchDeck.formData.projectName,
                // Hide other sensitive data
              } as any,
              generatedContent: {} as any,
              metadata: {
                viewCount: pitchDeck.metadata.viewCount,
              },
            },
            isPasswordProtected: true,
          };
        }

        // Verify password
        const isValidPassword = await this.verifyPassword(
          password,
          pitchDeck.password!
        );
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }
      }

      // Remove password from response
      const { password: _, ...pitchDeckWithoutPassword } = pitchDeck;

      return {
        pitchDeck: pitchDeckWithoutPassword,
        isPasswordProtected,
      };
    } catch (error) {
      console.error("Error getting pitch deck:", error);
      throw error;
    }
  }
  // Increment view count
  async incrementViewCount(shareId: string): Promise<IncrementViewResponse> {
    try {
      const result = await this.getCollection().findOneAndUpdate(
        { shareId, isPublic: true },
        {
          $inc: { "metadata.viewCount": 1 },
          $set: { "metadata.lastViewed": new Date() },
        },
        { returnDocument: "after" }
      );

      if (!result) {
        throw new Error("Pitch deck not found");
      }

      return {
        viewCount: result.metadata.viewCount,
      };
    } catch (error) {
      console.error("Error incrementing view count:", error);
      throw error;
    }
  }
  // Delete a pitch deck (soft delete by making it non-public)
  async deletePitchDeck(shareId: string): Promise<DeletePitchDeckResponse> {
    try {
      const result = await this.getCollection().updateOne(
        { shareId },
        { $set: { isPublic: false } }
      );

      return {
        success: result.modifiedCount > 0,
      };
    } catch (error) {
      console.error("Error deleting pitch deck:", error);
      throw error;
    }
  }
  // Clean up expired pitch decks (called by cron job)
  async cleanupExpiredDecks(): Promise<number> {
    try {
      const result = await this.getCollection().deleteMany({
        expiresAt: { $lt: new Date() },
      });

      console.log(`Cleaned up ${result.deletedCount} expired pitch decks`);
      return result.deletedCount;
    } catch (error) {
      console.error("Error cleaning up expired decks:", error);
      throw error;
    }
  }
}
