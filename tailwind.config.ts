import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E11D48",
        secondary: "#2563EB",
        tertiary: "#FACC15",
        surface: {
          base: "#FFFFFF",
          muted: "#F3F4F6",
        },
        status: {
          success: "#16A34A",
          warning: "#D97706",
          error: "#DC2626",
        },
      },
      fontFamily: {
        headline: ["var(--font-poppins)", "var(--font-heebo)", "sans-serif"],
        body: ["var(--font-dm-sans)", "var(--font-heebo)", "sans-serif"],
        hebrew: ["var(--font-heebo)", "var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
      boxShadow: {
        glass: "8px 8px 32px rgba(0, 0, 0, 0.08)",
        card: "4px 4px 16px rgba(0, 0, 0, 0.10)",
        accent: "8px 8px 24px rgba(225, 29, 72, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
