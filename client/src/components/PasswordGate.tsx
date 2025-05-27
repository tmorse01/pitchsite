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
import { useLogin, useVerifyToken } from "../api";

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // React Query hooks
  const loginMutation = useLogin();
  const verifyTokenQuery = useVerifyToken();

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("pitchsite_auth");
    if (token && token !== "authenticated") {
      // Verify the token is still valid using React Query
      verifyTokenQuery
        .refetch()
        .then(() => {
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem("pitchsite_auth");
          setLoading(false);
        });
    } else if (token === "authenticated") {
      // Handle old authentication format
      localStorage.removeItem("pitchsite_auth");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [verifyTokenQuery]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use React Query login mutation
      const result = await loginMutation.mutateAsync(password);

      // Store JWT token
      localStorage.setItem("pitchsite_auth", result.token);
      setIsAuthenticated(true);
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
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
              </Text>{" "}
              {loginMutation.error && (
                <Alert color="red" w="100%">
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : "Incorrect password. Please try again."}
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
                  />{" "}
                  <Button
                    type="submit"
                    fullWidth
                    size="md"
                    loading={loginMutation.isPending}
                  >
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
