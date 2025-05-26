import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  fontFamily:
    "'Poppins', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
  primaryColor: "royal",
  defaultRadius: "lg",

  headings: {
    fontFamily:
      "'Poppins', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: rem(40), lineHeight: "1.1" },
      h2: { fontSize: rem(32), lineHeight: "1.2" },
      h3: { fontSize: rem(26), lineHeight: "1.3" },
    },
  },

  colors: {
    royal: [
      "#f8faff",
      "#eef4ff",
      "#dde7ff",
      "#bdd3ff",
      "#9bb9ff",
      "#7599ff",
      "#4c6fff",
      "#2d4bff",
      "#1a3bff",
      "#0d2fff",
    ],
    gold: [
      "#fffcf5",
      "#fff8e7",
      "#fff0cc",
      "#ffe699",
      "#ffd966",
      "#ffcc33",
      "#ffbf00",
      "#e6ac00",
      "#cc9900",
      "#b38600",
    ],
    slate: [
      "#f8fafc",
      "#f1f5f9",
      "#e2e8f0",
      "#cbd5e1",
      "#94a3b8",
      "#64748b",
      "#475569",
      "#334155",
      "#1e293b",
      "#0f172a",
    ],
    emerald: [
      "#ecfdf5",
      "#d1fae5",
      "#a7f3d0",
      "#6ee7b7",
      "#34d399",
      "#10b981",
      "#059669",
      "#047857",
      "#065f46",
      "#064e3b",
    ],
  },

  components: {
    Button: {
      defaultProps: {
        radius: "lg",
        size: "md",
      },
    },
  },
});
