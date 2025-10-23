import React from 'react';
import { Button } from '@nextui-org/react';

export interface NavigationButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'warning' | 'upgrade';
  ariaLabel: string;
  className?: string;
}

const getButtonStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    case 'warning':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold border-2 border-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2';
    case 'secondary':
      return 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-bold border-2 border-indigo-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2';
    default:
      return 'bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  }
};

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  ariaLabel,
  className = '',
}) => {
  const buttonColor = variant === 'warning' ? 'warning' : variant === 'secondary' ? 'secondary' : 'primary';
  const buttonVariant = variant === 'upgrade' ? 'solid' : 'bordered';

  return (
    <Button
      color={buttonColor as any}
      variant={buttonVariant}
      onClick={onClick}
      size='sm'
      aria-label={ariaLabel}
      className={`${getButtonStyles(variant)} ${className}`}
    >
      {children}
    </Button>
  );
};