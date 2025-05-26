import { Title, Paper, Stack } from "@mantine/core";
import { motion, useReducedMotion } from "framer-motion";
import { slideInLeft, paperHover } from "../../utils/animations";
import MarkdownRenderer from "../MarkdownRenderer";

interface InvestmentThesisProps {
  investmentThesis: string;
  animated?: boolean;
}

export default function InvestmentThesis({
  investmentThesis,
  animated = false,
}: InvestmentThesisProps) {
  const shouldReduceMotion = useReducedMotion();

  if (animated && !shouldReduceMotion) {
    return (
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={slideInLeft}
        {...paperHover}
      >
        <Paper shadow="sm" p="xl" radius="md" h="100%">
          <Stack gap="md">
            <Title order={2} c="indigo">
              Investment Thesis
            </Title>
            <MarkdownRenderer content={investmentThesis} />
          </Stack>
        </Paper>
      </motion.div>
    );
  }

  return (
    <Paper shadow="sm" p="xl" radius="md" h="100%">
      <Stack gap="md">
        <Title order={2} c="indigo">
          Investment Thesis
        </Title>
        <MarkdownRenderer content={investmentThesis} />
      </Stack>
    </Paper>
  );
}
