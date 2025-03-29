import gluestackPlugin from "@gluestack-ui/nativewind-utils/tailwind-plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        border: "hsl(214, 32%, 93%, 1)",
        ring: "hsl(224 71.4% 4.1%)",

        input: "hsl(220 13% 91%)",

        background: "hsl(0, 0%, 100%, 1)",
        foreground: "hsl(218, 67%, 12%, 1)",

        primary: {
          DEFAULT: "hsl(240, 79%, 5%, 1)",
          foreground: "hsl(0, 0%, 100%, 1)",
        },

        secondary: {
          DEFAULT: "hsla(194, 100%, 50%, 1)",
          foreground: "hsl(0, 0%, 100%, 1)",
        },

        destructive: {
          DEFAULT: "hsl(5, 84%, 64%, 1)",
          foreground: "hsl(0, 0%, 100%, 1)",
        },

        muted: {
          DEFAULT: "hsl(220 14.3% 95.9%)",
          foreground: "hsl(220 8.9% 46.1%)",
        },

        accent: {
          DEFAULT: "hsla(215, 14%, 64%, 1)",
          foreground: "hsl(218, 67%, 12%, 1)",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        roboto: ["inter", "sans-serif"],
      },
      fontWeight: {
        extrablack: "950",
      },
      borderRadius: {
        input: "8px", 
      },
    },
  },
  plugins: [gluestackPlugin],
};
