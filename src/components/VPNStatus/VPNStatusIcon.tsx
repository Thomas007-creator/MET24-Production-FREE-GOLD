/**
 * VPN Status Icon - BMAD Composition Patterns
 *
 * Discrete component voor VPN status icon weergave
 * Toont verschillende icons gebaseerd op connection status en kwaliteit
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React from 'react';
import { VPNStatusIconProps } from './types';

// ================================================
// BMAD VPN Status Icon Component
// ================================================

export const VPNStatusIcon: React.FC<VPNStatusIconProps> = ({
  status,
  className = "text-lg"
}) => {
  const getStatusIcon = (status: VPNStatusIconProps['status']): string => {
    if (!status) return '🔓';

    if (status.isConnected && status.isSecure) {
      switch (status.connectionQuality) {
        case 'excellent': return '🔐';
        case 'good': return '🔒';
        case 'poor': return '🔓';
        default: return '🔓';
      }
    }

    return '🔓';
  };

  const getStatusColor = (status: VPNStatusIconProps['status']): string => {
    if (!status) return 'text-gray-500';

    if (status.isConnected && status.isSecure) {
      switch (status.connectionQuality) {
        case 'excellent': return 'text-green-500';
        case 'good': return 'text-blue-500';
        case 'poor': return 'text-yellow-500';
        default: return 'text-gray-500';
      }
    }

    return 'text-red-500';
  };

  return (
    <span className={`${className} ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
    </span>
  );
};

export default VPNStatusIcon;