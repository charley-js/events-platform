import type { Config } from "tailwindcss";

export default {
  content: ["../client/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [],
} satisfies Config;
