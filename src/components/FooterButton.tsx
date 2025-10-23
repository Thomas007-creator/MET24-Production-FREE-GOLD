import React from 'react';
import { Button } from '@nextui-org/react';

export interface FooterButtonProps {
  onClick: () => void;
  icon: string;
  label: string;
  ariaLabel: string;
}

export const FooterButton: React.FC<FooterButtonProps> = ({
  onClick,
  icon,
  label,
  ariaLabel,
}) => {
  return (
    <Button
      color='primary'
      variant='solid'
      onClick={onClick}
      className='bg-[rgba(27,38,59,0.8)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(27,38,59,0.9)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 flex-1'
      aria-label={ariaLabel}
    >
      <div className='flex flex-col items-center gap-1'>
        <span className='text-lg' aria-hidden='true'>
          {icon}
        </span>
        <span className='text-xs font-medium'>{label}</span>
      </div>
    </Button>
  );
};