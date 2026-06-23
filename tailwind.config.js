/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F0E040',
        surface: '#1A1A1A',
        'surface-light': '#2A2A2A',
      },
      fontFamily: {
        impact: ['Impact', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
