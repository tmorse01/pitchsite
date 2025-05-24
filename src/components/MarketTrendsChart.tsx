import { Paper, Title, Text, Stack, SimpleGrid } from "@mantine/core";
import { LineChart } from "@mantine/charts";

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
          {" "}
          {/* Median Home Prices */}
          <Stack gap="sm">
            <Text fw={600} size="sm">
              Median Home Prices (5-Year)
            </Text>
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
            <Text fw={600} size="sm">
              Annual Rent Growth
            </Text>
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
            <Text fw={600} size="sm">
              Cap Rate Trends
            </Text>
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
