/**
 * VPN Status Indicator - BMAD Composition Patterns
 *
 * Main orchestrator component voor VPN status weergave
 * Composeert alle providers en componenten volgens BMAD patterns
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React from 'react';
import { VPNStatusIndicatorProps } from './types';
import { VPNStatusProvider } from './VPNStatusProvider';
import { VPNConnectionProvider } from './VPNConnectionProvider';
import VPNStatusContainer from './VPNStatusContainer';
import VPNStatusBasic from './VPNStatusBasic';
import VPNStatusDetailed from './VPNStatusDetailed';
import VPNStatusIcon from './VPNStatusIcon';
import VPNStatusText from './VPNStatusText';
import VPNStatusDetails from './VPNStatusDetails';
import VPNLoadingIndicator from './VPNLoadingIndicator';
import VPNErrorDisplay from './VPNErrorDisplay';
import { useVPNStatus } from './VPNStatusProvider';
import { useVPNConnection } from './VPNConnectionProvider';

// ================================================
// BMAD Main VPN Status Indicator Component
// ================================================

export const VPNStatusIndicator: React.FC<VPNStatusIndicatorProps> = ({
  vpnManager,
  variant = 'basic',
  className = ''
}) => {
  return (
    <VPNStatusProvider vpnManager={vpnManager}>
      <VPNConnectionProvider vpnManager={vpnManager}>
        <VPNStatusContainer className={className}>
          {variant === 'detailed' ? (
            <VPNStatusDetailed />
          ) : (
            <VPNStatusBasic />
          )}
        </VPNStatusContainer>
      </VPNConnectionProvider>
    </VPNStatusProvider>
  );
};

// ================================================
// BMAD Compound Components Export
// ================================================

export const VPNStatus = {
  Provider: VPNStatusProvider,
  ConnectionProvider: VPNConnectionProvider,
  Indicator: VPNStatusIndicator,
  Basic: VPNStatusBasic,
  Detailed: VPNStatusDetailed,
  Icon: VPNStatusIcon,
  Text: VPNStatusText,
  Details: VPNStatusDetails,
  Loading: VPNLoadingIndicator,
  Error: VPNErrorDisplay,
  Container: VPNStatusContainer,
  useStatus: useVPNStatus,
  useConnection: useVPNConnection
};

export default VPNStatusIndicator;