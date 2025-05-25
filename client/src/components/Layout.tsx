import { Container, Box } from "@mantine/core";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function Layout({ children, size = "lg" }: LayoutProps) {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, var(--mantine-color-royal-0) 0%, var(--mantine-color-royal-1) 25%, var(--mantine-color-royal-2) 75%, var(--mantine-color-royal-0) 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Container
        size={size}
        py="xl"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
