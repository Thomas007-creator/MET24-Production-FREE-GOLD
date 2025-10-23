/**
 * BMAD (Basis Mens AI Design) Color System
 * 
 * Unified color system based on MBTI personality adaptations and psychological color theory.
 * This system provides consistent color schemes across the entire application based on 
 * personality types and functional contexts.
 */

// MBTI Color Schemes based on BMAD specifications
export interface ColorScheme {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Gradient combinations
  gradient: string;
  gradientLight: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  
  // Accent colors
  accent: string;
  accentLight: string;
  
  // Psychological attributes
  psychological: {
    energy: 'energetic' | 'calm' | 'warm' | 'cool';
    mood: 'vibrant' | 'sophisticated' | 'friendly' | 'professional';
    engagement: 'stimulating' | 'soothing' | 'inspiring' | 'confident';
  };
}

// MBTI-based color schemes from BMAD specifications
export const MBTIColorSchemes: Record<string, ColorScheme> = {
  // Extraverted types - Vibrant & Energetic
  extraverted_vibrant: {
    primary: '#ff6b35',
    primaryLight: '#ff8f65',
    primaryDark: '#e55a2b',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    gradientLight: 'from-orange-400 via-red-400 to-pink-400',
    background: 'from-orange-50 to-red-50',
    backgroundSecondary: 'from-orange-100 to-red-100',
    text: '#1a202c',
    textSecondary: '#4a5568',
    accent: '#e53e3e',
    accentLight: '#fc8181',
    psychological: {
      energy: 'energetic',
      mood: 'vibrant',
      engagement: 'stimulating'
    }
  },

  // Introverted types - Calm & Sophisticated  
  introverted_calm: {
    primary: '#4299e1',
    primaryLight: '#63b3ed',
    primaryDark: '#3182ce',
    gradient: 'from-blue-500 via-purple-500 to-indigo-500',
    gradientLight: 'from-blue-400 via-purple-400 to-indigo-400',
    background: 'from-blue-50 to-purple-50',
    backgroundSecondary: 'from-blue-100 to-purple-100',
    text: '#1a202c',
    textSecondary: '#4a5568',
    accent: '#805ad5',
    accentLight: '#b794f6',
    psychological: {
      energy: 'calm',
      mood: 'sophisticated',
      engagement: 'soothing'
    }
  },

  // Feeling types - Warm & Personal
  feeling_warm: {
    primary: '#ed8936',
    primaryLight: '#f6ad55',
    primaryDark: '#dd6b20',
    gradient: 'from-yellow-400 via-orange-400 to-red-400',
    gradientLight: 'from-yellow-300 via-orange-300 to-red-300',
    background: 'from-yellow-50 to-orange-50',
    backgroundSecondary: 'from-yellow-100 to-orange-100',
    text: '#1a202c',
    textSecondary: '#4a5568',
    accent: '#f56565',
    accentLight: '#feb2b2',
    psychological: {
      energy: 'warm',
      mood: 'friendly',
      engagement: 'inspiring'
    }
  },

  // Thinking types - Professional & Strong
  thinking_professional: {
    primary: '#319795',
    primaryLight: '#4fd1c7',
    primaryDark: '#2c7a7b',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    gradientLight: 'from-teal-400 via-cyan-400 to-blue-400',
    background: 'from-teal-50 to-cyan-50',
    backgroundSecondary: 'from-teal-100 to-cyan-100',
    text: '#1a202c',
    textSecondary: '#4a5568',
    accent: '#3182ce',
    accentLight: '#63b3ed',
    psychological: {
      energy: 'cool',
      mood: 'professional',
      engagement: 'confident'
    }
  },

  // Intuitive types - Creative & Conceptual
  intuitive_creative: {
    primary: '#805ad5',
    primaryLight: '#b794f6',
    primaryDark: '#6b46c1',
    gradient: 'from-purple-500 via-pink-500 to-indigo-500',
    gradientLight: 'from-purple-400 via-pink-400 to-indigo-400',
    background: 'from-purple-50 to-pink-50',
    backgroundSecondary: 'from-purple-100 to-pink-100',
    text: '#1a202c',
    textSecondary: '#4a5568',
    accent: '#ed64a6',
    accentLight: '#f687b3',
    psychological: {
      energy: 'energetic',
      mood: 'vibrant',
      engagement: 'inspiring'
    }
  },

  // Sensing types - Nature-inspired & Calming
  sensing_nature: {
    primary: '#38a169',
    primaryLight: '#68d391',
    primaryDark: '#2f855a',
    gradient: 'from-green-500 via-teal-500 to-blue-500',
    gradientLight: 'from-green-400 via-teal-400 to-blue-400',
    background: 'from-green-50 to-teal-50',
    backgroundSecondary: 'from-green-100 to-teal-100',
    text: '#1a202c',
    textSecondary: '#4a5568',
    accent: '#319795',
    accentLight: '#4fd1c7',
    psychological: {
      energy: 'calm',
      mood: 'sophisticated',
      engagement: 'soothing'
    }
  }
};

// Functional area color schemes
export const FunctionalColorSchemes = {
  // Onboarding journey colors
  onboarding: {
    intro: MBTIColorSchemes.feeling_warm, // Welcoming
    auth: MBTIColorSchemes.thinking_professional, // Trustworthy
    profile: MBTIColorSchemes.intuitive_creative, // Personal expression
    mbti: MBTIColorSchemes.introverted_calm, // Introspective
    interests: MBTIColorSchemes.extraverted_vibrant, // Exploratory
    wellness: MBTIColorSchemes.sensing_nature, // Health & nature
    notifications: MBTIColorSchemes.feeling_warm, // Gentle
    verification: MBTIColorSchemes.thinking_professional, // Secure
  },

  // Core app functionality
  app: {
    mainView: MBTIColorSchemes.intuitive_creative,
    backToBasics: MBTIColorSchemes.sensing_nature,
    profile: MBTIColorSchemes.feeling_warm,
    analytics: MBTIColorSchemes.thinking_professional,
    chat: MBTIColorSchemes.extraverted_vibrant,
  }
};

// Levensgebieden (Life Areas) color mapping
export const LevensgebiedenColors = {
  'Actieve Imaginatie': {
    gradient: MBTIColorSchemes.intuitive_creative.gradient,
    primary: MBTIColorSchemes.intuitive_creative.primary,
    emoji: '🧘'
  },
  'Basis Behoeften': {
    gradient: MBTIColorSchemes.sensing_nature.gradient,
    primary: MBTIColorSchemes.sensing_nature.primary,
    emoji: '🏠'
  },
  'Familie & Vrienden': {
    gradient: MBTIColorSchemes.feeling_warm.gradient,
    primary: MBTIColorSchemes.feeling_warm.primary,
    emoji: '👨‍👩‍👧‍👦'
  },
  'Financiën': {
    gradient: MBTIColorSchemes.thinking_professional.gradient,
    primary: MBTIColorSchemes.thinking_professional.primary,
    emoji: '💰'
  },
  'Fysieke Gezondheid': {
    gradient: MBTIColorSchemes.sensing_nature.gradient,
    primary: MBTIColorSchemes.sensing_nature.primary,
    emoji: '💪'
  },
  'Mentale Gezondheid': {
    gradient: MBTIColorSchemes.introverted_calm.gradient,
    primary: MBTIColorSchemes.introverted_calm.primary,
    emoji: '🧠'
  },
  'Partnerschap': {
    gradient: MBTIColorSchemes.feeling_warm.gradient,
    primary: MBTIColorSchemes.feeling_warm.primary,
    emoji: '💕'
  },
  'Professionele Ontwikkeling': {
    gradient: MBTIColorSchemes.thinking_professional.gradient,
    primary: MBTIColorSchemes.thinking_professional.primary,
    emoji: '📈'
  },
  'Werk & Samenleving': {
    gradient: MBTIColorSchemes.extraverted_vibrant.gradient,
    primary: MBTIColorSchemes.extraverted_vibrant.primary,
    emoji: '💼'
  }
};

// Color system utilities
export class BMADColorSystem {
  /**
   * Get color scheme based on personality preferences
   */
  static getPersonalityColorScheme(mbtiType?: string): ColorScheme {
    if (!mbtiType) return MBTIColorSchemes.feeling_warm; // Default

    const type = mbtiType.toUpperCase();
    
    // Determine primary psychological characteristics
    const isExtraverted = type.includes('E');
    const isIntuitive = type.includes('N');
    const isFeeling = type.includes('F');
    const isThinking = type.includes('T');

    // Apply BMAD color mapping logic
    if (isExtraverted && isFeeling) {
      return MBTIColorSchemes.extraverted_vibrant;
    } else if (!isExtraverted && isIntuitive) {
      return MBTIColorSchemes.introverted_calm;
    } else if (isFeeling) {
      return MBTIColorSchemes.feeling_warm;
    } else if (isThinking) {
      return MBTIColorSchemes.thinking_professional;
    } else if (isIntuitive) {
      return MBTIColorSchemes.intuitive_creative;
    } else {
      return MBTIColorSchemes.sensing_nature;
    }
  }

  /**
   * Get functional area color scheme
   */
  static getFunctionalColorScheme(area: string): ColorScheme {
    if (area in FunctionalColorSchemes.onboarding) {
      return FunctionalColorSchemes.onboarding[area as keyof typeof FunctionalColorSchemes.onboarding];
    }
    if (area in FunctionalColorSchemes.app) {
      return FunctionalColorSchemes.app[area as keyof typeof FunctionalColorSchemes.app];
    }
    return MBTIColorSchemes.feeling_warm; // Default
  }

  /**
   * Get levensgebied colors
   */
  static getLevensgebiedColors(levensgebied: string) {
    return LevensgebiedenColors[levensgebied as keyof typeof LevensgebiedenColors] || {
      gradient: MBTIColorSchemes.feeling_warm.gradient,
      primary: MBTIColorSchemes.feeling_warm.primary,
      emoji: '📝'
    };
  }

  /**
   * Convert gradient to button color
   */
  static getButtonColorFromGradient(gradient: string): string {
    // Extract primary color from gradient for button backgrounds
    if (gradient.includes('orange')) return 'bg-orange-500 hover:bg-orange-600';
    if (gradient.includes('blue')) return 'bg-blue-500 hover:bg-blue-600';
    if (gradient.includes('purple')) return 'bg-purple-500 hover:bg-purple-600';
    if (gradient.includes('green')) return 'bg-green-500 hover:bg-green-600';
    if (gradient.includes('teal')) return 'bg-teal-500 hover:bg-teal-600';
    if (gradient.includes('yellow')) return 'bg-yellow-500 hover:bg-yellow-600';
    if (gradient.includes('red')) return 'bg-red-500 hover:bg-red-600';
    if (gradient.includes('pink')) return 'bg-pink-500 hover:bg-pink-600';
    return 'bg-blue-500 hover:bg-blue-600'; // Default
  }

  /**
   * Generate glassmorphism classes with BMAD colors
   */
  static getGlassmorphismClasses(colorScheme: ColorScheme): string {
    return `bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl`;
  }

  /**
   * Get text color classes for contrast
   */
  static getTextColorClasses(colorScheme: ColorScheme): string {
    return `text-gray-800 dark:text-gray-200`;
  }

  /**
   * Generate animation classes based on psychological energy
   */
  static getAnimationClasses(colorScheme: ColorScheme): string {
    const energy = colorScheme.psychological.energy;
    
    switch (energy) {
      case 'energetic':
        return 'transition-all duration-300 hover:scale-105 hover:shadow-2xl';
      case 'calm':
        return 'transition-all duration-500 hover:shadow-lg';
      case 'warm':
        return 'transition-all duration-400 hover:scale-102 hover:shadow-xl';
      case 'cool':
        return 'transition-all duration-300 hover:shadow-lg';
      default:
        return 'transition-all duration-300';
    }
  }
}

export default BMADColorSystem;