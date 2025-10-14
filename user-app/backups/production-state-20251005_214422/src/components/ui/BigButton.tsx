import React from 'react';
import { Button, ButtonProps } from '@nextui-org/react';
import { LucideIcon } from 'lucide-react';

interface BigButtonProps
  extends Omit<ButtonProps, 'className' | 'variant' | 'size'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'start' | 'end';
  className?: string;
  loading?: boolean;
  loadingText?: string;
}

const BigButton: React.FC<BigButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  icon: Icon,
  iconPosition = 'end',
  className = '',
  loading = false,
  loadingText,
  ...props
}) => {
  const baseClasses = 'backdrop-blur-xl border transition-all duration-300';

  const variantClasses = {
    primary:
      'bg-glass-accent border-glass-borderStrong text-text-lighter hover:bg-glass-primary hover:border-glass-border hover:shadow-glow-aqua-strong',
    secondary:
      'bg-glass-primary border-glass-border text-light-aqua-primary hover:bg-glass-accent hover:border-glass-borderStrong hover:shadow-glow-aqua-subtle',
    success:
      'bg-green-500/20 border-green-500/30 text-white hover:bg-green-500/30 hover:border-green-500/50 hover:shadow-glow-success',
    warning:
      'bg-yellow-500/20 border-yellow-500/30 text-white hover:bg-yellow-500/30 hover:border-yellow-500/50 hover:shadow-glow-warning',
    danger:
      'bg-red-500/20 border-red-500/30 text-white hover:bg-red-500/30 hover:border-red-500/50 hover:shadow-glow-danger',
    gold: 'bg-gradient-gold text-dark-blue-primary font-bold border-2 border-orange-600 hover:shadow-glow-gold',
  };

  const sizeClasses = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
    xl: 'text-xl px-10 py-5',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const hoverClass = variant !== 'gold' ? 'hover:-translate-y-1' : '';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${hoverClass} ${className}`;

  const renderIcon = () => {
    if (!Icon) return null;

    const iconElement = (
      <Icon size={size === 'xl' ? 24 : size === 'lg' ? 20 : 16} />
    );

    if (iconPosition === 'start') {
      return { startContent: iconElement };
    } else {
      return { endContent: iconElement };
    }
  };

  return (
    <Button
      className={buttonClasses}
      size={size === 'xl' ? 'lg' : size}
      isLoading={loading}
      {...renderIcon()}
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};

export default BigButton;

export type { BigButtonProps };
