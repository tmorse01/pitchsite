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
