import { Title, Text, Paper, Stack } from "@mantine/core";
import { motion, useReducedMotion } from "framer-motion";
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

  const content = (
    <Paper shadow="sm" p="xl" radius="md" h="100%">
      <Stack gap="md">
        <Title order={2} c="indigo">
          Risk Factors
        </Title>
        <Stack gap="xs">
          {riskFactors.map((risk, index) => (
            <Text key={index} size="sm">
              • {risk}
            </Text>
          ))}
        </Stack>
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
            <motion.div
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Stack gap="xs">
                {riskFactors.map((risk, index) => (
                  <motion.div key={index} variants={listItemVariants}>
                    <Text size="sm">• {risk}</Text>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          </Stack>
        </Paper>
      </motion.div>
    );
  }

  return content;
}
