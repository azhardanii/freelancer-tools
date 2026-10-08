import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#0B3B3C',
          950: '#062627',
        },
        darkteal: {
          DEFAULT: '#0A3638',
          hover: '#07282A',
          deep: '#062021',
        },
        softteal: {
          light: '#F4FAF9',
          DEFAULT: '#E8F5F3',
          border: '#CBE5E1',
          accent: '#A3D9D0',
        },
      },
      boxShadow: {
        subtle: '0 2px 8px -1px rgba(10, 54, 56, 0.05), 0 1px 3px -1px rgba(10, 54, 56, 0.03)',
        card: '0 4px 20px -2px rgba(10, 54, 56, 0.07), 0 2px 6px -1px rgba(10, 54, 56, 0.04)',
        hover: '0 10px 30px -4px rgba(10, 54, 56, 0.12), 0 4px 10px -2px rgba(10, 54, 56, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
