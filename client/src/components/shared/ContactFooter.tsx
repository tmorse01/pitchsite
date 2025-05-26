import { Title, Text, Button, Group, Paper, Stack } from "@mantine/core";
import { motion, useReducedMotion } from "framer-motion";
import { paperHover, buttonHover, pulseCTA } from "../../utils/animations";
import AnimatedSection from "../animations/AnimatedSection";

interface ContactFooterProps {
  animated?: boolean;
  delay?: number;
  onContactSponsor?: () => void;
  onShareDeck?: () => void;
  showShareButton?: boolean;
}

export default function ContactFooter({
  animated = false,
  delay = 0,
  onContactSponsor,
  onShareDeck,
  showShareButton = true,
}: ContactFooterProps) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <Paper shadow="sm" p="xl" radius="md" bg="gray.0">
      <Stack gap="md" align="center" ta="center">
        <Title order={3}>Ready to Invest?</Title>
        <Text c="dimmed">
          Contact us for more information and investment documentation
        </Text>
        <Group>
          {animated && !shouldReduceMotion ? (
            <>
              <motion.div {...buttonHover} animate={pulseCTA}>
                <Button variant="filled" size="lg" onClick={onContactSponsor}>
                  Contact Sponsor
                </Button>
              </motion.div>
              {showShareButton && (
                <motion.div {...buttonHover}>
                  <Button variant="outline" size="lg" onClick={onShareDeck}>
                    Share This Deck
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <Button variant="filled" size="lg" onClick={onContactSponsor}>
                Contact Sponsor
              </Button>
              {showShareButton && (
                <Button variant="outline" size="lg" onClick={onShareDeck}>
                  Share This Deck
                </Button>
              )}
            </>
          )}
        </Group>
      </Stack>
    </Paper>
  );

  if (animated && !shouldReduceMotion) {
    return (
      <AnimatedSection delay={delay}>
        <motion.div {...paperHover}>{content}</motion.div>
      </AnimatedSection>
    );
  }

  return content;
}
