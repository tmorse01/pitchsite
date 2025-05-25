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
    const token = localStorage.getItem("pitchsite_auth");
    if (token && token !== "authenticated") {
      // Verify the token is still valid by making a test API call
      fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/test`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("pitchsite_auth");
          }
        })
        .catch(() => {
          // Network error or token invalid, remove it
          localStorage.removeItem("pitchsite_auth");
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (token === "authenticated") {
      // Handle old authentication format
      localStorage.removeItem("pitchsite_auth");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the login API to get JWT token
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Store JWT token instead of just "authenticated"
        localStorage.setItem("pitchsite_auth", data.token);
        setIsAuthenticated(true);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Incorrect password. Please try again.");
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Connection error. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
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
