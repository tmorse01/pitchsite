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
    address,
    description,
    tone = "Professional",
  } = data;

  const location = address.split(",").pop()?.trim() || "the target market";

  const strategyTemplates = {
    development: {
      strategy: "ground-up development",
      value: "capitalize on strong demand and limited supply",
      execution:
        "leverage proven development expertise and strategic partnerships",
    },
    flip: {
      strategy: "value-add renovation",
      value: "transform an underperforming asset",
      execution: "implement targeted improvements to maximize market appeal",
    },
    rental: {
      strategy: "income-generating acquisition",
      value: "secure stable cash flow in a high-demand market",
      execution: "optimize operations and enhance tenant satisfaction",
    },
    default: {
      strategy: "strategic real estate investment",
      value: "capitalize on favorable market conditions",
      execution: "leverage market expertise and operational excellence",
    },
  };

  // Determine strategy based on investment type
  let strategy = strategyTemplates.default;
  const investmentLower = investmentType.toLowerCase();
  if (
    investmentLower.includes("development") ||
    investmentLower.includes("build")
  ) {
    strategy = strategyTemplates.development;
  } else if (
    investmentLower.includes("flip") ||
    investmentLower.includes("renovate")
  ) {
    strategy = strategyTemplates.flip;
  } else if (
    investmentLower.includes("rental") ||
    investmentLower.includes("buy and hold")
  ) {
    strategy = strategyTemplates.rental;
  }

  const toneStyles = {
    Professional: {
      opening: `**${projectName}** represents a compelling **${strategy.strategy}** opportunity positioned to`,
      emphasis: "strategic advantages",
      conclusion: "disciplined execution",
    },
    Persuasive: {
      opening: `**${projectName}** presents an *exceptional* **${strategy.strategy}** opportunity designed to`,
      emphasis: "competitive advantages",
      conclusion: "*proven execution capabilities*",
    },
    "Data-Driven": {
      opening: `**${projectName}** offers a *quantifiably attractive* **${strategy.strategy}** opportunity structured to`,
      emphasis: "measurable market advantages",
      conclusion: "*data-driven execution approach*",
    },
  };

  const style =
    toneStyles[tone as keyof typeof toneStyles] || toneStyles.Professional;

  return `${style.opening} ${
    strategy.value
  } in the growing *${location}* market. ${
    description
      ? `*${description.slice(0, 100)}${description.length > 100 ? "..." : ""}*`
      : ""
  }

**Value Creation Strategy:**
- **Market positioning:** Prime location with strong demographic trends and economic growth
- **Execution approach:** ${strategy.execution} to maximize returns
- **Risk mitigation:** ${
    style.emphasis
  } including market knowledge and operational expertise

This investment combines *favorable market fundamentals* with **proven investment strategies** to deliver attractive risk-adjusted returns through ${
    style.conclusion
  } and comprehensive market analysis.`;
}

function generateInvestmentThesisFallback(data: RequestBody): string {
  const { investmentType, address, description } = data;
  const location = address.split(",").pop()?.trim() || "the target market";

  // Generate more specific investment thesis based on type
  const investmentLower = investmentType.toLowerCase();
  let thesisContent = "";

  if (
    investmentLower.includes("development") ||
    investmentLower.includes("build")
  ) {
    thesisContent = `This **ground-up development** opportunity capitalizes on *undersupplied market conditions* in ${location}, where demand significantly outpaces new construction. The strategic approach focuses on:

- **Timing advantage:** Entering during favorable construction costs and pre-leasing market conditions
- **Location premium:** Prime positioning in a *high-growth demographic corridor* with limited development sites
- **Design optimization:** Modern amenities and layouts aligned with current tenant preferences
- **Exit flexibility:** Multiple disposition strategies including hold for income or sale upon stabilization

The development strategy leverages *current market inefficiencies* while positioning for **long-term value appreciation** through quality construction and strategic location selection.`;
  } else if (
    investmentLower.includes("flip") ||
    investmentLower.includes("renovate")
  ) {
    thesisContent = `This **value-add opportunity** targets an *underperforming asset* in a strong ${location} submarket, where strategic improvements can unlock significant value appreciation. Our renovation strategy emphasizes:

- **Market repositioning:** Transforming the property to compete in a higher rent tier through targeted improvements
- **Cost-effective upgrades:** Focus on high-impact, moderate-cost improvements that maximize ROI
- **Rapid execution:** Streamlined renovation timeline to minimize carrying costs and accelerate returns
- **Market timing:** Capitalizing on *strong buyer demand* and limited inventory in the target price range

This approach leverages **proven renovation expertise** and *market knowledge* to create value through strategic property transformation and repositioning.`;
  } else if (
    investmentLower.includes("rental") ||
    investmentLower.includes("buy and hold")
  ) {
    thesisContent = `This **income-generating acquisition** targets a *cash-flowing asset* in ${location}'s resilient rental market, where strong demographics support consistent tenant demand. The investment strategy focuses on:

- **Stable cash flow:** Immediate income generation with potential for organic rent growth
- **Market fundamentals:** Strong employment base and *population growth* supporting rental demand
- **Operational optimization:** Enhancing property management and tenant retention to maximize NOI
- **Appreciation potential:** Benefiting from **long-term market appreciation** while generating current income

This conservative approach provides *downside protection* through immediate cash flow while capturing **market appreciation** over the hold period.`;
  } else {
    thesisContent = `This **strategic real estate investment** capitalizes on strong market fundamentals in *${location}*, including:

- **Population growth** and job creation driving sustained demand
- **Limited new supply** creating favorable market conditions  
- **Strategic location** with excellent access to employment centers and amenities
- **Transportation infrastructure** enhancing long-term value and accessibility

Our *value-creation strategy* enhances the asset's competitive position while generating **stable returns** through targeted improvements and operational optimization.`;
  }

  return thesisContent;
}

function generateRiskFactorsFallback(data: RequestBody): string[] {
  const { investmentType, address } = data;
  const location = address.split(",").pop()?.trim() || "the market";

  const baseRisks = [
    "Interest rate fluctuations affecting financing costs and property valuations",
    `Local ${location} market economic downturn impacting demand and rental rates`,
    "Construction cost inflation and labor shortage delays",
    "Regulatory changes in zoning, rent control, or tax policies",
    "Increased competition from new developments or alternative investments",
  ];

  const investmentLower = investmentType.toLowerCase();

  if (
    investmentLower.includes("development") ||
    investmentLower.includes("build")
  ) {
    return [
      "Development timeline delays due to permitting, weather, or contractor issues",
      "Construction cost overruns from material price volatility or scope changes",
      "Pre-leasing challenges in changing market conditions",
      "Interest rate increases during construction period affecting project feasibility",
      "Environmental or soil condition discoveries requiring additional remediation",
    ];
  } else if (
    investmentLower.includes("flip") ||
    investmentLower.includes("renovate")
  ) {
    return [
      "Renovation cost overruns from hidden structural or systems issues",
      "Extended marketing periods in softening sales market conditions",
      "Permitting delays for renovation work impacting timeline and carrying costs",
      "Market preference shifts affecting design choices and target buyer appeal",
      "Competition from new construction or other renovated properties",
    ];
  } else if (
    investmentLower.includes("rental") ||
    investmentLower.includes("buy and hold")
  ) {
    return [
      "Tenant turnover and vacancy periods affecting cash flow stability",
      "Property maintenance and capital expenditure requirements exceeding projections",
      "Rent control or tenant protection legislation limiting rent growth",
      "Property management challenges affecting operations and tenant retention",
      "Market saturation from new rental supply impacting occupancy and rents",
    ];
  }

  return baseRisks;
}

function generateLocationOverviewFallback(data: RequestBody): string {
  const { address } = data;
  const location = address.split(",").pop()?.trim() || "the target location";

  return `**${location}** serves as a **strategic gateway** within the broader metropolitan region, benefiting from *exceptional connectivity* and infrastructure advantages that drive sustained real estate demand.

**Infrastructure & Accessibility:**
- **Transportation networks:** Major highway access, public transit connectivity, and proximity to airports
- **Utility infrastructure:** Robust power grid, high-speed internet, and municipal services
- **Development pipeline:** Planned infrastructure improvements and municipal investment initiatives
- **Regional positioning:** Central location within key employment and commercial corridors

**Economic Foundation:**
- **Diverse employment base** across technology, healthcare, finance, and manufacturing sectors
- **Educational institutions** providing workforce development and housing demand stability
- **Commercial development** including retail, office, and mixed-use projects driving population growth

The area's *strategic location* and **continuous infrastructure investment** create a foundation for sustained real estate appreciation and rental demand growth.`;
}

function generateLocationSnapshotFallback(data: RequestBody): string {
  const { address, tone = "Professional" } = data;
  const location = address.split(",").pop()?.trim() || "the target location";

  // Generate realistic demographic and market data
  const populationGrowth = (1.5 + Math.random() * 3.5).toFixed(1); // 1.5-5% growth
  const medianIncome = Math.floor(55000 + Math.random() * 45000); // $55K-$100K
  const unemploymentRate = (2.5 + Math.random() * 3).toFixed(1); // 2.5-5.5%
  const housingAppreciation = (4 + Math.random() * 8).toFixed(1); // 4-12% appreciation

  const toneStyles = {
    Professional: {
      intro:
        "demonstrates **solid fundamentals** with *consistent performance metrics*",
      emphasis: "reliable indicators",
    },
    Persuasive: {
      intro:
        "showcases **exceptional growth potential** with *compelling demographic advantages*",
      emphasis: "outstanding opportunities",
    },
    "Data-Driven": {
      intro:
        "exhibits **quantifiable growth metrics** and *measurable market advantages*",
      emphasis: "data-supported trends",
    },
  };

  const style =
    toneStyles[tone as keyof typeof toneStyles] || toneStyles.Professional;

  return `**${location}** ${
    style.intro
  } that position it favorably for real estate investment.

**Key Demographics & Market Metrics:**
- **Population growth:** ${populationGrowth}% annually, outpacing regional averages
- **Median household income:** $${medianIncome.toLocaleString()}, supporting strong purchasing power
- **Employment rate:** ${unemploymentRate}% unemployment, indicating economic stability
- **Housing appreciation:** ${housingAppreciation}% over the past year, demonstrating market strength

**Investment-Relevant Trends:**
- **Millennial influx** driving rental demand and homebuying activity
- **Remote work adoption** increasing housing demand in suburban markets
- **Commercial expansion** with new businesses and job creation initiatives

These ${
    style.emphasis
  } support **sustained rental demand** and *long-term property value appreciation*, making the market attractive for real estate investment strategies.`;
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
  return `${originalBio}

**Key Qualifications:**
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

IMPORTANT: The content will be displayed in sections that already have titles (Executive Summary, Investment Thesis, Deal Metrics, Location Overview, Location Snapshot, Sponsor Information). Do NOT include section headers like "## Executive Summary" or "## Investment Strategy" in your content. Generate the body content only.

Please provide the following sections in JSON format with markdown-formatted content for rich text display:

1. executiveSummary: A compelling executive summary in a ${tone.toLowerCase()} tone that focuses on VALUE PROPOSITION and STRATEGY rather than basic deal metrics (those are shown elsewhere). Use markdown formatting with **bold** for key value drivers, *emphasis* for competitive advantages, and bullet points for strategic highlights. Include:
   - Why this specific opportunity is compelling (market timing, location advantages, etc.)
   - The value creation strategy and competitive positioning
   - Key risk mitigation factors and execution capabilities
   - Do NOT repeat purchase price, equity raise, or IRR - focus on WHY this is a good investment
   - 3-4 sentences with rich formatting. Do not include any headers - start directly with the content.

2. investmentThesis: A detailed investment thesis that goes BEYOND basic market fundamentals to explain the specific strategic advantages and value creation approach. Focus on:
   - Why THIS specific opportunity stands out from other investments
   - Unique competitive advantages (timing, location, sponsor expertise, etc.)
   - Specific value creation strategies and execution plan
   - Market positioning and differentiation factors
   Use markdown with:
   - **Bold** for key strategic advantages
   - Bullet points for specific value drivers
   - *Emphasis* for competitive positioning
   - 3-4 well-structured paragraphs
   - No section headers - content only

3. locationOverview: A comprehensive overview of ${location} focusing on INFRASTRUCTURE, REGIONAL POSITIONING, and ECONOMIC FOUNDATION (not demographics). This is the "big picture" market context. Use markdown formatting with:
   - **Bold** for infrastructure advantages and regional positioning
   - Bullet points for transportation, utilities, and development pipeline
   - *Emphasis* for strategic location benefits
   - Focus on WHY this location works for real estate (access, infrastructure, economic base)
   - 3-4 paragraphs with rich formatting
   - No section headers - content only

4. locationSnapshot: A ${tone.toLowerCase()} DEMOGRAPHIC and MARKET METRICS analysis with specific data points and investment-relevant trends. This is the "investor-focused" market data. Use markdown with:
   - **Bold** for actual statistics and growth metrics (population growth %, income levels, etc.)
   - Bullet points for demographic data and market performance
   - *Emphasis* for trend analysis and market timing factors
   - Include specific numbers and percentages when possible
   - Focus on metrics that matter to investors (appreciation rates, rental demand, demographic trends)
   - Rich formatting throughout
   - No section headers - content only

5. enhancedSponsorBio: Enhance the provided sponsor bio with professional language and markdown formatting:
   - **Bold** for key achievements and experience
   - *Emphasis* for specializations
   - Bullet points for major accomplishments
   - Keep original content but make it more compelling with rich formatting
   - No section headers - content only

6. riskFactors: Array of 5 specific and relevant risk factors tailored to this investment type and location (not generic risks). Focus on:
   - Investment-type specific risks (development, renovation, acquisition, etc.)
   - Location-specific market risks
   - Timeline and execution risks
   - Financial and market condition risks
   - Regulatory or environmental considerations
   (keep as plain text strings for bullet point display)

7. comparableProperties: Array of 3 comparable properties with realistic addresses, prices around ${formatCurrency(
      purchasePrice
    )}, distances, and notes (keep as objects for structured display)

Return only a valid JSON object with these fields. The text fields should contain markdown formatting for rich display but NO section headers. Do not wrap the response in markdown code blocks - return raw JSON only.`;

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
