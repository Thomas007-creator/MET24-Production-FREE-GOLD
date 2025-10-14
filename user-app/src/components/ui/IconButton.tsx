import React from 'react';
import { Button, ButtonProps } from '@nextui-org/react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps
  extends Omit<ButtonProps, 'className' | 'variant' | 'size'> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tooltip?: string;
  loading?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className = '',
  tooltip,
  loading = false,
  ...props
}) => {
  const baseClasses = 'backdrop-blur-xl border transition-all duration-300';

  const variantClasses = {
    primary:
      'bg-glass-primary border-glass-border text-light-aqua-primary hover:bg-glass-accent hover:border-glass-borderStrong hover:shadow-glow-aqua-subtle',
    secondary:
      'bg-glass-secondary border-glass-borderLight text-light-aqua-primary hover:bg-glass-accent hover:border-glass-border hover:shadow-glow-aqua-subtle',
    ghost:
      'bg-transparent border-transparent text-light-aqua-primary hover:bg-glass-accent hover:border-glass-border',
    danger:
      'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50 hover:shadow-glow-danger',
  };

  const sizeClasses = {
    sm: 'w-8 h-8 min-w-8',
    md: 'w-10 h-10 min-w-10',
    lg: 'w-12 h-12 min-w-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const hoverClass = 'hover:-translate-y-0.5';
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClass} ${className}`;

  return (
    <Button
      isIconOnly
      className={buttonClasses}
      size={size}
      isLoading={loading}
      title={tooltip}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </Button>
  );
};

export default IconButton;

export type { IconButtonProps };
