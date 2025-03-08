import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
		center: true,
		padding: {
		  DEFAULT: '1rem',
		  sm: '2rem',
		  lg: '4rem',
		  xl: '5rem',
		  '2xl': '6rem',
		},
	  },
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(90deg, #fc4a1a, #f7b733)",
        "custom-gradient-hover": "linear-gradient(90deg, #f7b733, #fc4a1a)",
      },
      colors: {
        body: "#88898A",
        primary: "#fc4a1a",
        title: "#33333B",
      },
    },
  },

  plugins: [],
};
export default config;
