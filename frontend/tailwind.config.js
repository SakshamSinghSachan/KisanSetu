/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
        saffron: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
        earth: { 50: '#fdf8f0', 100: '#f5e6d3', 200: '#e8cba4', 300: '#d4a574', 400: '#c4854d', 500: '#a0673c', 600: '#8b5a34', 700: '#704a2c', 800: '#5c3d26', 900: '#4a3221' }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #f97316 100%)',
        'card-gradient': 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
        'dark-gradient': 'linear-gradient(135deg, #14532d 0%, #166534 100%)'
      },
      boxShadow: {
        'premium': '0 20px 60px rgba(22, 163, 74, 0.15)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 40px rgba(34, 197, 94, 0.3)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
