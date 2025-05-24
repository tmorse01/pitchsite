import { Paper, Title, Text, Stack, SimpleGrid, Group } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { IconHome, IconTrendingUp, IconPercentage } from "@tabler/icons-react";

interface MarketTrendsData {
  priceTrends: Array<{
    year: string;
    medianPrice: number;
    rentGrowth: number;
    capRate: number;
  }>;
  summary: string;
}

interface MarketTrendsChartProps {
  data: MarketTrendsData;
}

export default function MarketTrendsChart({ data }: MarketTrendsChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => `${value}%`;

  return (
    <Paper shadow="sm" p="xl" radius="md">
      <Stack gap="lg">
        <Title order={2} c="indigo">
          Market Trends Analysis
        </Title>

        <Text size="sm" c="dimmed">
          {data.summary}
        </Text>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
          {/* Median Home Prices */}
          <Stack gap="sm">
            <Group gap="xs">
              <IconHome size={16} color="var(--mantine-color-indigo-6)" />
              <Text fw={600} size="sm">
                Median Home Prices (5-Year)
              </Text>
            </Group>
            <LineChart
              h={250}
              data={data.priceTrends}
              dataKey="year"
              series={[{ name: "medianPrice", color: "indigo.6" }]}
              valueFormatter={formatCurrency}
              curveType="linear"
              connectNulls={false}
              strokeWidth={3}
            />
          </Stack>
          {/* Rent Growth */}
          <Stack gap="sm">
            <Group gap="xs">
              <IconTrendingUp
                size={16}
                color="var(--mantine-color-emerald-6)"
              />
              <Text fw={600} size="sm">
                Annual Rent Growth
              </Text>
            </Group>
            <LineChart
              h={250}
              data={data.priceTrends}
              dataKey="year"
              series={[{ name: "rentGrowth", color: "emerald.6" }]}
              valueFormatter={formatPercent}
              curveType="linear"
              connectNulls={false}
              strokeWidth={3}
            />
          </Stack>
          {/* Cap Rates */}
          <Stack gap="sm">
            <Group gap="xs">
              <IconPercentage size={16} color="var(--mantine-color-orange-6)" />
              <Text fw={600} size="sm">
                Cap Rate Trends
              </Text>
            </Group>
            <LineChart
              h={250}
              data={data.priceTrends}
              dataKey="year"
              series={[{ name: "capRate", color: "orange.6" }]}
              valueFormatter={formatPercent}
              curveType="linear"
              connectNulls={false}
              strokeWidth={3}
            />
          </Stack>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
