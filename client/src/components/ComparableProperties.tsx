import {
  Paper,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Badge,
  Button,
} from "@mantine/core";

interface ComparableProperty {
  address: string;
  price: string;
  distance: string;
  note: string;
}

interface ComparablePropertiesProps {
  properties: ComparableProperty[];
}

export default function ComparableProperties({
  properties,
}: ComparablePropertiesProps) {
  const generateZillowLink = (address: string) => {
    return `https://www.zillow.com/homes/${encodeURIComponent(address)}`;
  };

  return (
    <Paper shadow="sm" p="xl" radius="md">
      <Stack gap="lg">
        <Title order={2} c="indigo">
          Comparable Properties
        </Title>

        <Text size="sm" c="dimmed">
          Recent sales of similar properties in the area
        </Text>

        <Stack gap="md">
          {properties.map((property, index) => (
            <Card key={index} withBorder radius="md" p="md">
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Group justify="space-between" align="center">
                    <Text fw={600} size="sm">
                      {property.address}
                    </Text>
                    <Badge variant="light" color="indigo">
                      {property.price}
                    </Badge>
                  </Group>

                  <Group gap="sm">
                    <Text size="xs" c="dimmed">
                      Distance: {property.distance}
                    </Text>
                    <Text size="xs" c="dimmed">
                      • {property.note}
                    </Text>
                  </Group>
                </Stack>

                <Button
                  variant="subtle"
                  size="compact-xs"
                  component="a"
                  href={generateZillowLink(property.address)}
                  target="_blank"
                >
                  View on Zillow
                </Button>
              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
