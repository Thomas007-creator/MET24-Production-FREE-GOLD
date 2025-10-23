
/**
 * VPN Pipeline Manager - MET2.4 V14
 * 
 * Integreert met bestaande VPN services (Tailscale/WireGuard)
 * Voegt VPN validatie toe aan alle sync operaties
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

export interface VPNConfig {
  enabled: boolean;
  required: boolean;
  checkInterval: number;
  timeout: number;
  tailscaleEnabled: boolean;
  wireguardEnabled: boolean;
}

export interface VPNStatus {
  isConnected: boolean;
  isSecure: boolean;
  lastCheck: Date;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
  vpnType: 'tailscale' | 'wireguard' | 'none';
  ipAddress?: string;
  serverLocation?: string;
}

export class VPNPipelineManager {
  private vpnConfig: VPNConfig;
  private supabase: any;
  private vpnStatus: VPNStatus;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(vpnConfig: VPNConfig, supabase: any) {
    this.vpnConfig = vpnConfig;
    this.supabase = supabase;
    this.vpnStatus = {
      isConnected: false,
      isSecure: false,
      lastCheck: new Date(),
      connectionQuality: 'unknown',
      vpnType: 'none'
    };
  }

  /**
   * Initialiseer VPN Pipeline
   */
  async initialize(): Promise<void> {
    if (!this.vpnConfig.enabled) {
      logger.info('🔓 VPN Pipeline disabled - proceeding without VPN validation');
      return;
    }

    try {
      logger.info('🔐 Initializing VPN Pipeline...');
      
      // Start VPN status monitoring
      await this.startVPNMonitoring();
      
      // Establish secure connection
      await this.establishSecureConnection();
      
      // Start periodic checks
      this.startPeriodicChecks();
      
      logger.info('✅ VPN Pipeline initialized successfully');
    } catch (error) {
      logger.error('❌ VPN Pipeline initialization failed:', { error });
      if (this.vpnConfig.required) {
        throw error;
      }
    }
  }

  /**
   * Start VPN monitoring
   */
  private async startVPNMonitoring(): Promise<void> {
    try {
      // Check existing VPN services
      const vpnStatus = await this.checkVPNStatus();
      this.vpnStatus = vpnStatus;
      
      if (!vpnStatus.isConnected && this.vpnConfig.required) {
        throw new Error('VPN connection required but not available');
      }
      
      if (!vpnStatus.isSecure && this.vpnConfig.required) {
        throw new Error('VPN connection not secure');
      }
      
      logger.info(`✅ VPN monitoring started - Type: ${vpnStatus.vpnType}, Quality: ${vpnStatus.connectionQuality}`);
    } catch (error) {
      logger.error('❌ VPN monitoring failed:', { error });
      throw error;
    }
  }

  /**
   * Check VPN status - integreert met bestaande VPN services
   */
  private async checkVPNStatus(): Promise<VPNStatus> {
    try {
      // Check Tailscale (prioriteit)
      if (this.vpnConfig.tailscaleEnabled) {
        const tailscaleStatus = await this.checkTailscaleStatus();
        if (tailscaleStatus.isConnected) {
          return tailscaleStatus;
        }
      }

      // Check WireGuard (fallback)
      if (this.vpnConfig.wireguardEnabled) {
        const wireguardStatus = await this.checkWireguardStatus();
        if (wireguardStatus.isConnected) {
          return wireguardStatus;
        }
      }

      // No VPN connected
      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'none'
      };
    } catch (error) {
      logger.error('VPN status check failed:', { error });
      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'none'
      };
    }
  }

  /**
   * Check Tailscale status - integreert met bestaande Tailscale setup
   */
  private async checkTailscaleStatus(): Promise<VPNStatus> {
    try {
      // Check if Tailscale container is running
      const isRunning = await this.checkContainerStatus('met24-tailscale');
      
      if (!isRunning) {
        return {
          isConnected: false,
          isSecure: false,
          lastCheck: new Date(),
          connectionQuality: 'unknown',
          vpnType: 'tailscale'
        };
      }

      // Check Tailscale status via API
      const response = await fetch('http://localhost:3001/api/vpn/tailscale-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isConnected: data.connected || false,
          isSecure: data.secure || false,
          lastCheck: new Date(),
          connectionQuality: data.quality || 'unknown',
          vpnType: 'tailscale',
          ipAddress: data.ipAddress,
          serverLocation: data.serverLocation
        };
      }

      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'tailscale'
      };
    } catch (error) {
      logger.error('Tailscale status check failed:', { error });
      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'tailscale'
      };
    }
  }

  /**
   * Check WireGuard status - integreert met bestaande WireGuard setup
   */
  private async checkWireguardStatus(): Promise<VPNStatus> {
    try {
      // Check if WireGuard container is running
      const isRunning = await this.checkContainerStatus('met24-vpn');
      
      if (!isRunning) {
        return {
          isConnected: false,
          isSecure: false,
          lastCheck: new Date(),
          connectionQuality: 'unknown',
          vpnType: 'wireguard'
        };
      }

      // Check WireGuard status via API
      const response = await fetch('http://localhost:3001/api/vpn/wireguard-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isConnected: data.connected || false,
          isSecure: data.secure || false,
          lastCheck: new Date(),
          connectionQuality: data.quality || 'unknown',
          vpnType: 'wireguard',
          ipAddress: data.ipAddress,
          serverLocation: data.serverLocation
        };
      }

      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'wireguard'
      };
    } catch (error) {
      logger.error('WireGuard status check failed:', { error });
      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'wireguard'
      };
    }
  }

  /**
   * Check container status
   */
  private async checkContainerStatus(containerName: string): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:3001/api/containers/${containerName}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.running || false;
      }

      return false;
    } catch (error) {
      logger.error(`Container status check failed for ${containerName}:`, { error });
      return false;
    }
  }

  /**
   * Establish secure connection to Supabase
   */
  private async establishSecureConnection(): Promise<void> {
    try {
      // Check VPN status before establishing connection
      if (this.vpnConfig.required && !this.vpnStatus.isConnected) {
        throw new Error('VPN connection required for secure connection');
      }

      // Test Supabase connection with VPN validation
      const { data, error } = await this.supabase
        .from('vpn_status')
        .select('*')
        .eq('user_id', this.getCurrentUserId())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(`Failed to establish secure connection: ${error.message}`);
      }

      logger.info('✅ Secure connection established');
    } catch (error) {
      logger.error('❌ Failed to establish secure connection:', { error });
      throw error;
    }
  }

  /**
   * Start periodic VPN checks
   */
  private startPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      try {
        const newStatus = await this.checkVPNStatus();
        this.vpnStatus = newStatus;
        
        // Log status changes
        if (newStatus.isConnected !== this.vpnStatus.isConnected) {
          logger.info(`VPN status changed: ${newStatus.isConnected ? 'Connected' : 'Disconnected'}`);
        }
      } catch (error) {
        logger.error('Periodic VPN check failed:', { error });
      }
    }, this.vpnConfig.checkInterval);
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string {
    // Get current user ID from authentication
    return 'current-user-id'; // Placeholder - implement based on your auth system
  }

  /**
   * Check if VPN is connected
   */
  async isVPNConnected(): Promise<boolean> {
    if (!this.vpnConfig.enabled) {
      return true; // VPN not required
    }

    return this.vpnStatus.isConnected;
  }

  /**
   * Check if VPN is secure
   */
  async isVPNSecure(): Promise<boolean> {
    if (!this.vpnConfig.enabled) {
      return true; // VPN not required
    }

    return this.vpnStatus.isSecure;
  }

  /**
   * Get VPN status
   */
  getVPNStatus(): VPNStatus {
    return { ...this.vpnStatus };
  }

  /**
   * Validate VPN before operation
   */
  async validateVPNForOperation(operation: string): Promise<void> {
    if (!this.vpnConfig.enabled) {
      return; // VPN not required
    }

    if (this.vpnConfig.required && !this.vpnStatus.isConnected) {
      throw new Error(`VPN connection required for ${operation}`);
    }

    if (this.vpnConfig.required && !this.vpnStatus.isSecure) {
      throw new Error(`VPN connection not secure for ${operation}`);
    }

    logger.info(`✅ VPN validation passed for ${operation}`);
  }

  /**
   * Shutdown VPN Pipeline
   */
  async shutdown(): Promise<void> {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    logger.info('🔓 VPN Pipeline shutdown');
  }
}

/**
 * Factory function voor VPNPipelineManager
 */
export function createVPNPipelineManager(
  config: Partial<VPNConfig> = {},
  supabase: any
): VPNPipelineManager {
  const defaultConfig: VPNConfig = {
    enabled: process.env.VPN_ENABLED === 'true',
    required: process.env.VPN_REQUIRED === 'true',
    checkInterval: parseInt(process.env.VPN_CHECK_INTERVAL || '30000'),
    timeout: parseInt(process.env.VPN_TIMEOUT || '10000'),
    tailscaleEnabled: process.env.TAILSCALE_ENABLED === 'true',
    wireguardEnabled: process.env.WIREGUARD_ENABLED === 'true',
    ...config
  };

  return new VPNPipelineManager(defaultConfig, supabase);
}
