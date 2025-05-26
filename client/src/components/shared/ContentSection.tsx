import { Title, Paper, Stack } from "@mantine/core";
import { motion, useReducedMotion } from "framer-motion";
import { paperHover } from "../../utils/animations";
import MarkdownRenderer from "../MarkdownRenderer";
import AnimatedSection from "../animations/AnimatedSection";

interface ContentSectionProps {
  title: string;
  content: string;
  animated?: boolean;
  delay?: number;
}

export default function ContentSection({
  title,
  content,
  animated = false,
  delay = 0,
}: ContentSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (animated && !shouldReduceMotion) {
    return (
      <AnimatedSection delay={delay}>
        <motion.div {...paperHover}>
          <Paper shadow="sm" p="xl" radius="md">
            <Stack gap="md">
              <Title order={2} c="indigo">
                {title}
              </Title>
              <MarkdownRenderer content={content} />
            </Stack>
          </Paper>
        </motion.div>
      </AnimatedSection>
    );
  }

  return (
    <Paper shadow="sm" p="xl" radius="md">
      <Stack gap="md">
        <Title order={2} c="indigo">
          {title}
        </Title>
        <MarkdownRenderer content={content} />
      </Stack>
    </Paper>
  );
}
