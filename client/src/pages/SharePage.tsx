import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Text,
  Button,
  Group,
  Stack,
  Box,
  Alert,
  SimpleGrid,
  TextInput,
  Loader,
} from "@mantine/core";
import { usePitchDeck, useIncrementViewCount } from "../api";
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

export default function SharePage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const navigate = useNavigate();
  const viewCountIncrementedRef = useRef(false);

  // React Query hooks
  const {
    data: pitchData,
    isLoading,
    error,
    refetch,
  } = usePitchDeck(deckId!, password);

  const incrementViewMutation = useIncrementViewCount();

  // Handle password requirement
  useEffect(() => {
    if (error instanceof Error && error.message === "PASSWORD_REQUIRED") {
      setNeedsPassword(true);
    }
  }, [error]); // Increment view count when pitch data is successfully loaded (only once)
  useEffect(() => {
    if (pitchData && deckId && !viewCountIncrementedRef.current) {
      viewCountIncrementedRef.current = true;
      incrementViewMutation.mutate(deckId);
    }
  }, [pitchData, deckId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handlePasswordSubmit = () => {
    setNeedsPassword(false);
    refetch();
  };

  if (isLoading) {
    return (
      <Stack align="center" justify="center" h="50vh">
        <Loader size="lg" />
        <Text ta="center" size="lg">
          Loading pitch deck...
        </Text>
      </Stack>
    );
  }

  if (needsPassword) {
    return (
      <Stack align="center" justify="center" h="50vh" maw={400} mx="auto">
        <Text ta="center" size="lg" mb="md">
          This pitch deck is password protected
        </Text>
        <TextInput
          placeholder="Enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handlePasswordSubmit();
            }
          }}
        />
        <Button onClick={handlePasswordSubmit} mt="sm">
          Access Deck
        </Button>
      </Stack>
    );
  }

  if (
    error &&
    !(error instanceof Error && error.message === "PASSWORD_REQUIRED")
  ) {
    return (
      <Alert color="red" title="Error">
        <Text>
          {error instanceof Error ? error.message : "Failed to load pitch deck"}
        </Text>
        <Button mt="md" onClick={() => navigate("/")}>
          Go to Homepage
        </Button>
      </Alert>
    );
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
        />{" "}
        {/* Investment Thesis & Deal Metrics */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <InvestmentThesis
            investmentThesis={generatedContent.investmentThesis}
            animated={true}
          />{" "}
          <DealMetrics
            formData={{
              investmentType: formData.investmentType,
              purchasePrice: formData.purchasePrice,
              totalRaise: formData.totalRaise,
              targetIrr: formData.targetIrr,
              holdPeriod: formData.holdPeriod,
            }}
            dealMetrics={calculateDealMetrics({
              purchasePrice: formData.purchasePrice,
              totalRaise: formData.totalRaise,
            })}
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
