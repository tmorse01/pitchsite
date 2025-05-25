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

export async function generatePitchDeck(
  formData: FormData
): Promise<GeneratedContent> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error testing API:", error);
    throw error;
  }
}
