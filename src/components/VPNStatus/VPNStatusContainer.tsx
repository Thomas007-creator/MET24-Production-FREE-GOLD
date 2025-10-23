/**
 * VPN Status Container - BMAD Composition Patterns
 *
 * Container component voor VPN status state management
 * Beheert loading en error states voor child components
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React from 'react';
import { VPNStatusContainerProps } from './types';
import { useVPNStatus } from './VPNStatusProvider';
import VPNLoadingIndicator from './VPNLoadingIndicator';
import VPNErrorDisplay from './VPNErrorDisplay';

// ================================================
// BMAD VPN Status Container Component
// ================================================

export const VPNStatusContainer: React.FC<VPNStatusContainerProps> = ({
  children,
  className = ""
}) => {
  const { isLoading, error } = useVPNStatus();

  if (isLoading) {
    return <VPNLoadingIndicator className={className} />;
  }

  if (error) {
    return <VPNErrorDisplay error={error} className={className} />;
  }

  return <>{children}</>;
};

export default VPNStatusContainer;