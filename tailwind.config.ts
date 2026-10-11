import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        general: ["var(--font-onest)", "system-ui", "sans-serif"],
        special: ["var(--font-biorhyme)", "system-ui", "serif"],
      },
      colors: {
        textBlue: "#3b82f6",
        textLightBlue: "#38bdf8",
        textGray: "#9ca3af",
      },
    },
  },
  plugins: [],
};
export default config;
