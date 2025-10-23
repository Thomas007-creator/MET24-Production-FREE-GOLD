import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'centered' | 'withDivider';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  iconSize?: number;
  showIcon?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className = '',
  iconSize,
  showIcon = true,
}) => {
  const baseClasses = 'text-white';

  const variantClasses = {
    primary: 'text-left',
    secondary: 'text-left opacity-90',
    centered: 'text-center',
    withDivider: 'text-left border-b border-[rgba(100,223,223,0.2)] pb-4',
  };

  const sizeClasses = {
    sm: {
      title: 'text-lg font-semibold',
      subtitle: 'text-sm text-[#e0e0e0]/70 mt-1',
      icon: 'w-6 h-6',
    },
    md: {
      title: 'text-xl font-semibold',
      subtitle: 'text-sm text-[#e0e0e0]/70 mt-2',
      icon: 'w-8 h-8',
    },
    lg: {
      title: 'text-2xl font-bold',
      subtitle: 'text-base text-[#e0e0e0]/70 mt-2',
      icon: 'w-10 h-10',
    },
    xl: {
      title: 'text-3xl font-bold',
      subtitle: 'text-lg text-[#e0e0e0]/70 mt-3',
      icon: 'w-12 h-12',
    },
  };

  const defaultIconSizes = {
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  };

  const currentSize = sizeClasses[size];
  const iconSizeToUse = iconSize || defaultIconSizes[size];

  const containerClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={containerClasses}>
      <div
        className={`flex items-center gap-3 ${variant === 'centered' ? 'justify-center' : ''}`}
      >
        {showIcon && Icon && (
          <div
            className={`${currentSize.icon} bg-[rgba(100,223,223,0.2)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(100,223,223,0.2)]`}
          >
            <Icon size={iconSizeToUse} className='text-[#64dfdf]' />
          </div>
        )}
        <div>
          <h2 className={currentSize.title}>{title}</h2>
          {subtitle && <p className={currentSize.subtitle}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default SectionTitle;

export type { SectionTitleProps };
