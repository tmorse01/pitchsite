import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

/**
 * Authenticate with password and return JWT token
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body;

    // Read APP_PASSWORD dynamically to ensure .env is loaded
    const APP_PASSWORD = process.env.APP_PASSWORD || "pitch";

    if (!password) {
      res.status(400).json({
        error: "Password required",
        message: "Please provide a password",
      });
      return;
    }

    if (password !== APP_PASSWORD) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid password",
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        authenticated: true,
        timestamp: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Authentication failed",
    });
  }
};

/**
 * JWT authentication middleware
 * Verifies JWT token from Authorization header
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Access token required",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({
      error: "Forbidden",
      message: "Invalid or expired token",
    });
  }
};
