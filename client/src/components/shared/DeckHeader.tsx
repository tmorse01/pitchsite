import { Text, Button, Group, Paper, Stack } from "@mantine/core";
import { motion } from "framer-motion";
import { buttonHover } from "../../utils/animations";

interface DeckHeaderProps {
  deckId: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  animated?: boolean;
}

export default function DeckHeader({
  deckId,
  title = "Shared Investment Opportunity",
  subtitle,
  buttonText = "Create Your Own Deck",
  onButtonClick,
  animated = true,
}: DeckHeaderProps) {
  const content = (
    <Paper shadow="sm" p="md" radius="md" mb="xl" bg="blue.0">
      <Group justify="space-between" align="center">
        <Stack gap={4}>
          <Text size="sm" c="dimmed" fw={500}>
            {title}
          </Text>
          <Text size="lg" fw={700}>
            Deck ID: {deckId}
          </Text>
          {subtitle && (
            <Text size="sm" c="dimmed">
              {subtitle}
            </Text>
          )}
        </Stack>
        {onButtonClick && (
          <motion.div {...buttonHover}>
            <Button variant="light" onClick={onButtonClick}>
              {buttonText}
            </Button>
          </motion.div>
        )}
      </Group>
    </Paper>
  );

  if (!animated) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      {content}
    </motion.div>
  );
}
