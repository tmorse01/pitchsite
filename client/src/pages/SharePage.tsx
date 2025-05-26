import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Text,
  Button,
  Group,
  Stack,
  Box,
  Alert,
  SimpleGrid,
} from "@mantine/core";
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
import AnimatedWrapper from "../components/shared/AnimatedWrapper";
import DeckHeader from "../components/shared/DeckHeader";
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
  };
}

export default function SharePage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (deckId) {
      const stored = localStorage.getItem(`pitch_${deckId}`);
      if (stored) {
        setPitchData(JSON.parse(stored));
      }
    }
    setLoading(false);
  }, [deckId]);

  // Update document title when pitch data is available
  useEffect(() => {
    if (pitchData?.formData?.projectName) {
      document.title = `${pitchData.formData.projectName} - Investment Opportunity | PitchSite`;
    } else {
      document.title = "Investment Opportunity | PitchSite";
    }

    // Clean up title when component unmounts
    return () => {
      document.title = "PitchSite";
    };
  }, [pitchData]);

  if (loading) {
    return <Text ta="center">Loading...</Text>;
  }

  if (!pitchData) {
    return (
      <Alert color="red" title="Deck Not Found">
        <Text>This pitch deck could not be found or may have expired.</Text>
        <Button mt="md" onClick={() => navigate("/")}>
          Go to Homepage
        </Button>
      </Alert>
    );
  }
  const { formData, generatedContent } = pitchData;
  return (
    <>
      {/* Shared Deck Header */}
      <DeckHeader
        deckId={deckId!}
        onButtonClick={() => navigate("/")}
        animated={true}
      />
      {/* Hero Section */}
      <HeroSection
        formData={formData}
        formatCurrency={formatCurrency}
        animated={true}
      />
      {/* Content Sections */}
      <Stack gap="xl">
        {/* Executive Summary */}
        <ContentSection
          title="Executive Summary"
          content={generatedContent.executiveSummary}
          animated={true}
          delay={0.2}
        />
        {/* Investment Thesis & Deal Metrics */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <InvestmentThesis
            investmentThesis={generatedContent.investmentThesis}
            animated={true}
          />
          <DealMetrics
            formData={formData}
            dealMetrics={calculateDealMetrics(formData)}
            formatCurrency={formatCurrency}
            getRiskColor={getRiskColor}
            animated={true}
          />
        </SimpleGrid>
        {/* Location */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <LocationOverview
            locationOverview={generatedContent.locationOverview}
            animated={true}
          />
          <ContentSection
            title="Location Snapshot"
            content={generatedContent.locationSnapshot}
            animated={true}
            delay={0.4}
          />
        </SimpleGrid>
        {/* Risk Factors */}
        <RiskFactors
          riskFactors={generatedContent.riskFactors}
          animated={true}
        />

        {/* Investment Description */}
        {/* Location Map with Zillow Links */}
        <AnimatedWrapper animated={true} delay={0.2}>
          <LocationMap address={formData.address} />
        </AnimatedWrapper>
        {/* Market Trends Analysis */}
        <AnimatedWrapper animated={true} delay={0.3}>
          <MarketTrendsChart data={generatedContent.marketTrends} />
        </AnimatedWrapper>
        {/* Comparable Properties */}
        <AnimatedWrapper animated={true} delay={0.4}>
          <ComparableProperties
            properties={generatedContent.comparableProperties}
          />
        </AnimatedWrapper>
        {/* ROI Simulator */}
        <AnimatedWrapper animated={true} delay={0.5}>
          <ROISimulator
            purchasePrice={formData.purchasePrice}
            initialRent={calculateEstimatedRent(formData.purchasePrice)}
          />
        </AnimatedWrapper>
        {/* Sponsor Information */}
        <ContentSection
          title="Sponsor Information"
          content={generatedContent.sponsorBio}
          animated={true}
          delay={0.6}
        />
        {/* Contact Footer */}
        <ContactFooter animated={true} delay={0.7} />
      </Stack>
      {/* Footer */}
      <AnimatedWrapper animated={true} delay={0.8}>
        <Box mt="xl" pt="xl" style={{ borderTop: "1px solid #e9ecef" }}>
          <Group justify="center">
            <Text size="sm" c="dimmed">
              Powered by PitchSite - Made by Taylor Morse
            </Text>
            <AnimatedWrapper animated={true} withHover={true}>
              <Button
                variant="subtle"
                size="compact-sm"
                onClick={() => navigate("/")}
              >
                Create your own pitch deck
              </Button>
            </AnimatedWrapper>
          </Group>
        </Box>
      </AnimatedWrapper>
    </>
  );
}
