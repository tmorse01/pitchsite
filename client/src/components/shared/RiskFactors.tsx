import {
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Badge,
  SimpleGrid,
  Box,
  Progress,
} from "@mantine/core";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart, PieChart, AreaChart } from "@mantine/charts";
import {
  IconChartPie,
  IconTrendingUp,
  IconAlertTriangle,
  IconShield,
} from "@tabler/icons-react";
import {
  slideInRight,
  paperHover,
  listVariants,
  listItemVariants,
} from "../../utils/animations";

interface RiskFactorsProps {
  riskFactors: string[];
  animated?: boolean;
}

export default function RiskFactors({
  riskFactors,
  animated = false,
}: RiskFactorsProps) {
  const shouldReduceMotion = useReducedMotion();

  // Silly risk analysis data
  const riskLevelData = [
    { level: "Very Low", count: 2, color: "green.6" },
    { level: "Low", count: 3, color: "yellow.6" },
    { level: "Medium", count: riskFactors.length - 5, color: "orange.6" },
    { level: "High", count: 0, color: "red.6" },
  ];

  const riskTrendData = [
    { month: "Jan", riskScore: 5 },
    { month: "Feb", riskScore: 4 },
    { month: "Mar", riskScore: 6 },
    { month: "Apr", riskScore: 3 },
    { month: "May", riskScore: 4 },
    { month: "Jun", riskScore: 5 },
  ];

  const riskCategoryData = [
    { name: "Market Risk", value: 25, color: "blue.6" },
    { name: "Financial Risk", value: 30, color: "red.6" },
    { name: "Operational Risk", value: 20, color: "orange.6" },
    { name: "Regulatory Risk", value: 15, color: "green.6" },
    { name: "Unicorn Risk", value: 10, color: "purple.6" },
  ];

  const riskMitigationProgress = [
    { strategy: "Insurance Coverage", progress: 85, color: "green" },
    { strategy: "Market Research", progress: 92, color: "blue" },
    { strategy: "Financial Planning", progress: 78, color: "orange" },
    { strategy: "Magic 8-Ball Consultation", progress: 100, color: "purple" },
  ];
  const content = (
    <Paper shadow="sm" p="xl" radius="md" h="100%">
      <Stack gap="md">
        <Title order={2} c="indigo">
          Risk Factors
        </Title>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          {/* Traditional Risk Factors */}
          <Stack gap="xs">
            <Title order={3} size="h5" c="dimmed">
              Traditional Risk Assessment
            </Title>
            {riskFactors.map((risk, index) => (
              <Text key={index} size="sm">
                • {risk}
              </Text>
            ))}
          </Stack>

          {/* Silly Risk Analysis Dashboard */}
          <Stack gap="md">
            <Group gap="xs">
              <IconChartPie size={20} color="var(--mantine-color-indigo-6)" />
              <Title order={3} size="h5" c="indigo">
                Silly Risk Analysis Dashboard™
              </Title>
              <Badge variant="light" color="grape" size="sm">
                Very Scientific
              </Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {/* Risk Level Distribution */}
              <Box>
                <Group gap="xs" mb="xs">
                  <IconShield size={16} />
                  <Text fw={600} size="sm">
                    Risk Level Distribution
                  </Text>
                </Group>
                <BarChart
                  h={160}
                  data={riskLevelData}
                  dataKey="level"
                  series={[{ name: "count", color: "indigo.6" }]}
                  tickLine="none"
                  gridAxis="none"
                />
              </Box>

              {/* Risk Trend Over Time */}
              <Box>
                <Group gap="xs" mb="xs">
                  <IconTrendingUp size={16} />
                  <Text fw={600} size="sm">
                    Risk Score Trend
                  </Text>
                </Group>
                <AreaChart
                  h={160}
                  data={riskTrendData}
                  dataKey="month"
                  series={[{ name: "riskScore", color: "red.6" }]}
                  tickLine="none"
                  gridAxis="none"
                  curveType="natural"
                  fillOpacity={0.3}
                />
              </Box>
            </SimpleGrid>
            {/* Risk Category Pie Chart */}
            <Box>
              <Group gap="xs" mb="xs">
                <IconAlertTriangle size={16} />
                <Text fw={600} size="sm">
                  Risk Categories
                </Text>
              </Group>
              <PieChart
                h={200}
                data={riskCategoryData}
                withTooltip
                tooltipDataSource="segment"
                mx="auto"
              />
            </Box>
            {/* Risk Mitigation Progress */}
            <Box>
              <Text fw={600} size="sm" mb="xs">
                Risk Mitigation Strategies
              </Text>
              <Stack gap="xs">
                {riskMitigationProgress.map((item, index) => (
                  <Group key={index} justify="space-between">
                    <Text size="xs">{item.strategy}</Text>
                    <Group gap="xs">
                      <Progress
                        value={item.progress}
                        size="sm"
                        w={100}
                        color={item.color}
                      />
                      <Text size="xs" fw={500}>
                        {item.progress}%
                      </Text>
                    </Group>
                  </Group>
                ))}
              </Stack>
            </Box>
            <Text size="xs" c="dimmed" ta="center" mt="sm">
              * Risk analysis performed by our team of highly trained hamsters
              🐹
            </Text>
          </Stack>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
  if (animated && !shouldReduceMotion) {
    return (
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={slideInRight}
        {...paperHover}
      >
        <Paper shadow="sm" p="xl" radius="md" h="100%">
          <Stack gap="md">
            <Title order={2} c="indigo">
              Risk Factors
            </Title>

            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
              {/* Traditional Risk Factors */}
              <motion.div
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Stack gap="xs">
                  <Title order={3} size="h5" c="dimmed">
                    Traditional Risk Assessment
                  </Title>
                  {riskFactors.map((risk, index) => (
                    <motion.div key={index} variants={listItemVariants}>
                      <Text size="sm">• {risk}</Text>
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>

              {/* Silly Risk Analysis Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Stack gap="md">
                  <Group gap="xs">
                    <IconChartPie
                      size={20}
                      color="var(--mantine-color-indigo-6)"
                    />
                    <Title order={3} size="h5" c="indigo">
                      Silly Risk Analysis Dashboard™
                    </Title>
                    <Badge variant="light" color="grape" size="sm">
                      Very Scientific
                    </Badge>
                  </Group>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    {/* Risk Level Distribution */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                    >
                      <Box>
                        <Group gap="xs" mb="xs">
                          <IconShield size={16} />
                          <Text fw={600} size="sm">
                            Risk Level Distribution
                          </Text>
                        </Group>
                        <BarChart
                          h={160}
                          data={riskLevelData}
                          dataKey="level"
                          series={[{ name: "count", color: "indigo.6" }]}
                          tickLine="none"
                          gridAxis="none"
                        />
                      </Box>
                    </motion.div>

                    {/* Risk Trend Over Time */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                    >
                      <Box>
                        <Group gap="xs" mb="xs">
                          <IconTrendingUp size={16} />
                          <Text fw={600} size="sm">
                            Risk Score Trend
                          </Text>
                        </Group>
                        <AreaChart
                          h={160}
                          data={riskTrendData}
                          dataKey="month"
                          series={[{ name: "riskScore", color: "red.6" }]}
                          tickLine="none"
                          gridAxis="none"
                          curveType="natural"
                          fillOpacity={0.3}
                        />
                      </Box>
                    </motion.div>
                  </SimpleGrid>
                  {/* Risk Category Pie Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    <Box>
                      <Group gap="xs" mb="xs">
                        <IconAlertTriangle size={16} />
                        <Text fw={600} size="sm">
                          Risk Categories
                        </Text>
                      </Group>
                      <PieChart
                        h={200}
                        data={riskCategoryData}
                        withTooltip
                        tooltipDataSource="segment"
                        mx="auto"
                      />
                    </Box>
                  </motion.div>
                  {/* Risk Mitigation Progress */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                  >
                    <Box>
                      <Text fw={600} size="sm" mb="xs">
                        Risk Mitigation Strategies
                      </Text>
                      <Stack gap="xs">
                        {riskMitigationProgress.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.0 + index * 0.1 }}
                          >
                            <Group justify="space-between">
                              <Text size="xs">{item.strategy}</Text>
                              <Group gap="xs">
                                <Progress
                                  value={item.progress}
                                  size="sm"
                                  w={100}
                                  color={item.color}
                                />
                                <Text size="xs" fw={500}>
                                  {item.progress}%
                                </Text>
                              </Group>
                            </Group>
                          </motion.div>
                        ))}
                      </Stack>
                    </Box>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.5 }}
                  >
                    <Text size="xs" c="dimmed" ta="center" mt="sm">
                      * Risk analysis performed by our team of highly trained
                      hamsters 🐹
                    </Text>
                  </motion.div>
                </Stack>
              </motion.div>
            </SimpleGrid>
          </Stack>
        </Paper>
      </motion.div>
    );
  }

  return content;
}
