import gluestackPlugin from "@gluestack-ui/nativewind-utils/tailwind-plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enables class-based dark mode

  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",

        input: "hsl(var(--input))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
        },

        gray3: {
          DEFAULT: "hsl(var(--gray3))",
        },

        gray4: {
          DEFAULT: "hsl(var(--gray4))",
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
        sofia: ["SofiaPro", "sans-serif"],
        roboto: ["RobotoRegular", "sans-serif"],
      },

      fontWeight: {
        extrablack: "950",
      },

      borderRadius: {
        input: "8px",
      },

      boxShadow: {
        custom: "0px 4px 4px 0px hsla(0, 0%, 0%, 0.25)",
      },
    },
  },

  plugins: [gluestackPlugin],
};
