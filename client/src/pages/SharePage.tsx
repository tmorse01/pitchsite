import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  Button,
  Group,
  Paper,
  Stack,
  SimpleGrid,
  Badge,
  Box,
  Alert,
} from "@mantine/core";
import MarketTrendsChart from "../components/MarketTrendsChart";
import ComparableProperties from "../components/ComparableProperties";
import LocationMap from "../components/LocationMap";
import ROISimulator from "../components/ROISimulator";
import MarkdownRenderer from "../components/MarkdownRenderer";

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };
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
      <Paper shadow="sm" p="md" radius="md" mb="xl" bg="blue.0">
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Text size="sm" c="dimmed" fw={500}>
              Shared Investment Opportunity
            </Text>
            <Text size="lg" fw={700}>
              Deck ID: {deckId}
            </Text>
          </Stack>
          <Button variant="light" onClick={() => navigate("/")}>
            Create Your Own Deck
          </Button>
        </Group>
      </Paper>

      {/* Hero Section */}
      <Paper shadow="sm" p="xl" radius="md" mb="xl" bg="indigo.0">
        <Stack gap="md" align="center" ta="center">
          <Badge size="lg" variant="filled" color="indigo">
            Investment Opportunity
          </Badge>
          <Title order={1} size="h1" c="indigo">
            {formData.projectName}
          </Title>
          <Text size="lg" c="dimmed">
            {formData.address}
          </Text>
          <Group gap="xl" mt="md">
            <Stack gap={4} align="center">
              <Text size="sm" c="dimmed" fw={500}>
                Purchase Price
              </Text>
              <Text size="xl" fw={700} c="indigo">
                {formatCurrency(formData.purchasePrice)}
              </Text>
            </Stack>
            <Stack gap={4} align="center">
              <Text size="sm" c="dimmed" fw={500}>
                Equity Raise
              </Text>
              <Text size="xl" fw={700} c="indigo">
                {formatCurrency(formData.totalRaise)}
              </Text>
            </Stack>
            <Stack gap={4} align="center">
              <Text size="sm" c="dimmed" fw={500}>
                Target IRR
              </Text>
              <Text size="xl" fw={700} c="indigo">
                {formData.targetIrr}
              </Text>
            </Stack>
            <Stack gap={4} align="center">
              <Text size="sm" c="dimmed" fw={500}>
                Hold Period
              </Text>
              <Text size="xl" fw={700} c="indigo">
                {formData.holdPeriod}
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Paper>

      {/* Content Sections */}
      <Stack gap="xl">
        {" "}
        {/* Executive Summary */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="md">
            <Title order={2} c="indigo">
              Executive Summary
            </Title>
            <MarkdownRenderer content={generatedContent.executiveSummary} />
          </Stack>
        </Paper>
        {/* Investment Thesis & Deal Metrics */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {" "}
          <Paper shadow="sm" p="xl" radius="md" h="fit-content">
            <Stack gap="md">
              <Title order={2} c="indigo">
                Investment Thesis
              </Title>
              <MarkdownRenderer content={generatedContent.investmentThesis} />
            </Stack>
          </Paper>
          <Paper shadow="sm" p="xl" radius="md" h="fit-content">
            <Stack gap="md">
              <Title order={2} c="indigo">
                Deal Metrics
              </Title>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={500}>Investment Type:</Text>
                  <Badge variant="light">{formData.investmentType}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Purchase Price:</Text>
                  <Text>{formatCurrency(formData.purchasePrice)}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Equity Raise:</Text>
                  <Text>{formatCurrency(formData.totalRaise)}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Target IRR:</Text>
                  <Text>{formData.targetIrr}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Hold Period:</Text>
                  <Text>{formData.holdPeriod}</Text>
                </Group>
              </Stack>
            </Stack>
          </Paper>
        </SimpleGrid>
        {/* Location & Risk Factors */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {" "}
          <Paper shadow="sm" p="xl" radius="md">
            <Stack gap="md">
              <Title order={2} c="indigo">
                Location Overview
              </Title>
              <MarkdownRenderer content={generatedContent.locationOverview} />
            </Stack>
          </Paper>
          <Paper shadow="sm" p="xl" radius="md">
            <Stack gap="md">
              <Title order={2} c="indigo">
                Risk Factors
              </Title>
              <Stack gap="xs">
                {generatedContent.riskFactors.map((risk, index) => (
                  <Text key={index} size="sm">
                    • {risk}
                  </Text>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </SimpleGrid>
        {/* Location Snapshot - Enhanced with AI tone */}{" "}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="md">
            <Title order={2} c="indigo">
              Location Snapshot
            </Title>
            <MarkdownRenderer content={generatedContent.locationSnapshot} />
          </Stack>
        </Paper>
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
          initialRent={Math.floor(formData.purchasePrice * 0.008)} // Estimate 0.8% of purchase price as monthly rent
        />
        {/* Sponsor Information */}{" "}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="md">
            <Title order={2} c="indigo">
              Sponsor Information
            </Title>
            <MarkdownRenderer content={generatedContent.sponsorBio} />
          </Stack>
        </Paper>
        {/* Contact Footer */}
        <Paper shadow="sm" p="xl" radius="md" bg="gray.0">
          <Stack gap="md" align="center" ta="center">
            <Title order={3}>Interested in This Investment?</Title>
            <Text c="dimmed">
              Contact the sponsor for more information and investment
              documentation
            </Text>
            <Button variant="filled" size="lg">
              Contact Sponsor
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {/* Footer */}
      <Box mt="xl" pt="xl" style={{ borderTop: "1px solid #e9ecef" }}>
        <Group justify="center">
          <Text size="sm" c="dimmed">
            Powered by PitchSite - Made by Taylor Morse
          </Text>
          <Button
            variant="subtle"
            size="compact-sm"
            onClick={() => navigate("/")}
          >
            Create your own pitch deck
          </Button>
        </Group>
      </Box>
    </>
  );
}
