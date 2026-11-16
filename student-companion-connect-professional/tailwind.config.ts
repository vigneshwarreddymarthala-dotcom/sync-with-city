import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#fff",
      orange: "#F54768",
      black: "#1C1C1C",
      gray: "#CFCFCF",
      lDGray: "#dedede",
      darkGray: "#6c6c6c",
      green: "#198754",
      red: "#DC3545",
      lightGray: "#F8F8F8",
    },
    extend: {
      backgroundImage: {
        landingGradient: "linear-gradient(135deg,  #6645ea 0%,#F54768 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
