import { Container, Box } from "@mantine/core";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function Layout({ children, size = "lg" }: LayoutProps) {
  return (
    <Box className="app-layout">
      <Container size={size} py="xl">
        {children}
      </Container>
    </Box>
  );
}
