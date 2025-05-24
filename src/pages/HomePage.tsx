import { Title, Text, Button, Stack, Group, Paper } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Stack align="center" gap="xl">
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        w="100%"
        style={{ textAlign: "center" }}
      >
        <Stack gap="lg">
          <Title order={1} size="h1" c="indigo">
            PitchSite
          </Title>
          <Text size="lg" c="dimmed" maw={600} mx="auto">
            Generate AI-powered pitch deck websites for your real estate
            investments. Create professional presentations in minutes, not
            hours.
          </Text>
          <Group justify="center" mt="xl">
            <Button
              size="lg"
              variant="filled"
              onClick={() => navigate("/create")}
            >
              Create Your Pitch Deck
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Stack gap="md" align="center">
        <Title order={2} size="h3">
          How it works
        </Title>
        <Group grow align="flex-start">
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Title order={3} size="h4" c="indigo">
                1. Input Details
              </Title>
              <Text size="sm" c="dimmed">
                Provide your investment details, property information, and
                sponsor background
              </Text>
            </Stack>
          </Paper>
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Title order={3} size="h4" c="indigo">
                2. AI Generation
              </Title>
              <Text size="sm" c="dimmed">
                Our AI creates compelling executive summaries, investment
                thesis, and risk analysis
              </Text>
            </Stack>
          </Paper>
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Title order={3} size="h4" c="indigo">
                3. Share & Present
              </Title>
              <Text size="sm" c="dimmed">
                Get a professional pitch deck website you can share with
                potential investors
              </Text>
            </Stack>
          </Paper>
        </Group>
      </Stack>
    </Stack>
  );
}
