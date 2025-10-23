import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { appDownloadService } from '../services/appDownloadService';
import { logger } from '../utils/logger';

interface DownloadButtonProps {
  email?: string;
  name?: string;
  mbtiType?: string;
  source?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'bordered' | 'light';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
  onDownloadStart?: () => void;
  onDownloadSuccess?: () => void;
  onDownloadError?: (error: string) => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  email,
  name,
  mbtiType,
  source = 'hubspot',
  className = '',
  size = 'lg',
  variant = 'solid',
  color = 'primary',
  children,
  onDownloadStart,
  onDownloadSuccess,
  onDownloadError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadOption, setDownloadOption] = useState<any>(null);

  useEffect(() => {
    // Krijg beste download optie bij mount
    const option = appDownloadService.getBestDownloadOption();
    setDownloadOption(option);
  }, []);

  const handleDownload = async () => {
    if (isLoading) return;

    setIsLoading(true);
    onDownloadStart?.();

    try {
      logger.info('🚀 Starting download from DownloadButton', { 
        email, name, mbtiType, source 
      });

      const success = await appDownloadService.startDownload({
        email,
        name,
        mbtiType,
        source
      });

      if (success) {
        logger.info('✅ Download started successfully');
        onDownloadSuccess?.();
      } else {
        throw new Error('Download kon niet worden gestart');
      }

    } catch (error) {
      logger.error('❌ Download failed:', { error });
      const errorMessage = error instanceof Error ? error.message : 'Download mislukt';
      onDownloadError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return 'Downloaden...';
    }

    if (downloadOption) {
      switch (downloadOption.id) {
        case 'pwa':
          return '📱 App Installeren';
        case 'ios':
          return '📱 iOS App';
        case 'android':
          return '🤖 Android App';
        case 'web':
          return '💻 Web App';
        default:
          return '📱 App Downloaden';
      }
    }

    return children || '📱 App Downloaden';
  };

  const getButtonIcon = () => {
    if (downloadOption) {
      return downloadOption.icon;
    }
    return '📱';
  };

  return (
    <Button
      color={color}
      variant={variant}
      size={size}
      isLoading={isLoading}
      onClick={handleDownload}
      className={`${className} ${isLoading ? 'opacity-75' : ''}`}
      startContent={!isLoading ? getButtonIcon() : undefined}
    >
      {getButtonText()}
    </Button>
  );
};

export default DownloadButton;








