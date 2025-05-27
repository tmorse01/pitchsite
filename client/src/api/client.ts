interface FormData {
  projectName: string;
  address: string;
  investmentType: string;
  purchasePrice: number;
  totalRaise: number;
  targetIrr: string;
  holdPeriod: string;
  description: string;
  sponsorBio: string;
  image: File | null;
  tone: string;
}

interface GeneratedContent {
  executiveSummary: string;
  investmentThesis: string;
  riskFactors: string[];
  locationOverview: string;
  locationSnapshot: string;
  sponsorBio: string;
  comparableProperties: Array<{
    address: string;
    price: string;
    distance: string;
    note: string;
  }>;
  marketTrends: {
    priceTrends: Array<{
      year: string;
      medianPrice: number;
      rentGrowth: number;
      capRate: number;
    }>;
    summary: string;
  };
}

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Helper function to get JWT token from localStorage
function getAuthToken(): string | null {
  const token = localStorage.getItem("pitchsite_auth");
  return token && token !== "authenticated" ? token : null;
}

export async function generatePitchDeck(
  formData: FormData
): Promise<GeneratedContent> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add JWT token if available
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        projectName: formData.projectName,
        address: formData.address,
        investmentType: formData.investmentType,
        purchasePrice: formData.purchasePrice,
        equityRaise: formData.totalRaise,
        targetIrr: formData.targetIrr,
        holdPeriod: formData.holdPeriod,
        description: formData.description,
        sponsorBio: formData.sponsorBio,
        tone: formData.tone,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token is invalid, remove it and redirect to login
        localStorage.removeItem("pitchsite_auth");
        window.location.reload();
        throw new Error("Authentication required. Please log in again.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating pitch deck:", error);
    throw error;
  }
}

export async function testApi(): Promise<{
  message: string;
  method: string;
  timestamp: string;
}> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add JWT token if available
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token is invalid, remove it and redirect to login
        localStorage.removeItem("pitchsite_auth");
        window.location.reload();
        throw new Error("Authentication required. Please log in again.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error testing API:", error);
    throw error;
  }
}

// Pitch Deck interfaces
export interface PitchData {
  formData: FormData;
  generatedContent: GeneratedContent;
}

export interface SavePitchDeckOptions {
  expiresIn?: number; // Days until expiration
  password?: string;
  isPublic?: boolean;
}

export interface SavePitchDeckResponse {
  shareId: string;
  shareUrl: string;
  expiresAt?: string;
}

export interface GetPitchDeckResponse {
  pitchDeck: {
    _id?: string;
    shareId: string;
    createdAt: string;
    expiresAt?: string;
    isPublic: boolean;
    formData: FormData;
    generatedContent: GeneratedContent;
    metadata: {
      viewCount: number;
      lastViewed?: string;
    };
  };
  isPasswordProtected: boolean;
}

export interface IncrementViewResponse {
  viewCount: number;
}

// Save a pitch deck to MongoDB
export async function savePitchDeck(
  pitchData: PitchData,
  options?: SavePitchDeckOptions
): Promise<SavePitchDeckResponse> {
  try {
    console.log("Saving pitch deck to MongoDB...");

    const response = await fetch(`${API_BASE_URL}/api/pitch-decks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
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
        headers: {
          "Content-Type": "application/json",
        },
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
