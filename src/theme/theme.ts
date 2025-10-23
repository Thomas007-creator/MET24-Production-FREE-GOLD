/**
 * Theme Configuration for Views
 *
 * This file provides the theme object that view components expect.
 * It includes colors, spacing, and typography configurations.
 */

export const theme = {
  colors: {
    backgroundGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    primary: '#0ea5e9',
    secondary: '#64748b',
    accent: '#64dfdf',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#ffffff',
    textSecondary: '#94a3b8',
  },

  spacing: {
    sectionPadding: '6rem',
    medium: '1rem',
    small: '0.5rem',
    large: '2rem',
  },

  typography: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: '700',
      lineHeight: '2.5rem',
      color: '#ffffff',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '2.25rem',
      color: '#ffffff',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '2rem',
      color: '#ffffff',
    },
    body: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5rem',
      color: '#ffffff',
    },
    caption: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.25rem',
      color: '#94a3b8',
    },
  },

  borderRadius: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
    card: '1rem',
  },

  shadows: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

export default theme;