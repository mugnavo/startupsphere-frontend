import daisyui from "daisyui";
import defaultThemes from "daisyui/src/theming/themes";
import { type Config } from "tailwindcss";

export default {
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "12px 12px 12px rgba(0, 0, 0, 0.1), -10px 0px 10px white",
        csm: " -0px -0px 5px rgba(0, 0, 0, 0.3), inset 1px 0px 5px white",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        cit: {
          ...defaultThemes["bumblebee"],
          primary: "#f4c522",
          secondary: "#f4c522",
        },
      },
    ],
  },
} satisfies Config;
