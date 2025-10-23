import React, { ReactNode } from 'react';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  extraContent?: ReactNode;
  ariaLabel?: string;
  titleId?: string;
}

const getVariantStyles = (variant: string): Record<string, string> => {
  switch (variant) {
    case 'primary':
      return {
        cardBorder: 'border-[rgba(100,223,223,0.2)]',
        cardShadow: 'hover:shadow-[0_0_30px_rgba(100,223,223,0.2)]',
        cardRing: 'focus-within:ring-blue-500',
        buttonBg: 'bg-[rgba(100,223,223,0.2)]',
        buttonBorder: 'border-[rgba(100,223,223,0.3)]',
        buttonHoverBg: 'hover:bg-[rgba(100,223,223,0.3)]',
        buttonHoverBorder: 'hover:border-[rgba(100,223,223,0.5)]',
        buttonHoverShadow: 'hover:shadow-[0_0_20px_rgba(100,223,223,0.3)]',
      };
    case 'secondary':
      return {
        cardBorder: 'border-[rgba(168,85,247,0.2)]',
        cardShadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
        cardRing: 'focus-within:ring-purple-500',
        buttonBg: 'bg-[rgba(168,85,247,0.2)]',
        buttonBorder: 'border-[rgba(168,85,247,0.3)]',
        buttonHoverBg: 'hover:bg-[rgba(168,85,247,0.3)]',
        buttonHoverBorder: 'hover:border-[rgba(168,85,247,0.5)]',
        buttonHoverShadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      };
    case 'success':
      return {
        cardBorder: 'border-[rgba(34,197,94,0.2)]',
        cardShadow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]',
        cardRing: 'focus-within:ring-green-500',
        buttonBg: 'bg-[rgba(34,197,94,0.2)]',
        buttonBorder: 'border-[rgba(34,197,94,0.3)]',
        buttonHoverBg: 'hover:bg-[rgba(34,197,94,0.3)]',
        buttonHoverBorder: 'hover:border-[rgba(34,197,94,0.5)]',
        buttonHoverShadow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
      };
    case 'warning':
      return {
        cardBorder: 'border-[rgba(251,191,36,0.2)]',
        cardShadow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]',
        cardRing: 'focus-within:ring-yellow-500',
        buttonBg: 'bg-[rgba(251,191,36,0.2)]',
        buttonBorder: 'border-[rgba(251,191,36,0.3)]',
        buttonHoverBg: 'hover:bg-[rgba(251,191,36,0.3)]',
        buttonHoverBorder: 'hover:border-[rgba(251,191,36,0.5)]',
        buttonHoverShadow: 'hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]',
      };
    default:
      return getVariantStyles('primary');
  }
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  onClick,
  variant = 'primary',
  extraContent,
  ariaLabel,
  titleId,
}) => {
  const styles = getVariantStyles(variant);

  return (
    <Card
      className={`bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border ${styles.cardBorder} shadow-lg ${styles.cardShadow} hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 ${styles.cardRing} focus-within:ring-offset-2`}
      role='article'
      aria-labelledby={titleId || `${title.toLowerCase().replace(/\s+/g, '-')}-title`}
    >
      <CardHeader>
        <h3 id={titleId || `${title.toLowerCase().replace(/\s+/g, '-')}-title`} className='text-xl font-bold'>
          {icon} {title}
        </h3>
      </CardHeader>
      <CardBody>
        <p className='mb-4'>
          {description}
        </p>

        {extraContent}

        <Button
          color='primary'
          variant='solid'
          onClick={onClick}
          className={`${styles.buttonBg} text-white border ${styles.buttonBorder} ${styles.buttonHoverBg} ${styles.buttonHoverBorder} ${styles.buttonHoverShadow} hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2`}
          aria-label={ariaLabel || `${buttonText} voor ${title}`}
        >
          {buttonText}
        </Button>
      </CardBody>
    </Card>
  );
};