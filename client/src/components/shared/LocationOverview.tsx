import { Title, Paper, Stack } from "@mantine/core";
import { motion, useReducedMotion } from "framer-motion";
import { slideInLeft, paperHover } from "../../utils/animations";
import MarkdownRenderer from "../MarkdownRenderer";

interface LocationOverviewProps {
  locationOverview: string;
  animated?: boolean;
}

export default function LocationOverview({
  locationOverview,
  animated = false,
}: LocationOverviewProps) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <Paper shadow="sm" p="xl" radius="md" h="100%">
      <Stack gap="md">
        <Title order={2} c="indigo">
          Location Overview
        </Title>
        <MarkdownRenderer content={locationOverview} />
      </Stack>
    </Paper>
  );

  if (animated && !shouldReduceMotion) {
    return (
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={slideInLeft}
        {...paperHover}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
