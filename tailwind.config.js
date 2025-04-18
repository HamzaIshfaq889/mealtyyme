import gluestackPlugin from "@gluestack-ui/nativewind-utils/tailwind-plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        border: "hsl(214, 32%, 93%, 1)" /*inputborders */,
        ring: "hsl(224 71.4% 4.1%)",

        input: "hsl(220 13% 91%)",

        background: "hsl(0, 0%, 100%, 1)" /* white color */,
        foreground: "hsl(218, 67%, 12%, 1)" /* Black headings color */,

        primary: {
          DEFAULT:
            "hsl(200, 67%, 12%, 1)" /* dark blue color(light shade of foreground/Black) */,
        },

        secondary: {
          DEFAULT: "hsla(194, 100%, 50%, 1)" /* blue color Main theme color */,
        },

        destructive: {
          DEFAULT: "hsl(5, 84%, 64%, 1)" /* red color for error messages */,
        },

        muted: {
          DEFAULT: "hsla(215, 14%, 64%, 1)", // grayish color paragraph texts and inputs placeholders
        },
        accent: {
          DEFAULT: "hsla(180, 17%, 95%, 1)", //grayish secondary
        },
        gray3: {
          DEFAULT: "hsla(214, 22%, 83%, 1)", //grayish version
        },
        gray4: {
          DEFAULT: "hsla(214, 32%, 93%, 1)",
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
