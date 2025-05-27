import {
  Title,
  Text,
  Badge,
  Group,
  Paper,
  Stack,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { motion, useReducedMotion } from "framer-motion";
import { heroAnimations, staggerItem } from "../../utils/animations";
import NumberCounter from "../animations/NumberCounter";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  formData: {
    projectName: string;
    address: string;
    purchasePrice: number;
    totalRaise: number;
    targetIrr: string;
    holdPeriod: string;
  };
  animated?: boolean;
  formatCurrency: (amount: number) => string;
}

export default function HeroSection({
  formData,
  animated = false,
  formatCurrency,
}: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const Wrapper = animated && !shouldReduceMotion ? motion.div : "div";
  const ItemWrapper = animated && !shouldReduceMotion ? motion.div : "div";

  const wrapperProps =
    animated && !shouldReduceMotion
      ? {
          initial: "initial",
          animate: "animate",
          variants: heroAnimations.title,
        }
      : {};

  const badgeProps =
    animated && !shouldReduceMotion
      ? {
          variants: heroAnimations.badge,
        }
      : {};

  const titleProps =
    animated && !shouldReduceMotion
      ? {
          variants: heroAnimations.title,
        }
      : {};

  const metricsProps =
    animated && !shouldReduceMotion
      ? {
          variants: heroAnimations.metrics,
          initial: "initial",
          animate: "animate",
        }
      : {};

  const staggerProps =
    animated && !shouldReduceMotion
      ? {
          variants: staggerItem,
        }
      : {};

  return (
    <>
      <Box className={`${styles.heroPattern} ${styles.heroContainer}`}>
        <Wrapper {...wrapperProps}>
          <Paper shadow="lg" p="xl" radius="md" className={styles.heroPaper}>
            <Stack gap="md" align="center" ta="center">
              <ItemWrapper {...badgeProps}>
                <motion.div
                  animate={
                    animated && !shouldReduceMotion
                      ? {
                          boxShadow: [
                            "0 0 0 0 rgba(255, 191, 0, 0.4)",
                            "0 0 0 10px rgba(255, 191, 0, 0)",
                            "0 0 0 0 rgba(255, 191, 0, 0)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ borderRadius: "var(--mantine-radius-xl)" }}
                >
                  <Badge
                    size="xl"
                    variant="filled"
                    color="gold"
                    className={styles.badge}
                  >
                    💎 Investment Opportunity
                  </Badge>
                </motion.div>
              </ItemWrapper>
              <ItemWrapper {...titleProps}>
                <motion.div
                  initial={
                    animated && !shouldReduceMotion ? { opacity: 0 } : {}
                  }
                  animate={
                    animated && !shouldReduceMotion ? { opacity: 1 } : {}
                  }
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <Title
                    order={1}
                    size="h1"
                    className={`${styles.title} ${
                      animated && !shouldReduceMotion
                        ? styles.titleAnimated
                        : ""
                    }`}
                  >
                    {formData.projectName}
                  </Title>
                </motion.div>
              </ItemWrapper>
              <ItemWrapper {...titleProps}>
                <Text size="lg" c="dimmed">
                  {formData.address}
                </Text>
              </ItemWrapper>
              <ItemWrapper {...metricsProps}>
                <Group gap="xl" mt="md">
                  <ItemWrapper {...staggerProps}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        boxShadow: "0 8px 25px rgba(77, 111, 255, 0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={styles.metricCard}
                    >
                      <Stack gap={4} align="center">
                        <Group gap={8} align="center">
                          <ThemeIcon size="sm" variant="light" color="indigo">
                            🏠
                          </ThemeIcon>
                          <Text size="sm" c="dimmed" fw={500}>
                            Purchase Price
                          </Text>
                        </Group>
                        <Text size="xl" fw={700} c="indigo">
                          {animated ? (
                            <NumberCounter
                              value={formData.purchasePrice}
                              prefix="$"
                              decimals={0}
                            />
                          ) : (
                            formatCurrency(formData.purchasePrice)
                          )}
                        </Text>
                      </Stack>
                    </motion.div>
                  </ItemWrapper>
                  <ItemWrapper {...staggerProps}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        boxShadow: "0 8px 25px rgba(77, 111, 255, 0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={styles.metricCard}
                    >
                      <Stack gap={4} align="center">
                        <Group gap={8} align="center">
                          <ThemeIcon size="sm" variant="light" color="gold">
                            💰
                          </ThemeIcon>
                          <Text size="sm" c="dimmed" fw={500}>
                            Equity Raise
                          </Text>
                        </Group>
                        <Text size="xl" fw={700} c="indigo">
                          {animated ? (
                            <NumberCounter
                              value={formData.totalRaise}
                              prefix="$"
                              decimals={0}
                            />
                          ) : (
                            formatCurrency(formData.totalRaise)
                          )}
                        </Text>
                      </Stack>
                    </motion.div>
                  </ItemWrapper>
                  <ItemWrapper {...staggerProps}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        boxShadow: "0 8px 25px rgba(77, 111, 255, 0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={styles.metricCard}
                    >
                      <Stack gap={4} align="center">
                        <Group gap={8} align="center">
                          <ThemeIcon size="sm" variant="light" color="green">
                            📈
                          </ThemeIcon>
                          <Text size="sm" c="dimmed" fw={500}>
                            Target IRR
                          </Text>
                        </Group>
                        <Text size="xl" fw={700} c="indigo">
                          {formData.targetIrr}
                        </Text>
                      </Stack>
                    </motion.div>
                  </ItemWrapper>
                  <ItemWrapper {...staggerProps}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        boxShadow: "0 8px 25px rgba(77, 111, 255, 0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={styles.metricCard}
                    >
                      <Stack gap={4} align="center">
                        <Group gap={8} align="center">
                          <ThemeIcon size="sm" variant="light" color="blue">
                            ⏱️
                          </ThemeIcon>
                          <Text size="sm" c="dimmed" fw={500}>
                            Hold Period
                          </Text>
                        </Group>
                        <Text size="xl" fw={700} c="indigo">
                          {formData.holdPeriod}
                        </Text>
                      </Stack>
                    </motion.div>
                  </ItemWrapper>
                </Group>
              </ItemWrapper>
            </Stack>
            {/* Investment Progress Bar */}
            {animated && !shouldReduceMotion && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 1.5, duration: 1.2 }}
                className={styles.progressBar}
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{ delay: 2, duration: 2, ease: "easeOut" }}
                  className={styles.progressFill}
                />
              </motion.div>
            )}
            {/* Scroll hint */}
            {animated && !shouldReduceMotion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.8 }}
                className={styles.scrollHint}
              >
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Text size="sm" c="dimmed" fw={500}>
                    ↓ Scroll to explore investment details
                  </Text>
                </motion.div>
              </motion.div>
            )}
          </Paper>
        </Wrapper>
      </Box>
    </>
  );
}
