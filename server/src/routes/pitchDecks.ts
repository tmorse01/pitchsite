import { Router, Request, Response } from "express";
import { PitchDeckService } from "../services/pitchDeckService.js";
import { SavePitchDeckRequest } from "../types/pitchDeck.js";

const router = Router();

// Helper function to get service instance
function getPitchDeckService(): PitchDeckService {
  return new PitchDeckService();
}

// POST /api/pitch-decks - Save a new pitch deck
router.post("/", async (req: Request, res: Response) => {
  try {
    const requestBody: SavePitchDeckRequest = req.body;

    // Validate required fields
    if (!requestBody.formData || !requestBody.generatedContent) {
      return res.status(400).json({
        error: "Missing required fields: formData and generatedContent",
      });
    }

    // Get client IP and User Agent for tracking
    const clientIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");
    const result = await getPitchDeckService().savePitchDeck(
      requestBody,
      clientIp,
      userAgent
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Error in POST /api/pitch-decks:", error);
    res.status(500).json({
      error: "Failed to save pitch deck",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/pitch-decks/:shareId - Retrieve a pitch deck
router.get("/:shareId", async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;
    const { password } = req.query;

    // Validate shareId format
    if (!/^[a-zA-Z0-9]{6}$/.test(shareId)) {
      return res.status(400).json({
        error: "Invalid shareId format",
      });
    }
    const result = await getPitchDeckService().getPitchDeck(
      shareId,
      password as string
    );

    res.json(result);
  } catch (error) {
    console.error("Error in GET /api/pitch-decks/:shareId:", error);

    if (error instanceof Error) {
      if (error.message === "Pitch deck not found or not publicly accessible") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Invalid password") {
        return res.status(401).json({ error: error.message });
      }
    }

    res.status(500).json({
      error: "Failed to retrieve pitch deck",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PATCH /api/pitch-decks/:shareId/view - Increment view count
router.patch("/:shareId/view", async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;

    // Validate shareId format
    if (!/^[a-zA-Z0-9]{6}$/.test(shareId)) {
      return res.status(400).json({
        error: "Invalid shareId format",
      });
    }

    const result = await getPitchDeckService().incrementViewCount(shareId);
    res.json(result);
  } catch (error) {
    console.error("Error in PATCH /api/pitch-decks/:shareId/view:", error);

    if (error instanceof Error && error.message === "Pitch deck not found") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({
      error: "Failed to increment view count",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/pitch-decks/:shareId - Delete a pitch deck
router.delete("/:shareId", async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;

    // Validate shareId format
    if (!/^[a-zA-Z0-9]{6}$/.test(shareId)) {
      return res.status(400).json({
        error: "Invalid shareId format",
      });
    }

    const result = await getPitchDeckService().deletePitchDeck(shareId);

    if (!result.success) {
      return res.status(404).json({
        error: "Pitch deck not found",
      });
    }

    return res.json(result);
  } catch (error) {
    console.error("Error in DELETE /api/pitch-decks/:shareId:", error);
    return res.status(500).json({
      error: "Failed to delete pitch deck",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/pitch-decks/:shareId/analytics - Get basic analytics (future feature)
router.get("/:shareId/analytics", async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params; // For now, just return view count
    const result = await getPitchDeckService().getPitchDeck(shareId);

    res.json({
      shareId,
      viewCount: result.pitchDeck.metadata.viewCount,
      lastViewed: result.pitchDeck.metadata.lastViewed,
      createdAt: result.pitchDeck.createdAt,
    });
  } catch (error) {
    console.error("Error in GET /api/pitch-decks/:shareId/analytics:", error);
    res.status(500).json({
      error: "Failed to get analytics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
