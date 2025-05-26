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
import { motion, useReducedMotion } from "framer-motion";
import MarketTrendsChart from "../components/MarketTrendsChart";
import ComparableProperties from "../components/ComparableProperties";
import LocationMap from "../components/LocationMap";
import ROISimulator from "../components/ROISimulator";
import MarkdownRenderer from "../components/MarkdownRenderer";
import AnimatedSection from "../components/animations/AnimatedSection";
import NumberCounter from "../components/animations/NumberCounter";
import {
  slideInLeft,
  slideInRight,
  heroAnimations,
  staggerContainer,
  staggerItem,
  paperHover,
  buttonHover,
  listVariants,
  listItemVariants,
  pulseCTA,
} from "../utils/animations";

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
  const shouldReduceMotion = useReducedMotion();
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
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
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
            <motion.div {...buttonHover}>
              <Button variant="light" onClick={() => navigate("/")}>
                Create Your Own Deck
              </Button>
            </motion.div>
          </Group>
        </Paper>
      </motion.div>{" "}
      {/* Hero Section */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={heroAnimations.title}
      >
        <Paper shadow="sm" p="xl" radius="md" mb="xl" bg="indigo.0">
          <Stack gap="md" align="center" ta="center">
            <motion.div variants={heroAnimations.badge}>
              <Badge size="lg" variant="filled" color="indigo">
                Investment Opportunity
              </Badge>
            </motion.div>
            <motion.div variants={heroAnimations.title}>
              <Title order={1} size="h1" c="indigo">
                {formData.projectName}
              </Title>
            </motion.div>
            <motion.div variants={heroAnimations.title}>
              <Text size="lg" c="dimmed">
                {formData.address}
              </Text>
            </motion.div>
            <motion.div
              variants={heroAnimations.metrics}
              initial="initial"
              animate="animate"
            >
              <Group gap="xl" mt="md">
                <motion.div variants={staggerItem}>
                  <Stack gap={4} align="center">
                    <Text size="sm" c="dimmed" fw={500}>
                      Purchase Price
                    </Text>
                    <Text size="xl" fw={700} c="indigo">
                      <NumberCounter
                        value={formData.purchasePrice}
                        prefix="$"
                        duration={1.2}
                      />
                    </Text>
                  </Stack>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Stack gap={4} align="center">
                    <Text size="sm" c="dimmed" fw={500}>
                      Equity Raise
                    </Text>
                    <Text size="xl" fw={700} c="indigo">
                      <NumberCounter
                        value={formData.totalRaise}
                        prefix="$"
                        duration={1.4}
                      />
                    </Text>
                  </Stack>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Stack gap={4} align="center">
                    <Text size="sm" c="dimmed" fw={500}>
                      Target IRR
                    </Text>
                    <Text size="xl" fw={700} c="indigo">
                      {formData.targetIrr}
                    </Text>
                  </Stack>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Stack gap={4} align="center">
                    <Text size="sm" c="dimmed" fw={500}>
                      Hold Period
                    </Text>
                    <Text size="xl" fw={700} c="indigo">
                      {formData.holdPeriod}
                    </Text>
                  </Stack>
                </motion.div>
              </Group>
            </motion.div>
          </Stack>
        </Paper>
      </motion.div>{" "}
      {/* Content Sections */}
      <Stack gap="xl">
        {/* Executive Summary */}
        <AnimatedSection delay={0.2}>
          <motion.div {...paperHover}>
            <Paper shadow="sm" p="xl" radius="md">
              <Stack gap="md">
                <Title order={2} c="indigo">
                  Executive Summary
                </Title>
                <MarkdownRenderer content={generatedContent.executiveSummary} />
              </Stack>
            </Paper>
          </motion.div>
        </AnimatedSection>
        {/* Investment Thesis & Deal Metrics */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <motion.div variants={slideInLeft} {...paperHover}>
              <Paper shadow="sm" p="xl" radius="md" h="100%">
                <Stack gap="md">
                  <Title order={2} c="indigo">
                    Investment Thesis
                  </Title>
                  <MarkdownRenderer
                    content={generatedContent.investmentThesis}
                  />
                </Stack>
              </Paper>
            </motion.div>
            <motion.div variants={slideInRight} {...paperHover}>
              <Paper shadow="sm" p="xl" radius="md" h="100%">
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
            </motion.div>
          </SimpleGrid>
        </motion.div>
        {/* Location & Risk Factors */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" h="100%">
            <motion.div variants={slideInLeft} {...paperHover}>
              <Paper shadow="sm" p="xl" radius="md">
                <Stack gap="md">
                  <Title order={2} c="indigo">
                    Location Overview
                  </Title>
                  <MarkdownRenderer
                    content={generatedContent.locationOverview}
                  />
                </Stack>
              </Paper>
            </motion.div>
            <motion.div variants={slideInRight} {...paperHover}>
              <Paper shadow="sm" p="xl" radius="md" h="100%">
                <Stack gap="md">
                  <Title order={2} c="indigo">
                    Risk Factors
                  </Title>
                  <motion.div
                    variants={listVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Stack gap="xs">
                      {generatedContent.riskFactors.map((risk, index) => (
                        <motion.div key={index} variants={listItemVariants}>
                          <Text size="sm">• {risk}</Text>
                        </motion.div>
                      ))}
                    </Stack>
                  </motion.div>
                </Stack>
              </Paper>
            </motion.div>
          </SimpleGrid>
        </motion.div>{" "}
        {/* Location Snapshot - Enhanced with AI tone */}
        <AnimatedSection delay={0.4}>
          <motion.div {...paperHover}>
            <Paper shadow="sm" p="xl" radius="md">
              <Stack gap="md">
                <Title order={2} c="indigo">
                  Location Snapshot
                </Title>
                <MarkdownRenderer content={generatedContent.locationSnapshot} />
              </Stack>
            </Paper>
          </motion.div>
        </AnimatedSection>
        {/* Location Map with Zillow Links */}
        <AnimatedSection delay={0.2}>
          <LocationMap address={formData.address} />
        </AnimatedSection>
        {/* Market Trends Analysis */}
        <AnimatedSection delay={0.3}>
          <MarketTrendsChart data={generatedContent.marketTrends} />
        </AnimatedSection>
        {/* Comparable Properties */}
        <AnimatedSection delay={0.4}>
          <ComparableProperties
            properties={generatedContent.comparableProperties}
          />
        </AnimatedSection>
        {/* ROI Simulator */}
        <AnimatedSection delay={0.5}>
          <ROISimulator
            purchasePrice={formData.purchasePrice}
            initialRent={Math.floor(formData.purchasePrice * 0.008)} // Estimate 0.8% of purchase price as monthly rent
          />
        </AnimatedSection>
        {/* Sponsor Information */}
        <AnimatedSection delay={0.6}>
          <motion.div {...paperHover}>
            <Paper shadow="sm" p="xl" radius="md">
              <Stack gap="md">
                <Title order={2} c="indigo">
                  Sponsor Information
                </Title>
                <MarkdownRenderer content={generatedContent.sponsorBio} />
              </Stack>
            </Paper>
          </motion.div>
        </AnimatedSection>
        {/* Contact Footer */}
        <AnimatedSection delay={0.7}>
          <motion.div {...paperHover}>
            <Paper shadow="sm" p="xl" radius="md" bg="gray.0">
              <Stack gap="md" align="center" ta="center">
                <Title order={3}>Interested in This Investment?</Title>
                <Text c="dimmed">
                  Contact the sponsor for more information and investment
                  documentation
                </Text>
                <motion.div
                  {...buttonHover}
                  animate={shouldReduceMotion ? {} : pulseCTA}
                >
                  <Button variant="filled" size="lg">
                    Contact Sponsor
                  </Button>
                </motion.div>
              </Stack>
            </Paper>
          </motion.div>
        </AnimatedSection>
      </Stack>
      {/* Footer */}
      <AnimatedSection delay={0.8}>
        <Box mt="xl" pt="xl" style={{ borderTop: "1px solid #e9ecef" }}>
          <Group justify="center">
            <Text size="sm" c="dimmed">
              Powered by PitchSite - Made by Taylor Morse
            </Text>
            <motion.div {...buttonHover}>
              <Button
                variant="subtle"
                size="compact-sm"
                onClick={() => navigate("/")}
              >
                Create your own pitch deck
              </Button>
            </motion.div>
          </Group>
        </Box>
      </AnimatedSection>
    </>
  );
}
