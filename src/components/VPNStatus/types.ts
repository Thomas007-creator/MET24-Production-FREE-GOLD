/**
 * VPN Status Types - BMAD Composition Patterns
 *
 * Shared TypeScript interfaces for VPN status management
 * Following BMAD composition patterns for clean architecture
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

export interface VPNStatus {
  isConnected: boolean;
  isSecure: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
  vpnType: 'tailscale' | 'wireguard' | 'none';
  ipAddress?: string;
  serverLocation?: string;
  lastCheck: Date;
}

export interface VPNStatusHookState {
  status: VPNStatus | null;
  isLoading: boolean;
  error: string | null;
}

// ================================================
// BMAD Context Types
// ================================================

export interface VPNStatusContextType {
  vpnStatus: VPNStatus | null;
  isLoading: boolean;
  error: string | null;
  updateStatus: () => Promise<void>;
}

export interface VPNConnectionContextType {
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
  vpnType: 'tailscale' | 'wireguard' | 'none';
  reconnect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

// ================================================
// BMAD Component Props Types
// ================================================

export interface VPNStatusIconProps {
  status: VPNStatus | null;
  className?: string;
}

export interface VPNStatusTextProps {
  status: VPNStatus | null;
  className?: string;
}

export interface VPNStatusDetailsProps {
  status: VPNStatus | null;
  className?: string;
}

export interface VPNLoadingProps {
  className?: string;
}

export interface VPNErrorProps {
  error: string;
  className?: string;
}

export interface VPNStatusBasicProps {
  className?: string;
}

export interface VPNStatusDetailedProps {
  className?: string;
}

export interface VPNStatusContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface VPNStatusProviderProps {
  children: React.ReactNode;
  vpnManager: any; // VPNPipelineManager type
}

export interface VPNConnectionProviderProps {
  children: React.ReactNode;
  vpnManager: any; // VPNPipelineManager type
}

export interface VPNStatusIndicatorProps {
  vpnManager: any; // VPNPipelineManager type
  variant?: 'basic' | 'detailed';
  className?: string;
}