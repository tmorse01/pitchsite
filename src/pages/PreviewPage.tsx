import { useEffect, useState } from "react";
import {
  Title,
  Text,
  Button,
  Group,
  Paper,
  Stack,
  SimpleGrid,
  Badge,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import MarketTrendsChart from "../components/MarketTrendsChart";
import ComparableProperties from "../components/ComparableProperties";
import LocationMap from "../components/LocationMap";
import ROISimulator from "../components/ROISimulator";

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

export default function PreviewPage() {
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("pitchData");
    if (stored) {
      setPitchData(JSON.parse(stored));
    } else {
      navigate("/create"); // Redirect if no data
    }
  }, [navigate]);

  const handleShare = () => {
    // Generate a simple share ID and store the data
    const shareId = Math.random().toString(36).substring(2, 8);
    localStorage.setItem(`pitch_${shareId}`, JSON.stringify(pitchData));
    navigate(`/share/${shareId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  if (!pitchData) {
    return <Text ta="center">Loading...</Text>;
  }

  const { formData, generatedContent } = pitchData;
  return (
    <>
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
        {/* Executive Summary */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="md">
            <Title order={2} c="indigo">
              Executive Summary
            </Title>
            <Text>{generatedContent.executiveSummary}</Text>
          </Stack>
        </Paper>
        {/* Investment Thesis & Deal Metrics */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Paper shadow="sm" p="xl" radius="md" h="fit-content">
            <Stack gap="md">
              <Title order={2} c="indigo">
                Investment Thesis
              </Title>
              <Text>{generatedContent.investmentThesis}</Text>
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
          <Paper shadow="sm" p="xl" radius="md">
            <Stack gap="md">
              <Title order={2} c="indigo">
                Location Overview
              </Title>
              <Text>{generatedContent.locationOverview}</Text>
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
        {/* Location Snapshot - Enhanced with AI tone */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="md">
            <Title order={2} c="indigo">
              Location Snapshot
            </Title>
            <Text>{generatedContent.locationSnapshot}</Text>
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
        {/* Sponsor Information */}
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="md">
            <Title order={2} c="indigo">
              Sponsor Information
            </Title>
            <Text>{generatedContent.sponsorBio}</Text>
          </Stack>
        </Paper>
        {/* Contact Footer */}
        <Paper shadow="sm" p="xl" radius="md" bg="gray.0">
          <Stack gap="md" align="center" ta="center">
            <Title order={3}>Ready to Invest?</Title>
            <Text c="dimmed">
              Contact us for more information and investment documentation
            </Text>
            <Group>
              <Button variant="filled" size="lg">
                Contact Sponsor
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                Share This Deck
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>

      {/* Action Buttons */}
      <Group justify="center" mt="xl">
        <Button variant="default" onClick={() => navigate("/create")}>
          Create Another Deck
        </Button>{" "}
        <Button variant="filled" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Group>
    </>
  );
}
