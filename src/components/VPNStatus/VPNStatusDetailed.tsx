/**
 * VPN Status Detailed - BMAD Composition Patterns
 *
 * Composition component voor gedetailleerde VPN status weergave
 * Combineert icon, tekst en details voor uitgebreide status display
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React from 'react';
import { VPNStatusDetailedProps } from './types';
import { useVPNStatus } from './VPNStatusProvider';
import VPNStatusIcon from './VPNStatusIcon';
import VPNStatusText from './VPNStatusText';
import VPNStatusDetails from './VPNStatusDetails';

// ================================================
// BMAD VPN Status Detailed Component
// ================================================

export const VPNStatusDetailed: React.FC<VPNStatusDetailedProps> = ({
  className = "flex items-center space-x-2"
}) => {
  const { vpnStatus } = useVPNStatus();

  return (
    <div className={className}>
      <VPNStatusIcon status={vpnStatus} />
      <div className="flex flex-col">
        <VPNStatusText status={vpnStatus} />
        <VPNStatusDetails status={vpnStatus} />
      </div>
    </div>
  );
};

export default VPNStatusDetailed;