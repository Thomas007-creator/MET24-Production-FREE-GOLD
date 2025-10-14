import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

interface NavigationFooterProps {
  items: NavigationItem[];
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabels?: boolean;
  glassmorphism?: boolean;
}

const NavigationFooter: React.FC<NavigationFooterProps> = ({
  items,
  variant = 'horizontal',
  size = 'md',
  className = '',
  showLabels = true,
  glassmorphism = true,
}) => {
  const baseClasses = glassmorphism
    ? 'bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border-t border-[rgba(100,223,223,0.2)] shadow-lg'
    : 'bg-[#1b263b] border-t border-[rgba(100,223,223,0.1)]';

  const variantClasses = {
    horizontal: 'flex items-center justify-around',
    vertical: 'flex flex-col space-y-2',
  };

  const sizeClasses = {
    sm: {
      container: 'p-2',
      item: 'p-2',
      icon: 16,
      text: 'text-xs',
    },
    md: {
      container: 'p-4',
      item: 'p-3',
      icon: 20,
      text: 'text-sm',
    },
    lg: {
      container: 'p-6',
      item: 'p-4',
      icon: 24,
      text: 'text-base',
    },
  };

  const currentSize = sizeClasses[size];

  const containerClasses = `${baseClasses} ${variantClasses[variant]} ${currentSize.container} ${className}`;

  const getItemClasses = (item: NavigationItem) => {
    const baseItemClasses = `flex items-center gap-2 rounded-lg transition-all duration-300 ${currentSize.item} ${currentSize.text}`;

    if (item.disabled) {
      return `${baseItemClasses} opacity-50 cursor-not-allowed`;
    }

    const variantClasses = {
      primary: item.active
        ? 'bg-[rgba(100,223,223,0.2)] text-[#64dfdf] shadow-[0_0_20px_rgba(100,223,223,0.3)]'
        : 'text-[#e0e0e0] hover:bg-[rgba(100,223,223,0.1)] hover:text-[#64dfdf] hover:shadow-[0_0_15px_rgba(100,223,223,0.2)]',
      secondary: item.active
        ? 'bg-[rgba(27,38,59,0.3)] text-[#64dfdf] border border-[rgba(100,223,223,0.3)]'
        : 'text-[#e0e0e0] hover:bg-[rgba(27,38,59,0.2)] hover:text-[#64dfdf]',
      ghost: item.active
        ? 'text-[#64dfdf]'
        : 'text-[#e0e0e0] hover:text-[#64dfdf]',
    };

    return `${baseItemClasses} ${variantClasses[item.variant || 'primary']}`;
  };

  return (
    <nav className={containerClasses}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={item.onClick}
            disabled={item.disabled}
            className={getItemClasses(item)}
          >
            <Icon size={currentSize.icon} />
            {showLabels && <span>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
};

export default NavigationFooter;

export type { NavigationFooterProps, NavigationItem };
