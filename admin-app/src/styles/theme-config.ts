/**
 * Theme Configuration
 * 
 * Hier kun je makkelijk alle kleuren en styling aanpassen voor de hele app.
 * Verander alleen de waarden hier en de styling wordt automatisch overal toegepast.
 */

export const themeConfig = {
  // ===== KLEUREN =====
  colors: {
    // Primary brand kleuren
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe', 
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',  // Hoofdkleur - verander deze voor nieuwe brand kleur
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Secondary kleuren
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',  // Hoofdkleur - verander deze voor nieuwe secondary kleur
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Accent kleuren voor highlights
    accent: {
      aqua: '#64dfdf',        // Verander voor nieuwe accent kleur
      'aqua-light': '#80ffdb',
      gold: '#FFD700',
      'gold-light': '#FFA500',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
    },
  },
  
  // ===== GRADIËNTEN =====
  gradients: {
    // Onboarding achtergrond
    onboarding: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    
    // MainView achtergrond  
    mainview: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    
    // Primary gradiënt
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    
    // Accent gradiënt
    accent: 'linear-gradient(135deg, #64dfdf 0%, #80ffdb 100%)',
  },
  
  // ===== BORDER RADIUS =====
  borderRadius: {
    sm: '0.125rem',
    default: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    card: '1rem',      // Verander voor nieuwe card radius
    button: '0.5rem',  // Verander voor nieuwe button radius
    modal: '1.5rem',   // Verander voor nieuwe modal radius
  },
  
  // ===== SHADOWS =====
  shadows: {
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    glow: '0 0 20px rgba(59, 130, 246, 0.5)',
    'glow-accent': '0 0 20px rgba(100, 223, 223, 0.4)',
    elevation: {
      1: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      4: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },
  
  // ===== SPACING =====
  spacing: {
    section: '6rem',    // Verander voor nieuwe section spacing
    container: '4rem',  // Verander voor nieuwe container spacing
    card: '1.5rem',     // Verander voor nieuwe card spacing
    element: '1rem',    // Verander voor nieuwe element spacing
  },
  
  // ===== ANIMATIES =====
  animations: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  // ===== THEMA VARIANTS =====
  themes: {
    // Light theme (voor toekomstig gebruik)
    light: {
      background: '#ffffff',
      text: '#1f2937',
      card: '#f9fafb',
    },
    
    // Dark theme (huidige standaard)
    dark: {
      background: '#1e293b',
      text: '#ffffff',
      card: 'rgba(255, 255, 255, 0.1)',
    },
    
    // High contrast theme (voor toegankelijkheid)
    highContrast: {
      background: '#000000',
      text: '#ffffff',
      card: '#333333',
    },
  },
};

// ===== HELPER FUNCTIES =====

/**
 * Genereer CSS custom properties van de theme config
 */
export const generateCSSVariables = () => {
  const variables: Record<string, string> = {};
  
  // Colors
  Object.entries(themeConfig.colors.primary).forEach(([key, value]) => {
    variables[`--color-primary-${key}`] = value;
  });
  
  Object.entries(themeConfig.colors.secondary).forEach(([key, value]) => {
    variables[`--color-secondary-${key}`] = value;
  });
  
  Object.entries(themeConfig.colors.accent).forEach(([key, value]) => {
    variables[`--color-accent-${key}`] = value;
  });
  
  // Gradients
  Object.entries(themeConfig.gradients).forEach(([key, value]) => {
    variables[`--gradient-${key}`] = value;
  });
  
  // Border radius
  Object.entries(themeConfig.borderRadius).forEach(([key, value]) => {
    variables[`--radius-${key}`] = value;
  });
  
  // Shadows
  Object.entries(themeConfig.shadows).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables[`--shadow-${key}`] = value;
    } else {
      Object.entries(value).forEach(([subKey, subValue]) => {
        variables[`--shadow-${key}-${subKey}`] = subValue;
      });
    }
  });
  
  // Spacing
  Object.entries(themeConfig.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value;
  });
  
  return variables;
};

/**
 * Pas theme dynamisch aan
 */
export const applyTheme = (themeName: keyof typeof themeConfig.themes) => {
  const theme = themeConfig.themes[themeName];
  const root = document.documentElement;
  
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
};

/**
 * Export voor gebruik in componenten
 */
export default themeConfig;








