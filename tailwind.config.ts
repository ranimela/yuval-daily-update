import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        sky: "#9fd8f0",
        dose: {
          yellow: "#ffd23f",
          orange: "#ff8a3d",
          red: "#ff595e",
          purple: "#b79cf2",
          teal: "#3ddbc0",
          grass: "#4cc24e",
          roof: "#c1121f",
          tree: "#2a9d3f",
        },
      },
      fontFamily: {
        headline: ["var(--font-lilita)", "var(--font-heebo)", "sans-serif"],
        body: ["var(--font-nunito)", "var(--font-heebo)", "sans-serif"],
        hebrew: ["var(--font-heebo)", "var(--font-nunito)", "sans-serif"],
      },
      boxShadow: {
        card: "6px 6px 0 #111111",
        inner: "4px 4px 0 #111111",
        chip: "3px 3px 0 #111111",
      },
    },
  },
  plugins: [],
};

export default config;
