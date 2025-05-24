import { Paper, Title, Text, Stack, Group, Button, Box } from "@mantine/core";

interface LocationMapProps {
  address: string;
}

export default function LocationMap({ address }: LocationMapProps) {
  const generateZillowLink = (address: string) => {
    return `https://www.zillow.com/homes/${encodeURIComponent(address)}`;
  };

  const generateGoogleMapsLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  };

  const generateMapEmbedUrl = (address: string) => {
    // For now, we'll use a fallback since we don't have a Google Maps API key
    // In production, you would use:
    // `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.8587!2d-97.7431!3d30.2672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDE2JzAyLjAiTiA5N8KwNDQnMzUuMiJX!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus&q=${encodeURIComponent(
      address
    )}`;
  };

  return (
    <Paper shadow="sm" p="xl" radius="md">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2} c="indigo">
            Location & Maps
          </Title>
          <Group gap="sm">
            <Button
              variant="light"
              size="compact-sm"
              component="a"
              href={generateZillowLink(address)}
              target="_blank"
            >
              View on Zillow
            </Button>
            <Button
              variant="light"
              size="compact-sm"
              component="a"
              href={generateGoogleMapsLink(address)}
              target="_blank"
            >
              Open in Maps
            </Button>
          </Group>
        </Group>

        <Box>
          <iframe
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: "8px" }}
            loading="lazy"
            allowFullScreen
            src={generateMapEmbedUrl(address)}
            title={`Map of ${address}`}
          />
        </Box>

        <Text size="xs" c="dimmed" ta="center">
          Interactive map showing property location and surrounding area
        </Text>
      </Stack>
    </Paper>
  );
}
