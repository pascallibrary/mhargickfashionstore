/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        pink: {
          500: '#ec4899', // Neon pink for buttons
          600: '#db2777', // Hover state
        },
        green: {
          400: '#4ade80', // Golf green for buttons
          500: '#22c55e', // Hover state
        },
        gray: {
          700: '#374151', // Dark gray for inputs
          800: '#1f2937', // Darker gray for cards
          900: '#111827', // Deep black for background
        },
        purple: {
          900: '#4c1d95', // Deep purple for hero gradient
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(236, 72, 153, 0.5)', // Neon glow for buttons
      },
    },
  },
  plugins: [],
};