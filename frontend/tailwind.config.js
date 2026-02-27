/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: "#E8002D",
          dim: "#9B001E",
          glow: "rgba(232,0,45,0.25)",
        },
        gold: { DEFAULT: "#FFD700", dim: "rgba(255,215,0,0.15)" },
        bg: "#080808",
        surface: { DEFAULT: "#101010", 2: "#161616", 3: "#1E1E1E" },
        border: { DEFAULT: "#242424", 2: "#2E2E2E" },
        f1: { text: "#F0F0F0", muted: "#999999", faint: "#555555" },

        // Team colors
        team: {
          ferrari: "#E8002D",
          mclaren: "#FF8000",
          mercedes: "#00D2BE",
          redbull: "#3671C6",
          williams: "#64C4FF",
          aston: "#358C75",
          alpine: "#0090FF",
          haas: "#B6BABD",
          rb: "#6692FF",
          audi: "#52E252",
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
      boxShadow: {
        red: "0 0 32px rgba(232,0,45,0.25)",
        "red-lg": "0 0 48px rgba(232,0,45,0.35)",
        gold: "0 0 24px rgba(255,215,0,0.2)",
        card: "0 4px 32px rgba(0,0,0,0.5)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fadeIn 0.4s ease both",
        "pulse-red": "pulseRed 3s infinite",
        shimmer: "shimmer 1.4s infinite",
        "slide-in": "slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        pulseRed: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(232,0,45,0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(232,0,45,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        slideIn: {
          from: { opacity: 0, transform: "translateX(16px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backgroundImage: {
        "speed-lines":
          "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 3px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
