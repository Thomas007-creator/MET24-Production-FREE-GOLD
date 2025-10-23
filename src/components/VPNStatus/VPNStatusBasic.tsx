/**
 * VPN Status Basic - BMAD Composition Patterns
 *
 * Composition component voor basic VPN status weergave
 * Combineert icon en tekst voor eenvoudige status display
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React from 'react';
import { VPNStatusBasicProps } from './types';
import { useVPNStatus } from './VPNStatusProvider';
import VPNStatusIcon from './VPNStatusIcon';
import VPNStatusText from './VPNStatusText';

// ================================================
// BMAD VPN Status Basic Component
// ================================================

export const VPNStatusBasic: React.FC<VPNStatusBasicProps> = ({
  className = "flex items-center space-x-2"
}) => {
  const { vpnStatus } = useVPNStatus();

  return (
    <div className={className}>
      <VPNStatusIcon status={vpnStatus} />
      <VPNStatusText status={vpnStatus} />
    </div>
  );
};

export default VPNStatusBasic;