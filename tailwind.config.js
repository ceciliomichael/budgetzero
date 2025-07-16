/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'brand-primary': {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd7ff',
          300: '#8ebeff',
          400: '#589bff',
          500: '#4A90E2', // Original brand-primary
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Secondary brand colors
        'brand-secondary': {
          50: '#edfff9',
          100: '#d6fff1',
          200: '#b0ffdf',
          300: '#50E3C2', // Original brand-secondary
          400: '#2dd4b2',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Accent colors
        'brand-accent': {
          50: '#fff9eb',
          100: '#ffefc6',
          200: '#ffdb87',
          300: '#F5A623', // Original brand-accent
          400: '#f59e0b',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Enhanced glass effects
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(15, 23, 42, 0.2)',
        'glass-white-strong': 'rgba(255, 255, 255, 0.25)',
        'glass-dark-strong': 'rgba(15, 23, 42, 0.35)',
        'glass-white-heavy': 'rgba(255, 255, 255, 0.4)',
        'glass-dark-heavy': 'rgba(15, 23, 42, 0.5)',
        // Gradient stops
        'gradient-start': '#4A90E2',
        'gradient-mid': '#50E3C2',
        'gradient-end': '#F5A623',
        // Dark mode specific colors
        'dark-surface': '#121212',
        'dark-surface-1': '#1E1E1E',
        'dark-surface-2': '#2D2D2D',
        'dark-surface-3': '#3D3D3D',
        'aurora-a': '#12243e',
        'aurora-b': '#0f3d54',
        'aurora-c': '#4f2e53',
        'aurora-d': '#2f1a47'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 2px 8px 0 rgba(31, 38, 135, 0.2)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.45)',
        'glass-inner': 'inset 0 0 16px 0 rgba(31, 38, 135, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'neon': '0 0 10px rgba(74, 144, 226, 0.5), 0 0 20px rgba(74, 144, 226, 0.3)',
        'neon-accent': '0 0 10px rgba(245, 166, 35, 0.5), 0 0 20px rgba(245, 166, 35, 0.3)',
        'neon-secondary': '0 0 10px rgba(80, 227, 194, 0.5), 0 0 20px rgba(80, 227, 194, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-angular': 'conic-gradient(from 225deg, #4A90E2, #50E3C2, #F5A623, #4A90E2)',
        'gradient-mesh': 'linear-gradient(to right, rgba(74, 144, 226, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(74, 144, 226, 0.1) 1px, transparent 1px)',
        'page-gradient': 'radial-gradient(circle at top left, #1e3a8a, #0f172a 40%)',
        'page-gradient-light': 'radial-gradient(circle at top left, #f0f9ff, #f8fafc 40%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
        'gradient-shimmer-dark': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'gradient-flow': 'gradient-flow 3s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-down': 'slide-down 0.4s ease-out',
        'slide-left': 'slide-left 0.4s ease-out',
        'slide-right': 'slide-right 0.4s ease-out',
        'aurora': 'aurora 20s ease-in-out infinite'
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'aurora': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' }
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}