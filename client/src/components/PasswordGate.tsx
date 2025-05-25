import { useState, useEffect } from "react";
import {
  Paper,
  Stack,
  Title,
  Text,
  TextInput,
  Button,
  Alert,
  Center,
  Box,
} from "@mantine/core";
import { IconLock } from "@tabler/icons-react";

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const stored = localStorage.getItem("pitchsite_auth");
    if (stored === "authenticated") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === "pitch") {
      localStorage.setItem("pitchsite_auth", "authenticated");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  if (loading) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Text>Loading...</Text>
      </Center>
    );
  }

  if (!isAuthenticated) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Box w="100%" maw={400}>
          <Paper shadow="md" p="xl" radius="md">
            <Stack gap="lg" align="center">
              <IconLock size={48} color="var(--mantine-color-indigo-6)" />
              <Title order={2} ta="center" c="indigo">
                Access Required
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                Please enter the password to access PitchSite
              </Text>

              {error && (
                <Alert color="red" w="100%">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Stack gap="md">
                  <TextInput
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    w="100%"
                  />
                  <Button type="submit" fullWidth size="md">
                    Access PitchSite
                  </Button>
                </Stack>
              </form>

              <Text size="xs" c="dimmed" ta="center">
                Hint: The password is "pitch"
              </Text>
            </Stack>
          </Paper>
        </Box>
      </Center>
    );
  }

  return <>{children}</>;
}
