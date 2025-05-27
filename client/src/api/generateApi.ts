import { API_BASE_URL } from "./config";
import { createHeaders, handleAuthError } from "./auth";
import type { FormData, GeneratedContent, TestApiResponse } from "./types";

export async function generatePitchDeck(
  formData: FormData
): Promise<GeneratedContent> {
  try {
    const headers = createHeaders(true);

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
        handleAuthError();
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

export async function testApi(): Promise<TestApiResponse> {
  try {
    const headers = createHeaders(true);

    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        handleAuthError();
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
