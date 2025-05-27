import { API_BASE_URL } from "./config";
import { createHeaders } from "./auth";
import type {
  PitchData,
  SavePitchDeckOptions,
  SavePitchDeckResponse,
  GetPitchDeckResponse,
  IncrementViewResponse,
} from "./types";

// Save a pitch deck to MongoDB
export async function savePitchDeck(
  pitchData: PitchData,
  options?: SavePitchDeckOptions
): Promise<SavePitchDeckResponse> {
  try {
    console.log("Saving pitch deck to MongoDB...");

    const response = await fetch(`${API_BASE_URL}/api/pitch-decks`, {
      method: "POST",
      headers: createHeaders(false), // No auth required for saving
      body: JSON.stringify({
        formData: pitchData.formData,
        generatedContent: pitchData.generatedContent,
        options,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: SavePitchDeckResponse = await response.json();
    console.log("Pitch deck saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error saving pitch deck:", error);
    throw error;
  }
}

// Get a pitch deck from MongoDB
export async function getPitchDeck(
  shareId: string,
  password?: string
): Promise<GetPitchDeckResponse> {
  try {
    console.log("Fetching pitch deck from MongoDB...", shareId);

    const url = new URL(`${API_BASE_URL}/api/pitch-decks/${shareId}`);
    if (password) {
      url.searchParams.append("password", password);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: createHeaders(false), // No auth required for getting
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: GetPitchDeckResponse = await response.json();
    console.log("Pitch deck fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching pitch deck:", error);
    throw error;
  }
}

// Increment view count for a pitch deck
export async function incrementViewCount(
  shareId: string
): Promise<IncrementViewResponse> {
  try {
    console.log("Incrementing view count for:", shareId);

    const response = await fetch(
      `${API_BASE_URL}/api/pitch-decks/${shareId}/view`,
      {
        method: "PATCH",
        headers: createHeaders(false), // No auth required for view counting
      }
    );

    if (!response.ok) {
      // Don't throw error for view count failures, just log it
      console.warn("Failed to increment view count:", response.status);
      return { viewCount: 0 };
    }

    const data: IncrementViewResponse = await response.json();
    return data;
  } catch (error) {
    console.warn("Error incrementing view count:", error);
    return { viewCount: 0 };
  }
}
