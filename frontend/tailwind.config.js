import { shadcnPreset } from "tailwind-config/shadcn-preset";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
  presets: [shadcnPreset],
};
