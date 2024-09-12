import daisyui from "daisyui";
import defaultThemes from "daisyui/src/theming/themes";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "12px 12px 12px rgba(0, 0, 0, 0.1), -10px 0px 10px white",
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
});
