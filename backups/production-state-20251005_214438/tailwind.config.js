/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // CSS Custom Properties voor makkelijke aanpassingen
      colors: {
        // Primary brand colors - makkelijk aan te passen
        primary: {
          50: 'var(--color-primary-50, #f0f9ff)',
          100: 'var(--color-primary-100, #e0f2fe)',
          200: 'var(--color-primary-200, #bae6fd)',
          300: 'var(--color-primary-300, #7dd3fc)',
          400: 'var(--color-primary-400, #38bdf8)',
          500: 'var(--color-primary-500, #0ea5e9)',
          600: 'var(--color-primary-600, #0284c7)',
          700: 'var(--color-primary-700, #0369a1)',
          800: 'var(--color-primary-800, #075985)',
          900: 'var(--color-primary-900, #0c4a6e)',
          DEFAULT: 'var(--color-primary, #0ea5e9)',
          foreground: 'var(--color-primary-foreground, #ffffff)',
        },
        // Secondary colors
        secondary: {
          50: 'var(--color-secondary-50, #f8fafc)',
          100: 'var(--color-secondary-100, #f1f5f9)',
          200: 'var(--color-secondary-200, #e2e8f0)',
          300: 'var(--color-secondary-300, #cbd5e1)',
          400: 'var(--color-secondary-400, #94a3b8)',
          500: 'var(--color-secondary-500, #64748b)',
          600: 'var(--color-secondary-600, #475569)',
          700: 'var(--color-secondary-700, #334155)',
          800: 'var(--color-secondary-800, #1e293b)',
          900: 'var(--color-secondary-900, #0f172a)',
          DEFAULT: 'var(--color-secondary, #64748b)',
          foreground: 'var(--color-secondary-foreground, #ffffff)',
        },
        // Accent colors voor highlights
        accent: {
          aqua: 'var(--color-accent-aqua, #64dfdf)',
          'aqua-light': 'var(--color-accent-aqua-light, #80ffdb)',
          gold: 'var(--color-accent-gold, #FFD700)',
          'gold-light': 'var(--color-accent-gold-light, #FFA500)',
          success: 'var(--color-accent-success, #22c55e)',
          warning: 'var(--color-accent-warning, #f59e0b)',
          danger: 'var(--color-accent-danger, #ef4444)',
          info: 'var(--color-accent-info, #3b82f6)',
        },
        // Glassmorphism colors
        glass: {
          light: 'var(--color-glass-light, rgba(255, 255, 255, 0.1))',
          medium: 'var(--color-glass-medium, rgba(255, 255, 255, 0.2))',
          strong: 'var(--color-glass-strong, rgba(255, 255, 255, 0.3))',
          dark: 'var(--color-glass-dark, rgba(0, 0, 0, 0.1))',
          'dark-medium': 'var(--color-glass-dark-medium, rgba(0, 0, 0, 0.2))',
          'dark-strong': 'var(--color-glass-dark-strong, rgba(0, 0, 0, 0.3))',
        },
      },
      // Gradient backgrounds - makkelijk aan te passen
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary, linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%))',
        'gradient-secondary': 'var(--gradient-secondary, linear-gradient(135deg, #64748b 0%, #475569 100%))',
        'gradient-accent': 'var(--gradient-accent, linear-gradient(135deg, #64dfdf 0%, #80ffdb 100%))',
        'gradient-onboarding': 'var(--gradient-onboarding, linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%))',
        'gradient-mainview': 'var(--gradient-mainview, linear-gradient(135deg, #1e293b 0%, #334155 100%))',
        'gradient-glass': 'var(--gradient-glass, linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%))',
        'gradient-glass-dark': 'var(--gradient-glass-dark, linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%))',
      },
      // Border radius system
      borderRadius: {
        'none': '0px',
        'sm': 'var(--radius-sm, 0.125rem)',
        'small': 'var(--radius-small, 0.25rem)',
        'DEFAULT': 'var(--radius-default, 0.25rem)',
        'md': 'var(--radius-md, 0.375rem)',
        'medium': 'var(--radius-medium, 0.5rem)',
        'lg': 'var(--radius-lg, 0.5rem)',
        'large': 'var(--radius-large, 0.75rem)', // NextUI compatibility
        'xl': 'var(--radius-xl, 0.75rem)',
        '2xl': 'var(--radius-2xl, 1rem)',
        '3xl': 'var(--radius-3xl, 1.5rem)',
        '4xl': 'var(--radius-4xl, 2rem)',
        '5xl': 'var(--radius-5xl, 2.5rem)',
        '6xl': 'var(--radius-6xl, 3rem)',
        'full': '9999px',
        // Semantic radius
        'card': 'var(--radius-card, 1rem)',
        'button': 'var(--radius-button, 0.5rem)',
        'input': 'var(--radius-input, 0.5rem)',
        'modal': 'var(--radius-modal, 1.5rem)',
      },
      // Border width system
      borderWidth: {
        'none': '0px',
        'thin': '1px',
        'DEFAULT': '1px',
        'medium': '2px',
        'thick': '3px',
        'thicker': '4px',
        'thickest': '5px',
      },
      // Shadow system
      boxShadow: {
        'glass': 'var(--shadow-glass, 0 8px 32px 0 rgba(31, 38, 135, 0.37))',
        'glass-inset': 'var(--shadow-glass-inset, inset 0 1px 0 0 rgba(255, 255, 255, 0.05))',
        'glass-strong': 'var(--shadow-glass-strong, 0 8px 32px 0 rgba(31, 38, 135, 0.5))',
        'glow': 'var(--shadow-glow, 0 0 20px rgba(59, 130, 246, 0.5))',
        'glow-lg': 'var(--shadow-glow-lg, 0 0 40px rgba(59, 130, 246, 0.6))',
        'glow-xl': 'var(--shadow-glow-xl, 0 0 60px rgba(59, 130, 246, 0.7))',
        'glow-accent': 'var(--shadow-glow-accent, 0 0 20px rgba(100, 223, 223, 0.4))',
        'elevation-1': 'var(--shadow-elevation-1, 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06))',
        'elevation-2': 'var(--shadow-elevation-2, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))',
        'elevation-3': 'var(--shadow-elevation-3, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05))',
        'elevation-4': 'var(--shadow-elevation-4, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04))',
      },
      // Backdrop blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      // Spacing system
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        // Semantic spacing
        'section': 'var(--spacing-section, 6rem)',
        'container': 'var(--spacing-container, 4rem)',
        'card': 'var(--spacing-card, 1.5rem)',
        'element': 'var(--spacing-element, 1rem)',
      },
      // Typography
      fontSize: {
        'tiny': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'small': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      // Animation system
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-delay': 'fadeIn 0.5s ease-in-out 0.4s both',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'scale-102': 'scale102 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scale102: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("@nextui-org/react"),
    function({ addUtilities }) {
      const newUtilities = {
        '.hover\\:glass-strong:hover': {
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'border-radius': '20px',
          'box-shadow': '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
        '.glass': {
          'background-color': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'border-radius': '16px',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        '.glass-strong': {
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'border-radius': '20px',
          'box-shadow': '0 12px 40px rgba(0, 0, 0, 0.15)',
        }
      }
      addUtilities(newUtilities)
    }
  ]
}