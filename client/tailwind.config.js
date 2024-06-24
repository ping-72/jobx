/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");
const { Scale } = require("lucide-react");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        80: "0.80",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      colors: {
        background: "#FFFFFF", // or DEFAULT
        foreground: "#11181C", // or 50 to 900 DEFAULT
        primary: {
          // ... 50 to 900
          foreground: "#FFFFFF",
          DEFAULT: "006FEE",
        },
      },
    }),
  ],
};
