/**
 * Design System Components - Fallback Version
 * 
 * Deze versie gebruikt geen NextUI om de dom-animation error te voorkomen.
 * Alle styling is gebaseerd op Tailwind CSS en custom CSS.
 */

import React from 'react';

// ===== LAYOUT COMPONENTS =====

interface PageContainerProps {
  children: React.ReactNode;
  variant?: 'onboarding' | 'mainview' | 'default';
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'onboarding':
        return 'min-h-screen-safe bg-gradient-onboarding';
      case 'mainview':
        return 'min-h-screen-safe bg-gradient-mainview';
      default:
        return 'min-h-screen-safe bg-gradient-primary';
    }
  };

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
};

interface ContentContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({ 
  children, 
  size = 'lg',
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-2xl';
      case 'lg':
        return 'max-w-4xl';
      case 'xl':
        return 'max-w-7xl';
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <div className={`container-responsive ${getSizeClasses()} ${className}`}>
      {children}
    </div>
  );
};

// ===== CARD COMPONENTS =====

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'strong' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  variant = 'light',
  className = '',
  onClick 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'strong':
        return 'glass-strong';
      case 'dark':
        return 'glass-dark';
      default:
        return 'glass';
    }
  };

  const baseClasses = `${getVariantClasses()} rounded-card shadow-glass hover-lift`;
  const interactiveClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// ===== BUTTON COMPONENTS =====

interface StyledButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const StyledButton: React.FC<StyledButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-secondary';
      case 'accent':
        return 'btn-accent';
      case 'glass':
        return 'btn-glass';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      className={`${getVariantClasses()} ${getSizeClasses()} focus-ring rounded-button font-medium transition-all duration-300 ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

// ===== HEADER COMPONENTS =====

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle,
  icon,
  className = '' 
}) => {
  return (
    <header className={`text-center mb-8 ${className}`}>
      {icon && (
        <div className="mb-6">
          <div className="w-24 h-24 glass rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">{icon}</span>
          </div>
        </div>
      )}
      <h1 className="text-4xl font-bold text-white mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </header>
  );
};

// ===== FORM COMPONENTS =====

interface FormContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};

// ===== STATUS COMPONENTS =====

interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'loading' | 'error';
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  label = 'Database',
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return { icon: '✅', text: 'Connected', color: 'text-green-400' };
      case 'disconnected':
        return { icon: '❌', text: 'Disconnected', color: 'text-red-400' };
      case 'loading':
        return { icon: '⏳', text: 'Loading...', color: 'text-yellow-400' };
      case 'error':
        return { icon: '⚠️', text: 'Error', color: 'text-red-400' };
      default:
        return { icon: '❓', text: 'Unknown', color: 'text-gray-400' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`glass rounded-lg p-3 ${className}`}>
      <p className="text-xs text-white/80">
        {label}: {config.icon} {config.text}
      </p>
    </div>
  );
};

// ===== ANIMATION COMPONENTS =====

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'float';
  delay?: number;
  className?: string;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ 
  children, 
  animation = 'fade-in',
  delay = 0,
  className = '' 
}) => {
  const getAnimationClass = () => {
    switch (animation) {
      case 'slide-up':
        return 'animate-slide-up';
      case 'scale-in':
        return 'animate-scale-in';
      case 'float':
        return 'animate-float';
      default:
        return 'animate-fade-in';
    }
  };

  const style = delay > 0 ? { animationDelay: `${delay}s` } : {};

  return (
    <div 
      className={`${getAnimationClass()} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

// ===== UTILITY COMPONENTS =====

interface SpacerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({ 
  size = 'md',
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4';
      case 'lg':
        return 'h-12';
      case 'xl':
        return 'h-16';
      default:
        return 'h-8';
    }
  };

  return <div className={`${getSizeClasses()} ${className}`} />;
};

interface DividerProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ 
  variant = 'light',
  className = '' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'dark':
        return 'border-white/20';
      default:
        return 'border-white/10';
    }
  };

  return (
    <hr className={`border-t ${getVariantClasses()} ${className}`} />
  );
};

// Export all components
export default {
  PageContainer,
  ContentContainer,
  GlassCard,
  StyledButton,
  PageHeader,
  FormContainer,
  FormGroup,
  StatusIndicator,
  AnimatedContainer,
  Spacer,
  Divider,
};








