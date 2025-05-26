import { Paper, Title, Text, Stack, Slider, Group } from "@mantine/core";
import { useState } from "react";
import NumberCounter from "./animations/NumberCounter";
import {
  formatFullCurrency,
  formatPercentWithDecimals,
} from "../utils/formatters";

interface ROISimulatorProps {
  purchasePrice: number;
  initialRent: number;
}

export default function ROISimulator({
  purchasePrice,
  initialRent,
}: ROISimulatorProps) {
  const [exitCapRate, setExitCapRate] = useState(5.5);
  const [monthlyRent, setMonthlyRent] = useState(initialRent);
  const [holdPeriod, setHoldPeriod] = useState(5);
  // Simplified ROI calculation
  const calculateROI = () => {
    const annualRent = monthlyRent * 12;
    const exitValue = Number((annualRent / (exitCapRate / 100)).toFixed(2));
    const totalRentReceived = annualRent * holdPeriod;
    const totalReturn = Number(
      (exitValue + totalRentReceived - purchasePrice).toFixed(2)
    );
    const totalReturnPercent = Number(
      ((totalReturn / purchasePrice) * 100).toFixed(1)
    );
    const annualizedReturn = Number(
      (
        (Math.pow(1 + totalReturn / purchasePrice, 1 / holdPeriod) - 1) *
        100
      ).toFixed(1)
    );

    return {
      exitValue,
      totalReturn,
      totalReturnPercent,
      annualizedReturn,
      equityMultiple: Number(
        ((exitValue + totalRentReceived) / purchasePrice).toFixed(2)
      ),
    };
  };

  const roi = calculateROI();

  return (
    <Paper shadow="sm" p="xl" radius="md">
      <Stack gap="lg">
        <Title order={2} c="indigo">
          ROI Simulator
        </Title>

        <Text size="sm" c="dimmed">
          Adjust parameters to see projected returns
        </Text>

        <Stack gap="xl">
          <div>
            <Text size="sm" fw={500} mb="xs">
              Exit Cap Rate: {exitCapRate}%
            </Text>
            <Slider
              value={exitCapRate}
              onChange={setExitCapRate}
              min={3}
              max={8}
              step={0.1}
              marks={[
                { value: 3, label: "3%" },
                { value: 5.5, label: "5.5%" },
                { value: 8, label: "8%" },
              ]}
            />
          </div>{" "}
          <div>
            <Text size="sm" fw={500} mb="xs">
              Monthly Rent: {formatFullCurrency(monthlyRent)}
            </Text>
            <Slider
              value={monthlyRent}
              onChange={setMonthlyRent}
              min={initialRent * 0.8}
              max={initialRent * 1.5}
              step={100}
              marks={[
                {
                  value: initialRent * 0.8,
                  label: formatFullCurrency(
                    Math.floor((initialRent * 0.8) / 100) * 100
                  ),
                },
                { value: initialRent, label: formatFullCurrency(initialRent) },
                {
                  value: initialRent * 1.5,
                  label: formatFullCurrency(
                    Math.floor((initialRent * 1.5) / 100) * 100
                  ),
                },
              ]}
            />
          </div>
          <div>
            <Text size="sm" fw={500} mb="xs">
              Hold Period: {holdPeriod} years
            </Text>
            <Slider
              value={holdPeriod}
              onChange={setHoldPeriod}
              min={1}
              max={10}
              step={1}
              marks={[
                { value: 1, label: "1yr" },
                { value: 5, label: "5yr" },
                { value: 10, label: "10yr" },
              ]}
            />
          </div>
        </Stack>

        <Paper bg="gray.0" p="md" radius="md" mt="md">
          <Stack gap="sm">
            <Text fw={600} c="indigo">
              Projected Results
            </Text>
            <Group justify="space-between">
              <Text size="sm">Exit Value:</Text>
              <Text size="sm" fw={500}>
                <NumberCounter
                  value={roi.exitValue}
                  prefix="$"
                  duration={0.8}
                />
              </Text>
            </Group>{" "}
            <Group justify="space-between">
              <Text size="sm">Total Return:</Text>
              <Text
                size="sm"
                fw={500}
                c={roi.totalReturn > 0 ? "green" : "red"}
              >
                <NumberCounter
                  value={roi.totalReturn}
                  prefix="$"
                  duration={0.8}
                />{" "}
                ({formatPercentWithDecimals(roi.totalReturnPercent, 1)})
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Annualized Return:</Text>
              <Text size="sm" fw={600} c="indigo">
                <NumberCounter
                  value={roi.annualizedReturn}
                  suffix="% IRR"
                  decimals={1}
                  duration={0.8}
                />
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Equity Multiple:</Text>
              <Text size="sm" fw={500}>
                <NumberCounter
                  value={roi.equityMultiple}
                  suffix="x"
                  decimals={2}
                  duration={0.8}
                />
              </Text>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
}
