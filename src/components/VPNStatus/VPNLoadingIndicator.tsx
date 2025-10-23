/**
 * VPN Loading Indicator - BMAD Composition Patterns
 *
 * Discrete component voor VPN loading state weergave
 * Toont spinner en loading tekst tijdens status checks
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React from 'react';
import { VPNLoadingProps } from './types';

// ================================================
// BMAD VPN Loading Indicator Component
// ================================================

export const VPNLoadingIndicator: React.FC<VPNLoadingProps> = ({
  className = "flex items-center space-x-2"
}) => {
  return (
    <div className={className}>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      <span className="text-sm text-gray-500">Checking VPN...</span>
    </div>
  );
};

export default VPNLoadingIndicator;