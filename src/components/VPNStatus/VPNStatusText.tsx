/**
 * VPN Status Text - BMAD Composition Patterns
 *
 * Discrete component voor VPN status tekst weergave
 * Toont connection status en VPN type informatie
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React from 'react';
import { VPNStatusTextProps } from './types';

// ================================================
// BMAD VPN Status Text Component
// ================================================

export const VPNStatusText: React.FC<VPNStatusTextProps> = ({
  status,
  className = "text-sm font-medium"
}) => {
  const getStatusText = (status: VPNStatusTextProps['status']): string => {
    if (!status) return 'Unknown';

    if (status.isConnected && status.isSecure) {
      return `${status.vpnType.toUpperCase()} - ${status.connectionQuality}`;
    }

    return 'Disconnected';
  };

  const getStatusColor = (status: VPNStatusTextProps['status']): string => {
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
      {getStatusText(status)}
    </span>
  );
};

export default VPNStatusText;