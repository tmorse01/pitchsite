import { Router, Request, Response } from "express";
import OpenAI from "openai";
import { authenticateToken, login } from "../middleware/auth.js";

const router = Router();

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

interface ComparableProperty {
  address: string;
  price: string;
  distance: string;
  note: string;
}

interface MarketTrend {
  year: string;
  medianPrice: number;
  rentGrowth: number;
  capRate: number;
}

interface MarketTrendsData {
  priceTrends: MarketTrend[];
  summary: string;
}

// Function to get OpenAI client (lazy initialization)
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API key not found in environment variables");
  }

  console.log(
    "Creating OpenAI client with API key:",
    apiKey.substring(0, 10) + "..."
  );

  return new OpenAI({
    apiKey: apiKey,
  });
}

// Login endpoint - No authentication required
router.post("/login", login);

// Generate endpoint - Protected with JWT authentication
router.post(
  "/generate",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const body: RequestBody = req.body;

      // Debug logging for API key
      console.log("API Key present:", !!process.env.OPENAI_API_KEY);
      console.log("API Key length:", process.env.OPENAI_API_KEY?.length || 0);
      console.log(
        "API Key starts with:",
        process.env.OPENAI_API_KEY?.substring(0, 7)
      );

      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        console.warn("OpenAI API key not found, using fallback generation");
        // Fall back to hardcoded content if no API key
        const response = {
          executiveSummary: generateExecutiveSummaryFallback(body),
          investmentThesis: generateInvestmentThesisFallback(body),
          riskFactors: generateRiskFactorsFallback(body),
          locationOverview: generateLocationOverviewFallback(body),
          locationSnapshot: generateLocationSnapshotFallback(body),
          sponsorBio: generateSponsorBioFallback(body),
          comparableProperties: generateComparableProperties(body),
          marketTrends: generateMarketTrends(body),
        };

        return res.json(response);
      }

      // Generate AI content using OpenAI
      const response = await generateAIContent(body);
      return res.json(response);
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Test endpoint - Protected with JWT authentication
router.get("/test", authenticateToken, (req: Request, res: Response) => {
  res.json({
    message: "Generate API is working!",
    timestamp: new Date().toISOString(),
  });
});

function generateExecutiveSummaryFallback(data: RequestBody): string {
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
    Professional: `**${projectName}** represents a compelling`,
    Persuasive: `**${projectName}** presents an *exceptional*`,
    "Data-Driven": `**${projectName}** offers a *quantifiably attractive*`,
  };

  const intro =
    toneIntros[tone as keyof typeof toneIntros] || toneIntros.Professional;

  return `${intro} ${investmentType.toLowerCase()} investment opportunity with a total acquisition cost of **${formatCurrency(
    purchasePrice
  )}**. 

**Key Investment Highlights:**
- Total equity raise: **${formatCurrency(equityRaise)}**
- Target IRR: **${targetIrr}**
- Investment timeline: **${holdPeriod}**

This project leverages *strategic market positioning* and the sponsor's proven track record to deliver strong returns through value creation and operational excellence.`;
}

function generateInvestmentThesisFallback(data: RequestBody): string {
  const { investmentType, address } = data;
  const location = address.split(",").pop()?.trim() || "the target market";

  return `## Investment Strategy

This **${investmentType.toLowerCase()} investment** capitalizes on strong market fundamentals in *${location}*, including:

- **Population growth** and job creation driving demand
- **Limited new supply** creating favorable market conditions  
- **Strategic location** with excellent access to employment centers
- **Transportation corridors** enhancing long-term value

Our *value-add strategy* will enhance the asset's competitive position while generating **stable cash flow** and **long-term appreciation** for investors through targeted improvements and operational optimization.`;
}

function generateRiskFactorsFallback(data: RequestBody): string[] {
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

function generateLocationOverviewFallback(data: RequestBody): string {
  const { address } = data;
  const location = address.split(",").pop()?.trim() || "the target location";

  return `## Market Overview

**${location}** is experiencing *robust economic growth* driven by diverse industry sectors and population expansion. 

### Key Economic Drivers:
- **Excellent infrastructure** including major highways and public transportation
- **Proximity to key employment centers** and educational institutions
- **Recent developments** attracting both businesses and residents
- **Strong rental demand** with below-average vacancy rates

The local market demonstrates **exceptional resilience** and continues to show *positive trends* in both rental rates and property values, creating a strong foundation for sustained real estate investment returns.`;
}

function generateLocationSnapshotFallback(data: RequestBody): string {
  const { address, tone = "Professional" } = data;
  const location = address.split(",").pop()?.trim() || "the target location";

  const toneStyle = {
    Professional:
      "demonstrates **strong market fundamentals** with *consistent growth patterns*",
    Persuasive:
      "presents an **exceptional opportunity** with *compelling growth indicators*",
    "Data-Driven":
      "exhibits **quantifiable growth metrics** and *favorable demographic trends*",
  };

  const style =
    toneStyle[tone as keyof typeof toneStyle] || toneStyle.Professional;

  return `## Location Snapshot

**${location}** ${style}. 

### Market Highlights:
- **Growing population base** with diverse demographics
- **Employment opportunities** across technology, healthcare, and finance sectors
- **Ongoing infrastructure improvements** enhancing connectivity
- **Below-average vacancy rates** indicating strong rental demand

The location's *proximity to major universities* and employment centers ensures **consistent tenant demand** and strong long-term appreciation potential, making it an ideal target for real estate investment.`;
}

function generateComparableProperties(data: RequestBody): ComparableProperty[] {
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

function generateMarketTrends(data: RequestBody): MarketTrendsData {
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

function generateSponsorBioFallback(data: RequestBody): string {
  const originalBio = data.sponsorBio;

  // Enhance the provided bio with professional language and markdown
  return `## Sponsor Profile

${originalBio}

### Key Qualifications:
- **Proven track record** in real estate investment and development
- **Extensive market knowledge** and operational expertise
- **Strong relationships** with local contractors, brokers, and financial institutions
- **Hands-on approach** to asset management and value creation

The sponsor team's *comprehensive experience* and **strategic partnerships** position them to execute the business plan successfully and deliver **strong returns** to investors.`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

// AI Content Generation using OpenAI
async function generateAIContent(data: RequestBody) {
  const {
    projectName,
    address,
    investmentType,
    purchasePrice,
    equityRaise,
    targetIrr,
    holdPeriod,
    description,
    sponsorBio,
    tone = "Professional",
  } = data;

  const location = address.split(",").pop()?.trim() || "the target location";

  try {
    // Create a comprehensive prompt for GPT
    const prompt = `
You are a professional real estate investment analyst. Generate content for an investment pitch deck with the following details:

Project: ${projectName}
Address: ${address}
Investment Type: ${investmentType}
Purchase Price: ${formatCurrency(purchasePrice)}
Equity Raise: ${formatCurrency(equityRaise)}
Target IRR: ${targetIrr}
Hold Period: ${holdPeriod}
Description: ${description}
Sponsor Bio: ${sponsorBio}
Content Tone: ${tone}

Please provide the following sections in JSON format with markdown-formatted content for rich text display:

1. executiveSummary: A compelling executive summary in a ${tone.toLowerCase()} tone. Use markdown formatting with **bold** for key metrics, *emphasis* for important points, and bullet points for key highlights. Include 3-4 sentences with rich formatting.

2. investmentThesis: A detailed investment thesis explaining why this is a good investment. Use markdown with:
   - **Bold** for key value propositions
   - Bullet points for main arguments
   - *Emphasis* for market advantages
   - 3-4 well-structured paragraphs

3. locationOverview: A professional overview of ${location} focusing on real estate demand, population growth, and economic development. Use markdown formatting with:
   - **Bold** for key location benefits
   - Bullet points for major economic drivers
   - *Emphasis* for growth indicators
   - 3-4 paragraphs with rich formatting

4. locationSnapshot: A ${tone.toLowerCase()} location analysis highlighting growth metrics and demographic trends. Use markdown with:
   - **Bold** for key statistics
   - Bullet points for demographic highlights
   - *Emphasis* for market trends
   - Rich formatting throughout

5. enhancedSponsorBio: Enhance the provided sponsor bio with professional language and markdown formatting:
   - **Bold** for key achievements and experience
   - *Emphasis* for specializations
   - Bullet points for major accomplishments
   - Keep original content but make it more compelling with rich formatting

6. riskFactors: Array of 5 relevant risk factors for this type of investment (keep as plain text strings for bullet point display)

7. comparableProperties: Array of 3 comparable properties with realistic addresses, prices around ${formatCurrency(
      purchasePrice
    )}, distances, and notes (keep as objects for structured display)

Return only a valid JSON object with these fields. The text fields should contain markdown formatting for rich display. Do not wrap the response in markdown code blocks - return raw JSON only.`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional real estate investment analyst. Provide detailed, accurate, and compelling investment analysis content. Always return valid JSON without markdown formatting or code blocks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from OpenAI");
    }

    // Extract JSON from markdown code blocks if present
    let jsonString = aiResponse;
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    } else {
      // Try to find JSON block without language specification
      const codeMatch = aiResponse.match(/```\s*([\s\S]*?)\s*```/);
      if (codeMatch) {
        jsonString = codeMatch[1];
      }
    }

    // Clean up the JSON string
    jsonString = jsonString.trim();

    // Parse the AI response
    let aiContent;
    try {
      aiContent = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw AI Response:", aiResponse);
      console.error("Extracted JSON String:", jsonString);
      throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
    }

    // Combine AI content with generated data
    return {
      executiveSummary:
        aiContent.executiveSummary || generateExecutiveSummaryFallback(data),
      investmentThesis:
        aiContent.investmentThesis || generateInvestmentThesisFallback(data),
      riskFactors: aiContent.riskFactors || generateRiskFactorsFallback(data),
      locationOverview:
        aiContent.locationOverview || generateLocationOverviewFallback(data),
      locationSnapshot:
        aiContent.locationSnapshot || generateLocationSnapshotFallback(data),
      sponsorBio:
        aiContent.enhancedSponsorBio || generateSponsorBioFallback(data),
      comparableProperties:
        aiContent.comparableProperties || generateComparableProperties(data),
      marketTrends: generateMarketTrends(data), // Keep the existing market trends generation
    };
  } catch (error) {
    console.error("Error generating AI content:", error);

    // Check if it's an authentication error
    if (
      error instanceof Error &&
      (error.message.includes("401") ||
        error.message.includes("Incorrect API key"))
    ) {
      console.warn(
        "OpenAI authentication failed, falling back to hardcoded content"
      );
    }

    // Fall back to hardcoded content if AI fails
    return {
      executiveSummary: generateExecutiveSummaryFallback(data),
      investmentThesis: generateInvestmentThesisFallback(data),
      riskFactors: generateRiskFactorsFallback(data),
      locationOverview: generateLocationOverviewFallback(data),
      locationSnapshot: generateLocationSnapshotFallback(data),
      sponsorBio: generateSponsorBioFallback(data),
      comparableProperties: generateComparableProperties(data),
      marketTrends: generateMarketTrends(data),
    };
  }
}

export default router;
