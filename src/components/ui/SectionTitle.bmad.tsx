/**
 * Section Title Component - BMAD Refactored
 * 
 * React component voor section titles met iconen
 * Refactored using BMAD composition patterns to eliminate boolean props
 * 
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { createContext, useContext } from 'react';
import { LucideIcon } from 'lucide-react';

// ================================================
// BMAD Types
// ================================================

interface SectionTitleContextType {
  title: string;
  subtitle?: string;
  variant: 'primary' | 'secondary' | 'centered' | 'withDivider';
  size: 'sm' | 'md' | 'lg' | 'xl';
  className: string;
}

// ================================================
// BMAD Section Title Context & Provider
// ================================================

const SectionTitleContext = createContext<SectionTitleContextType | null>(null);

interface SectionTitleProviderProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'centered' | 'withDivider';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SectionTitleProvider: React.FC<SectionTitleProviderProps> = ({
  children,
  title,
  subtitle,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const contextValue: SectionTitleContextType = {
    title,
    subtitle,
    variant,
    size,
    className
  };

  return (
    <SectionTitleContext.Provider value={contextValue}>
      {children}
    </SectionTitleContext.Provider>
  );
};

// ================================================
// BMAD Section Title Hook
// ================================================

const useSectionTitle = (): SectionTitleContextType => {
  const context = useContext(SectionTitleContext);
  if (!context) {
    throw new Error('useSectionTitle must be used within SectionTitleProvider');
  }
  return context;
};

// ================================================
// BMAD Section Title Icon Component
// ================================================

interface SectionTitleIconProps {
  icon: LucideIcon;
  iconSize?: number;
  className?: string;
}

const SectionTitleIcon: React.FC<SectionTitleIconProps> = ({ 
  icon: Icon, 
  iconSize, 
  className = "" 
}) => {
  const { size } = useSectionTitle();

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const defaultIconSizes = {
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  };

  const iconSizeToUse = iconSize || defaultIconSizes[size];
  const iconContainerClass = sizeClasses[size];

  return (
    <div
      className={`${iconContainerClass} bg-[rgba(100,223,223,0.2)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(100,223,223,0.2)] ${className}`}
    >
      <Icon size={iconSizeToUse} className='text-[#64dfdf]' />
    </div>
  );
};

// ================================================
// BMAD Section Title Text Component
// ================================================

interface SectionTitleTextProps {
  className?: string;
}

const SectionTitleText: React.FC<SectionTitleTextProps> = ({ className = "" }) => {
  const { title, subtitle, size } = useSectionTitle();

  const sizeClasses = {
    sm: {
      title: 'text-lg font-semibold',
      subtitle: 'text-sm text-[#e0e0e0]/70 mt-1',
    },
    md: {
      title: 'text-xl font-semibold',
      subtitle: 'text-sm text-[#e0e0e0]/70 mt-2',
    },
    lg: {
      title: 'text-2xl font-bold',
      subtitle: 'text-base text-[#e0e0e0]/70 mt-2',
    },
    xl: {
      title: 'text-3xl font-bold',
      subtitle: 'text-lg text-[#e0e0e0]/70 mt-3',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={className}>
      <h2 className={currentSize.title}>{title}</h2>
      {subtitle && <p className={currentSize.subtitle}>{subtitle}</p>}
    </div>
  );
};

// ================================================
// BMAD Section Title Container Component
// ================================================

interface SectionTitleContainerProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitleContainer: React.FC<SectionTitleContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  const { variant } = useSectionTitle();

  const baseClasses = 'text-white';
  const variantClasses = {
    primary: 'text-left',
    secondary: 'text-left opacity-90',
    centered: 'text-center',
    withDivider: 'text-left border-b border-[rgba(100,223,223,0.2)] pb-4',
  };

  const containerClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={containerClasses}>
      <div
        className={`flex items-center gap-3 ${variant === 'centered' ? 'justify-center' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};

// ================================================
// BMAD Section Title with Icon Component
// ================================================

interface SectionTitleWithIconProps {
  icon: LucideIcon;
  iconSize?: number;
  className?: string;
}

const SectionTitleWithIcon: React.FC<SectionTitleWithIconProps> = ({ 
  icon, 
  iconSize, 
  className = "" 
}) => {
  return (
    <SectionTitleContainer className={className}>
      <SectionTitleIcon icon={icon} iconSize={iconSize} />
      <SectionTitleText />
    </SectionTitleContainer>
  );
};

// ================================================
// BMAD Section Title without Icon Component
// ================================================

interface SectionTitleWithoutIconProps {
  className?: string;
}

const SectionTitleWithoutIcon: React.FC<SectionTitleWithoutIconProps> = ({ 
  className = "" 
}) => {
  return (
    <SectionTitleContainer className={className}>
      <SectionTitleText />
    </SectionTitleContainer>
  );
};

// ================================================
// BMAD Main Section Title Component
// ================================================

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'centered' | 'withDivider';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  iconSize?: number;
  displayMode?: 'withIcon' | 'withoutIcon';
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  iconSize,
  displayMode = 'withIcon'
}) => {
  return (
    <SectionTitleProvider
      title={title}
      subtitle={subtitle}
      variant={variant}
      size={size}
      className={className}
    >
      {displayMode === 'withIcon' && icon ? (
        <SectionTitleWithIcon icon={icon} iconSize={iconSize} />
      ) : (
        <SectionTitleWithoutIcon />
      )}
    </SectionTitleProvider>
  );
};

// ================================================
// BMAD Compound Components Export
// ================================================

export const SectionTitleComponents = {
  Provider: SectionTitleProvider,
  Title: SectionTitle,
  WithIcon: SectionTitleWithIcon,
  WithoutIcon: SectionTitleWithoutIcon,
  Icon: SectionTitleIcon,
  Text: SectionTitleText,
  Container: SectionTitleContainer,
  useSectionTitle
};

export default SectionTitle;
export type { SectionTitleProps };
