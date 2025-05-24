// src/theme.ts
import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  primaryColor: "indigo",
  defaultRadius: "md",

  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
    sizes: {
      h1: { fontSize: rem(32), lineHeight: "1.2" },
      h2: { fontSize: rem(28), lineHeight: "1.3" },
      h3: { fontSize: rem(24), lineHeight: "1.4" },
    },
  },

  colors: {
    indigo: [
      "#eef2ff",
      "#e0e7ff",
      "#c7d2fe",
      "#a5b4fc",
      "#818cf8",
      "#6366f1",
      "#4f46e5",
      "#4338ca",
      "#3730a3",
      "#312e81",
    ],
    gray: [
      "#f9fafb",
      "#f3f4f6",
      "#e5e7eb",
      "#d1d5db",
      "#9ca3af",
      "#6b7280",
      "#4b5563",
      "#374151",
      "#1f2937",
      "#111827",
    ],
    gold: [
      "#fffbeb",
      "#fef3c7",
      "#fde68a",
      "#fcd34d",
      "#fbbf24",
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#92400e",
      "#78350f",
    ],
  },

  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
      styles: () => ({
        root: {
          fontWeight: 600,
          textTransform: "uppercase",
        },
      }),
    },
    Paper: {
      styles: () => ({
        root: {
          border: `1px solid #e5e7eb`,
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.04)",
        },
      }),
    },
  },
});
