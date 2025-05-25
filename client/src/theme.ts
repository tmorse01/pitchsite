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
      styles: () => ({
        root: {
          fontWeight: 600,
          textTransform: "none",
          fontSize: rem(15),
          height: rem(44),
          paddingInline: rem(24),
          transition: "all 0.2s ease",

          "&[data-variant='filled']": {
            background:
              "linear-gradient(135deg, var(--mantine-color-royal-6) 0%, var(--mantine-color-royal-8) 100%)",
            border: "none",
            boxShadow: "0 4px 12px var(--mantine-color-royal-3)",
            color: "var(--mantine-color-white)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 6px 20px var(--mantine-color-royal-4)",
            },
          },

          "&[data-variant='outline']": {
            backgroundColor: "var(--mantine-color-white)",
            border: "2px solid var(--mantine-color-royal-6)",
            color: "var(--mantine-color-royal-6)",
            boxShadow: "0 2px 8px var(--mantine-color-royal-1)",
            "&:hover": {
              backgroundColor: "var(--mantine-color-royal-0)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px var(--mantine-color-royal-2)",
            },
          },

          "&[data-variant='default']": {
            backgroundColor: "var(--mantine-color-slate-1)",
            border: "1px solid var(--mantine-color-slate-3)",
            color: "var(--mantine-color-slate-7)",
            "&:hover": {
              backgroundColor: "var(--mantine-color-slate-2)",
              transform: "translateY(-1px)",
            },
          },
        },
      }),
    },
    Paper: {
      styles: () => ({
        root: {
          border: "1px solid var(--mantine-color-royal-1)",
          boxShadow:
            "0 2px 8px var(--mantine-color-slate-1), 0 1px 3px var(--mantine-color-slate-2)",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow:
              "0 4px 16px var(--mantine-color-slate-2), 0 2px 6px var(--mantine-color-slate-3)",
          },
        },
      }),
    },
    Title: {
      styles: () => ({
        root: {
          background:
            "linear-gradient(135deg, var(--mantine-color-royal-7) 0%, var(--mantine-color-royal-9) 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          fontWeight: 700,
        },
      }),
    },
    Badge: {
      styles: () => ({
        root: {
          background:
            "linear-gradient(135deg, var(--mantine-color-gold-5) 0%, var(--mantine-color-gold-7) 100%)",
          color: "white",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: rem(11),
        },
      }),
    },
    Container: {
      styles: () => ({
        root: {
          background:
            "linear-gradient(135deg, var(--mantine-color-royal-0) 0%, var(--mantine-color-royal-1) 100%)",
          minHeight: "100vh",
        },
      }),
    },
  },
});
