/**
 * VPN Status Details - BMAD Composition Patterns
 *
 * Discrete component voor gedetailleerde VPN status informatie
 * Toont IP adres, server locatie en laatste check tijd
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React from 'react';
import { VPNStatusDetailsProps } from './types';

// ================================================
// BMAD VPN Status Details Component
// ================================================

export const VPNStatusDetails: React.FC<VPNStatusDetailsProps> = ({
  status,
  className = "text-xs text-gray-500"
}) => {
  if (!status) return null;

  return (
    <div className={className}>
      {status.ipAddress && (
        <div>IP: {status.ipAddress}</div>
      )}
      {status.serverLocation && (
        <div>Server: {status.serverLocation}</div>
      )}
      <div>Last check: {status.lastCheck.toLocaleTimeString()}</div>
    </div>
  );
};

export default VPNStatusDetails;