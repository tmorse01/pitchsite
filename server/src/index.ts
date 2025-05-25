import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRouter from "./routes/generate.js";

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

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "PitchSite API Server",
    version: "1.0.0",
    endpoints: {
      generate: "/api/generate",
      test: "/api/test",
      health: "/health",
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

app.listen(PORT, () => {
  console.log(`🚀 PitchSite API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? "Present" : "Missing"}`
  );
  console.log(`🔐 App Password: ${process.env.APP_PASSWORD || "Not Set"}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? "Set" : "Not Set"}`);
});
