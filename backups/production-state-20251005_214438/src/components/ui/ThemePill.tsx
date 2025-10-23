import React from 'react';
import { Chip, ChipProps } from '@nextui-org/react';
import { LucideIcon } from 'lucide-react';

interface ThemePillProps
  extends Omit<ChipProps, 'className' | 'variant' | 'size'> {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'start' | 'end';
  className?: string;
  glassmorphism?: boolean;
}

const ThemePill: React.FC<ThemePillProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'start',
  className = '',
  glassmorphism = true,
  ...props
}) => {
  const baseClasses = glassmorphism ? 'backdrop-blur-xl border' : '';

  const variantClasses = {
    primary:
      'bg-glass-accent border-glass-borderStrong text-light-aqua-primary',
    secondary: 'bg-glass-secondary border-glass-borderLight text-text-light',
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    danger: 'bg-red-500/20 border-red-500/30 text-red-400',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    gradient:
      'bg-gradient-aqua border-glass-borderStrong text-dark-blue-primary font-semibold',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const chipClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const renderIcon = () => {
    if (!Icon) return null;

    const iconSizes = {
      sm: 12,
      md: 14,
      lg: 16,
    };

    const iconElement = <Icon size={iconSizes[size]} />;

    if (iconPosition === 'start') {
      return { startContent: iconElement };
    } else {
      return { endContent: iconElement };
    }
  };

  return (
    <Chip
      className={chipClasses}
      size={size}
      variant='flat'
      {...renderIcon()}
      {...props}
    >
      {children}
    </Chip>
  );
};

export default ThemePill;

export type { ThemePillProps };
