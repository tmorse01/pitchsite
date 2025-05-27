import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || "pitchsite";

    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    if (!client) {
      console.log("Connecting to MongoDB...");
      client = new MongoClient(uri);
      await client.connect();
      console.log("Connected to MongoDB successfully");
    }

    if (!db) {
      db = client.db(dbName);

      // Create indexes for performance and TTL
      await createIndexes();
    }

    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export const getDatabase = (): Db => {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDatabase first.");
  }
  return db;
};

export const closeConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};

// Create necessary indexes
const createIndexes = async (): Promise<void> => {
  try {
    const pitchDecksCollection = db.collection("pitchDecks");

    // Unique index on shareId
    await pitchDecksCollection.createIndex({ shareId: 1 }, { unique: true });

    // TTL index for automatic expiration
    await pitchDecksCollection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );

    // Index for public decks
    await pitchDecksCollection.createIndex({ isPublic: 1 });

    // Compound index for queries
    await pitchDecksCollection.createIndex({ shareId: 1, isPublic: 1 });

    console.log("Database indexes created successfully");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await closeConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeConnection();
  process.exit(0);
});
