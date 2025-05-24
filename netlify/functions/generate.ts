import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface RequestBody {
  projectName: string;
  address: string;
  investmentType: string;
  purchasePrice: number;
  equityRaise: number;
  targetIrr: string;
  holdPeriod: string;
  description: string;
  sponsorBio: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body: RequestBody = JSON.parse(event.body || "{}");

    // Simulate AI generation with realistic content
    const response = {
      executiveSummary: generateExecutiveSummary(body),
      investmentThesis: generateInvestmentThesis(body),
      riskFactors: generateRiskFactors(body),
      locationOverview: generateLocationOverview(body),
      sponsorBio: generateSponsorBio(body),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

function generateExecutiveSummary(data: RequestBody): string {
  const {
    projectName,
    investmentType,
    purchasePrice,
    equityRaise,
    targetIrr,
    holdPeriod,
  } = data;

  return `${projectName} represents a compelling ${investmentType.toLowerCase()} investment opportunity with a total acquisition cost of ${formatCurrency(
    purchasePrice
  )}. This project seeks to raise ${formatCurrency(
    equityRaise
  )} in equity capital to execute a ${holdPeriod} business plan targeting a ${targetIrr} IRR. The investment strategy focuses on value creation through strategic improvements and market positioning, leveraging current market conditions and the sponsor's proven track record in similar investments.`;
}

function generateInvestmentThesis(data: RequestBody): string {
  const { investmentType, address } = data;
  const location = address.split(",").pop()?.trim() || "the target market";

  return `This ${investmentType.toLowerCase()} investment capitalizes on strong fundamentals in ${location}, including population growth, job creation, and limited new supply. The property's strategic location provides excellent access to major employment centers and transportation corridors. Our value-add strategy will enhance the asset's competitive position while generating stable cash flow and long-term appreciation for investors.`;
}

function generateRiskFactors(data: RequestBody): string[] {
  const baseRisks = [
    "Interest rate volatility and financing market conditions",
    "Local market economic downturns affecting demand",
    "Construction cost overruns and timeline delays",
    "Regulatory changes and zoning modifications",
    "Competition from new developments in the area",
  ];

  if (data.investmentType.toLowerCase().includes("development")) {
    baseRisks.push("Construction and development risks");
    baseRisks.push("Permit and approval delays");
  }

  if (data.investmentType.toLowerCase().includes("flip")) {
    baseRisks.push("Renovation cost overruns");
    baseRisks.push("Extended marketing periods");
  }

  return baseRisks.slice(0, 5);
}

function generateLocationOverview(data: RequestBody): string {
  const { address } = data;
  const location = address.split(",").pop()?.trim() || "the target location";

  return `${location} is experiencing robust economic growth driven by diverse industry sectors and population expansion. The area benefits from excellent infrastructure, including major highways, public transportation, and proximity to key employment centers. Recent developments in the region have attracted both businesses and residents, creating a strong foundation for real estate investment returns. The local market demonstrates resilience and continues to show positive trends in both rental rates and property values.`;
}

function generateSponsorBio(data: RequestBody): string {
  const originalBio = data.sponsorBio;

  // Enhance the provided bio with professional language
  return `${originalBio} With a proven track record in real estate investment and development, the sponsor team brings extensive market knowledge and operational expertise to this opportunity. Their hands-on approach to asset management and strong relationships with local contractors, brokers, and financial institutions position them to execute the business plan successfully and deliver strong returns to investors.`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export { handler };
