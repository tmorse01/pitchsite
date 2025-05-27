import { useEffect, useState } from "react";
import { Text, Button, Group, Stack, SimpleGrid } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { savePitchDeck } from "../api";
import MarketTrendsChart from "../components/MarketTrendsChart";
import ComparableProperties from "../components/ComparableProperties";
import LocationMap from "../components/LocationMap";
import ROISimulator from "../components/ROISimulator";
import HeroSection from "../components/shared/HeroSection";
import ContentSection from "../components/shared/ContentSection";
import InvestmentThesis from "../components/shared/InvestmentThesis";
import DealMetrics from "../components/shared/DealMetrics";
import LocationOverview from "../components/shared/LocationOverview";
import RiskFactors from "../components/shared/RiskFactors";
import ContactFooter from "../components/shared/ContactFooter";
import {
  calculateDealMetrics,
  getRiskColor,
  formatCurrency,
  calculateEstimatedRent,
} from "../utils/dealMetrics";

interface PitchData {
  formData: {
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
  };
  generatedContent: {
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
    dealMetrics?: {
      capRate: string;
      cashOnCashReturn: string;
      riskScore: number;
      marketVolatility: string;
      breakEvenAnalysis: string;
    };
  };
}

export default function PreviewPage() {
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const [sharing, setSharing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("pitchData");
    if (stored) {
      setPitchData(JSON.parse(stored));
    } else {
      navigate("/create"); // Redirect if no data
    }
  }, [navigate]);
  const handleShare = async () => {
    if (!pitchData) return;

    try {
      setSharing(true);

      // Save pitch deck to MongoDB
      const result = await savePitchDeck(pitchData);

      // Navigate to the share page with the generated shareId
      navigate(`/share/${result.shareId}`);
    } catch (error) {
      console.error("Error sharing pitch deck:", error);
      // For now, fall back to localStorage as backup
      const shareId = Math.random().toString(36).substring(2, 8);
      localStorage.setItem(`pitch_${shareId}`, JSON.stringify(pitchData));
      navigate(`/share/${shareId}`);
    } finally {
      setSharing(false);
    }
  };

  if (!pitchData) {
    return <Text ta="center">Loading...</Text>;
  }
  const { formData, generatedContent } = pitchData;
  const aiMetrics = calculateDealMetrics(formData);
  return (
    <>
      {/* Hero Section */}
      <HeroSection
        formData={formData}
        formatCurrency={formatCurrency}
        animated={false}
      />

      {/* Content Sections */}
      <Stack gap="xl">
        {/* Executive Summary */}
        <ContentSection
          title="Executive Summary"
          content={generatedContent.executiveSummary}
          animated={false}
        />
        {/* Investment Thesis & Deal Metrics */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <InvestmentThesis
            investmentThesis={generatedContent.investmentThesis}
            animated={false}
          />
          <DealMetrics
            formData={formData}
            dealMetrics={aiMetrics}
            formatCurrency={formatCurrency}
            getRiskColor={getRiskColor}
            animated={false}
          />
        </SimpleGrid>
        {/* Location  */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <LocationOverview
            locationOverview={generatedContent.locationOverview}
            animated={false}
          />
          <ContentSection
            title="Location Snapshot"
            content={generatedContent.locationSnapshot}
            animated={false}
          />
        </SimpleGrid>
        {/* Risk Factors */}
        <RiskFactors
          riskFactors={generatedContent.riskFactors}
          animated={false}
        />
        {/* Location Map with Zillow Links */}
        <LocationMap address={formData.address} />
        {/* Market Trends Analysis */}
        <MarketTrendsChart data={generatedContent.marketTrends} />
        {/* Comparable Properties */}
        <ComparableProperties
          properties={generatedContent.comparableProperties}
        />
        {/* ROI Simulator */}
        <ROISimulator
          purchasePrice={formData.purchasePrice}
          initialRent={calculateEstimatedRent(formData.purchasePrice)}
        />
        {/* Sponsor Information */}
        <ContentSection
          title="Sponsor Information"
          content={generatedContent.sponsorBio}
          animated={false}
        />
        {/* Contact Footer */}{" "}
        <ContactFooter
          animated={false}
          onShareDeck={handleShare}
          showShareButton={true}
          shareLoading={sharing}
        />
      </Stack>

      {/* Action Buttons */}
      <Group justify="center" mt="xl">
        <Button variant="default" onClick={() => navigate("/create")}>
          Create Another Deck
        </Button>
        <Button variant="filled" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Group>
    </>
  );
}
