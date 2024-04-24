import daisyui from "daisyui";
import defaultThemes from "daisyui/src/theming/themes";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        cit: {
          ...defaultThemes["bumblebee"],
          primary: "#f4c522",
          secondary: "#8a252c",
        },
      },
    ],
  },
});
