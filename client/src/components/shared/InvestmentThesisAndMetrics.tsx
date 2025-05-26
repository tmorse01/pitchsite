import {
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Badge,
  Progress,
} from "@mantine/core";
import { motion, useReducedMotion } from "framer-motion";
import {
  slideInLeft,
  slideInRight,
  paperHover,
  staggerContainer,
} from "../../utils/animations";
import MarkdownRenderer from "../MarkdownRenderer";

interface DealMetrics {
  capRate: string;
  cashOnCashReturn: string;
  riskScore: number;
  marketVolatility: string;
  breakEvenAnalysis: string;
}

interface InvestmentThesisAndMetricsProps {
  formData: {
    investmentType: string;
    purchasePrice: number;
    totalRaise: number;
    targetIrr: string;
    holdPeriod: string;
  };
  investmentThesis: string;
  dealMetrics: DealMetrics;
  animated?: boolean;
  formatCurrency: (amount: number) => string;
  getRiskColor: (score: number) => string;
}

export default function InvestmentThesisAndMetrics({
  formData,
  investmentThesis,
  dealMetrics,
  animated = false,
  formatCurrency,
  getRiskColor,
}: InvestmentThesisAndMetricsProps) {
  const shouldReduceMotion = useReducedMotion();

  if (animated && !shouldReduceMotion) {
    return (
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div variants={slideInLeft} {...paperHover}>
          <Paper shadow="sm" p="xl" radius="md" h="100%">
            <Stack gap="md">
              <Title order={2} c="indigo">
                Investment Thesis
              </Title>
              <MarkdownRenderer content={investmentThesis} />
            </Stack>
          </Paper>
        </motion.div>
        <motion.div variants={slideInRight} {...paperHover}>
          <Paper shadow="sm" p="xl" radius="md" h="100%">
            <Stack gap="md">
              <Title order={2} c="indigo">
                Deal Metrics
              </Title>
              <DealMetricsContent
                formData={formData}
                dealMetrics={dealMetrics}
                formatCurrency={formatCurrency}
                getRiskColor={getRiskColor}
              />
            </Stack>
          </Paper>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      <Paper shadow="sm" p="xl" radius="md" h="fit-content">
        <Stack gap="md">
          <Title order={2} c="indigo">
            Investment Thesis
          </Title>
          <MarkdownRenderer content={investmentThesis} />
        </Stack>
      </Paper>
      <Paper shadow="sm" p="xl" radius="md" h="fit-content">
        <Stack gap="md">
          <Title order={2} c="indigo">
            Deal Metrics
          </Title>
          <DealMetricsContent
            formData={formData}
            dealMetrics={dealMetrics}
            formatCurrency={formatCurrency}
            getRiskColor={getRiskColor}
          />
        </Stack>
      </Paper>
    </>
  );
}

// Extracted DealMetricsContent component to avoid duplication
function DealMetricsContent({
  formData,
  dealMetrics,
  formatCurrency,
  getRiskColor,
}: {
  formData: InvestmentThesisAndMetricsProps["formData"];
  dealMetrics: DealMetrics;
  formatCurrency: (amount: number) => string;
  getRiskColor: (score: number) => string;
}) {
  return (
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

      <Paper p="md" bg="gray.0" radius="sm" mt="sm">
        <Text size="sm" fw={600} c="dimmed" mb="xs">
          Analytics
        </Text>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Cap Rate:
            </Text>
            <Badge variant="light" color="blue">
              {dealMetrics.capRate}
            </Badge>
          </Group>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Cash-on-Cash Return:
            </Text>
            <Badge variant="light" color="green">
              {dealMetrics.cashOnCashReturn}
            </Badge>
          </Group>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Risk Score:
            </Text>
            <Group gap="xs">
              <Badge
                variant="light"
                color={getRiskColor(dealMetrics.riskScore)}
              >
                {dealMetrics.riskScore}/10
              </Badge>
              <Progress
                value={(10 - dealMetrics.riskScore) * 10}
                size="sm"
                w={60}
                color={getRiskColor(dealMetrics.riskScore)}
              />
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Market Volatility:
            </Text>
            <Badge
              variant="light"
              color={
                dealMetrics.marketVolatility === "Low"
                  ? "green"
                  : dealMetrics.marketVolatility === "Medium"
                  ? "yellow"
                  : "red"
              }
            >
              {dealMetrics.marketVolatility}
            </Badge>
          </Group>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Break-even:
            </Text>
            <Text size="sm">{dealMetrics.breakEvenAnalysis}</Text>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
