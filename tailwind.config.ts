import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clinical teal palette (disciplined, single accent family)
        ink: "#0F2A2E",
        muted: "#5B7174",
        canvas: "#F4F8F8",
        surface: "#FFFFFF",
        line: "#E2EAEA",
        teal: {
          50: "#E9F4F3",
          100: "#CFE8E6",
          500: "#0E7C7B",
          600: "#0A5F5E",
          700: "#084A49",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 42, 46, 0.04), 0 8px 24px -12px rgba(15, 42, 46, 0.12)",
        float: "0 12px 40px -16px rgba(10, 95, 94, 0.35)",
      },
      keyframes: {
        ecg: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        ecg: "ecg 2.4s linear infinite",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
