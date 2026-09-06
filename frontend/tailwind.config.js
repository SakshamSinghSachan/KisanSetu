/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 
          50: '#f0fdf4', 
          100: '#dcfce7', 
          200: '#bbf7d0', 
          300: '#86efac', 
          400: '#4ade80', 
          500: '#22c55e', 
          600: '#16a34a', 
          700: '#15803d', 
          800: '#166534', 
          900: '#14532d' 
        },
        saffron: { 
          50: '#fff7ed', 
          100: '#ffedd5', 
          200: '#fed7aa', 
          300: '#fdba74', 
          400: '#fb923c', 
          500: '#f97316', 
          600: '#ea580c', 
          700: '#c2410c', 
          800: '#9a3412', 
          900: '#7c2d12' 
        },
        earth: { 
          50: '#fdf8f0', 
          100: '#f5e6d3', 
          200: '#e8cba4', 
          300: '#d4a574', 
          400: '#c4854d', 
          500: '#a0673c', 
          600: '#8b5a34', 
          700: '#704a2c', 
          800: '#5c3d26', 
          900: '#4a3221' 
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #f97316 100%)',
        'card-gradient': 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
        'dark-gradient': 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
        'premium-gradient': 'linear-gradient(135deg, #16a34a 0%, #22c55e 25%, #f97316 75%, #ea580c 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
      },
      boxShadow: {
        'premium': '0 25px 80px rgba(22, 163, 74, 0.2)',
        'card': '0 4px 25px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 60px rgba(34, 197, 94, 0.4)',
        'glow-saffron': '0 0 60px rgba(249, 115, 22, 0.4)',
        'inner-glow': 'inset 0 0 30px rgba(34, 197, 94, 0.1)',
        'soft': '0 4px 40px rgba(0, 0, 0, 0.08)',
        'elevated': '0 30px 100px rgba(0, 0, 0, 0.15)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      backdropBlur: {
        'xs': '2px'
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
