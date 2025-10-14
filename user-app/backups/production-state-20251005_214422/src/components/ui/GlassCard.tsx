import React from 'react';
import { Card, CardBody, CardProps } from '@nextui-org/react';

interface GlassCardProps extends Omit<CardProps, 'className'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'info';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'primary',
  padding = 'md',
  className = '',
  hover = false,
  ...props
}) => {
  const baseClasses = 'backdrop-blur-xl shadow-glass';

  const variantClasses = {
    primary: 'bg-glass-primary border-glass-border',
    secondary: 'bg-glass-secondary border-glass-borderLight',
    accent: 'bg-glass-accent border-glass-border',
    info: 'bg-glass-secondary border-glass-borderStrong',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverClasses = hover
    ? 'hover:bg-glass-accent hover:border-glass-borderStrong hover:shadow-glow-aqua transition-all duration-300'
    : '';

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return (
    <Card className={cardClasses} {...props}>
      <CardBody className={paddingClasses[padding]}>{children}</CardBody>
    </Card>
  );
};

export default GlassCard;

export type { GlassCardProps };
