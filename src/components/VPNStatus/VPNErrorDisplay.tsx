/**
 * VPN Error Display - BMAD Composition Patterns
 *
 * Discrete component voor VPN error state weergave
 * Toont error icon en foutmelding
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React from 'react';
import { VPNErrorProps } from './types';

// ================================================
// BMAD VPN Error Display Component
// ================================================

export const VPNErrorDisplay: React.FC<VPNErrorProps> = ({
  error,
  className = "flex items-center space-x-2"
}) => {
  return (
    <div className={className}>
      <span className="text-red-500">⚠️</span>
      <span className="text-sm text-red-500">VPN Error: {error}</span>
    </div>
  );
};

export default VPNErrorDisplay;