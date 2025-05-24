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
  tone?: string;
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
    const body: RequestBody = JSON.parse(event.body || "{}"); // Simulate AI generation with realistic content
    const response = {
      executiveSummary: generateExecutiveSummary(body),
      investmentThesis: generateInvestmentThesis(body),
      riskFactors: generateRiskFactors(body),
      locationOverview: generateLocationOverview(body),
      locationSnapshot: generateLocationSnapshot(body),
      sponsorBio: generateSponsorBio(body),
      comparableProperties: generateComparableProperties(body),
      marketTrends: generateMarketTrends(body),
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
    tone = "Professional",
  } = data;

  const toneIntros = {
    Professional: `${projectName} represents a compelling`,
    Persuasive: `${projectName} presents an exceptional`,
    "Data-Driven": `${projectName} offers a quantifiably attractive`,
  };

  const intro =
    toneIntros[tone as keyof typeof toneIntros] || toneIntros.Professional;

  return `${intro} ${investmentType.toLowerCase()} investment opportunity with a total acquisition cost of ${formatCurrency(
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

function generateLocationSnapshot(data: RequestBody): string {
  const { address, tone = "Professional" } = data;
  const location = address.split(",").pop()?.trim() || "the target location";

  const toneStyle = {
    Professional:
      "demonstrates strong market fundamentals with consistent growth patterns",
    Persuasive:
      "presents an exceptional opportunity with compelling growth indicators",
    "Data-Driven":
      "exhibits quantifiable growth metrics and favorable demographic trends",
  };

  const style =
    toneStyle[tone as keyof typeof toneStyle] || toneStyle.Professional;

  return `${location} ${style}. The area features a growing population base, diverse employment opportunities across technology, healthcare, and finance sectors, and ongoing infrastructure improvements. Recent market analysis indicates sustained rental demand with vacancy rates below regional averages. The location's proximity to major universities and employment centers ensures consistent tenant demand and strong long-term appreciation potential.`;
}

function generateComparableProperties(data: RequestBody) {
  const { purchasePrice } = data;

  // Generate realistic comparable prices based on the purchase price
  const basePrice = purchasePrice;
  const comps = [
    {
      address: `${Math.floor(Math.random() * 999) + 100} Oak Street`,
      price: formatCurrency(basePrice * (0.9 + Math.random() * 0.2)),
      distance: `${(Math.random() * 0.8 + 0.2).toFixed(1)} miles`,
      note: "Similar square footage and amenities",
    },
    {
      address: `${Math.floor(Math.random() * 999) + 100} Pine Avenue`,
      price: formatCurrency(basePrice * (0.85 + Math.random() * 0.3)),
      distance: `${(Math.random() * 1.2 + 0.3).toFixed(1)} miles`,
      note: "Comparable age and condition",
    },
    {
      address: `${Math.floor(Math.random() * 999) + 100} Maple Drive`,
      price: formatCurrency(basePrice * (0.95 + Math.random() * 0.15)),
      distance: `${(Math.random() * 0.6 + 0.1).toFixed(1)} miles`,
      note: "Similar lot size and finishes",
    },
  ];

  return comps;
}

function generateMarketTrends(data: RequestBody) {
  const currentYear = new Date().getFullYear();
  const { purchasePrice } = data;

  // Generate realistic market data based on purchase price
  const baseMedianPrice = Math.floor(purchasePrice * 0.75); // Assume property is above median

  const priceTrends = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - 4 + i;
    const growth = 1 + (0.03 + Math.random() * 0.08); // 3-11% annual growth
    const price = Math.floor(baseMedianPrice * Math.pow(growth, i));
    return {
      year: year.toString(),
      medianPrice: price,
      rentGrowth: Math.floor((2 + Math.random() * 6) * 10) / 10, // 2-8% rent growth
      capRate: Math.floor((4 + Math.random() * 3) * 10) / 10, // 4-7% cap rates
    };
  });

  return {
    priceTrends,
    summary: `Market analysis shows consistent appreciation with median home prices increasing ${(
      (priceTrends[4].medianPrice / priceTrends[0].medianPrice - 1) *
      100
    ).toFixed(1)}% over the past 5 years. Rental growth has averaged ${(
      priceTrends.reduce((sum, p) => sum + p.rentGrowth, 0) / 5
    ).toFixed(1)}% annually, indicating strong rental demand.`,
  };
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
