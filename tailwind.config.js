


/** @type {import('tailwindcss').Config} */
import tailwindcssMotion from 'tailwindcss-motion';

export default {
  content: ['./src/react-app/**/*.{html,js,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'gold': '#D4AF37', // Primary CTAs and key elements
        'deep-teal': '#1B5956', // Secondary CTAs and frames
        'white': '#FFFFFF', // Main background
        
        // Secondary Colors
        'light-gold': '#F4E4B8', // Subtle backgrounds and highlights
        'dark-teal': '#0F3D3A', // Headers and important text
        'warm-grey': '#F5F5F3', // Alternative backgrounds
        
        // Accent Colors
        'success-green': '#2D7A5A', // Positive actions
        'alert-red': '#C4463A', // Warnings and notices
        'info-blue': '#4A90A4', // Informational elements
        
        // Neutrals
        'dark-grey': '#2C2C2C', // Body text
        'medium-grey': '#757575', // Secondary text
        'light-grey': '#E8E8E8', // Borders and dividers

        // Backward compatibility aliases
        'primary': '#D4AF37', // Gold
        'primary-dark': '#0F3D3A', // Dark Teal
        'primary-light': '#F4E4B8', // Light Gold
        'text-primary': '#2C2C2C', // Dark Grey
        'text-secondary': '#757575', // Medium Grey
        'text-muted': '#757575', // Medium Grey
        'surface': '#FFFFFF', // White
        'surface-hover': '#F5F5F3', // Warm Grey
        'border': '#E8E8E8', // Light Grey
        'accent': '#D4AF37', // Gold
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'modern': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modern-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'modern-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [tailwindcssMotion],
};



