import { Title, Text, Badge, Group, Paper, Stack } from "@mantine/core";
import { motion, useReducedMotion } from "framer-motion";
import { heroAnimations, staggerItem } from "../../utils/animations";
import NumberCounter from "../animations/NumberCounter";

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
    <Wrapper {...wrapperProps}>
      <Paper shadow="sm" p="xl" radius="md" mb="xl" bg="white">
        <Stack gap="md" align="center" ta="center">
          <ItemWrapper {...badgeProps}>
            <Badge size="xl" variant="filled" color="gold">
              Investment Opportunity
            </Badge>
          </ItemWrapper>
          <ItemWrapper {...titleProps}>
            <Title order={1} size="h1" c="indigo">
              {formData.projectName}
            </Title>
          </ItemWrapper>
          <ItemWrapper {...titleProps}>
            <Text size="lg" c="dimmed">
              {formData.address}
            </Text>
          </ItemWrapper>
          <ItemWrapper {...metricsProps}>
            <Group gap="xl" mt="md">
              <ItemWrapper {...staggerProps}>
                <Stack gap={4} align="center">
                  <Text size="sm" c="dimmed" fw={500}>
                    Purchase Price
                  </Text>
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
              </ItemWrapper>
              <ItemWrapper {...staggerProps}>
                <Stack gap={4} align="center">
                  <Text size="sm" c="dimmed" fw={500}>
                    Equity Raise
                  </Text>
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
              </ItemWrapper>
              <ItemWrapper {...staggerProps}>
                <Stack gap={4} align="center">
                  <Text size="sm" c="dimmed" fw={500}>
                    Target IRR
                  </Text>
                  <Text size="xl" fw={700} c="indigo">
                    {formData.targetIrr}
                  </Text>
                </Stack>
              </ItemWrapper>
              <ItemWrapper {...staggerProps}>
                <Stack gap={4} align="center">
                  <Text size="sm" c="dimmed" fw={500}>
                    Hold Period
                  </Text>
                  <Text size="xl" fw={700} c="indigo">
                    {formData.holdPeriod}
                  </Text>
                </Stack>
              </ItemWrapper>
            </Group>
          </ItemWrapper>
        </Stack>
      </Paper>
    </Wrapper>
  );
}
