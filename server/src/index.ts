import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRouter from "./routes/generate.js";
import pitchDecksRouter from "./routes/pitchDecks.js";
import { connectToDatabase } from "./db/connection.js";
import { login } from "./middleware/auth.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for Railway deployment
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_ORIGINS?.split(",") || []
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", generateRouter);
app.use("/api/pitch-decks", pitchDecksRouter);

// Direct login route (not under /api prefix)
app.post("/login", login);

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  const healthStatus = {
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    services: {
      database: "unknown",
    },
  };

  // Check database connection
  try {
    const { getDatabase } = await import("./db/connection.js");
    const db = getDatabase();
    await db.admin().ping();
    healthStatus.services.database = "connected";
  } catch (error) {
    healthStatus.services.database = "disconnected";
    console.warn("Health check: Database not available", error);
  }

  res.json(healthStatus);
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "PitchSite API Server",
    version: "1.0.0",
    endpoints: {
      login: "/login",
      generate: "/api/generate",
      test: "/api/test",
      health: "/health",
      pitchDecks: "/api/pitch-decks",
    },
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, async () => {
  console.log(`🚀 PitchSite API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? "Present" : "Missing"}`
  );
  console.log(`🔐 App Password: ${process.env.APP_PASSWORD || "Not Set"}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? "Set" : "Not Set"}`);
  // Connect to MongoDB
  try {
    console.log(`🗄️  MongoDB: Connecting...`);
    await connectToDatabase();
    console.log(`🗄️  MongoDB: Connected successfully`);
  } catch (error) {
    console.error(`❌ MongoDB: Connection failed`, error);
    console.log(`⚠️  Server will continue running without database connection`);
    console.log(
      `🔧 Check MONGODB_URI environment variable and database status`
    );
    // Don't exit in production - let the server run for debugging
  }
});
