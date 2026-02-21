import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        gold: {
          50: '#fef9f0',
          100: '#fce8c9',
          200: '#fad194',
          300: '#f7ba5e',
          400: '#f5a326',
          500: '#d4af37',
          600: '#ad8000',
          700: '#8d6900',
          800: '#6d5100',
          900: '#4d3900',
        },
        slate: {
          950: '#0a0e27',
        },
      },
      animation: {
        blob: 'blob 7s infinite',
        slideIn: 'slideIn 0.5s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        slideIn: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-radial-ellipse': 'radial-gradient(ellipse 80% 80% at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropFilter: {
        none: 'none',
        blur: 'blur(10px)',
      },
    },
  },
  plugins: [],
};

export default config;
