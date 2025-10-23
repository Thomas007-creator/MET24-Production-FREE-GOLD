
/**
 * VPN Protected Pre-Seed Service - MET2.4.4
 * 
 * VPN-beschermde pre-seed service
 * Integreert pre-seeds met VPN Pipeline
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { PreSeedService } from './preSeedService';
import { VPNPipelineManager } from './vpnPipelineManager';
import { logger } from '../utils/logger';

interface VPNProtectedPreSeedConfig {
  enabled: boolean;
  required: boolean;
  vpnProtected: boolean;
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
}

export class VPNProtectedPreSeedService extends PreSeedService {
  private vpnPipelineManager: VPNPipelineManager;
  private isVPNProtected: boolean = false;

  constructor(
    config: Partial<VPNProtectedPreSeedConfig> = {},
    vpnManager: VPNPipelineManager,
    supabase: any,
    database: any
  ) {
    super(config, vpnManager, supabase, database);
    this.vpnPipelineManager = vpnManager;
  }

  /**
   * Initialize VPN-protected pre-seed service
   */
  async initialize(): Promise<void> {
    try {
      logger.info('🔐 Initializing VPN Protected Pre-Seed Service...');

      // Validate VPN connection
      await this.vpnPipelineManager.validateVPNForOperation('preseed_initialization');
      
      // Initialize base pre-seed service
      await super.initialize();
      
      this.isVPNProtected = true;
      logger.info('✅ VPN Protected Pre-Seed Service initialized successfully');
    } catch (error) {
      logger.error('❌ VPN Protected Pre-Seed Service initialization failed:', { error });
      throw error;
    }
  }

  /**
   * VPN-protected MBTI content seeding
   */
  async seedMBTIContent(mbtiType: string): Promise<void> {
    try {
      // Validate VPN connection
      await this.vpnPipelineManager.validateVPNForOperation(`preseed_mbti_${mbtiType}`);
      
      // Call parent method
      await super.seedMBTIContent(mbtiType);
      
      logger.info(`✅ VPN-protected MBTI content seeded for ${mbtiType}`);
    } catch (error) {
      logger.error(`❌ VPN-protected MBTI content seeding failed for ${mbtiType}:`, { error });
      throw error;
    }
  }

  /**
   * VPN-protected media files seeding
   */
  async seedMediaFiles(mbtiType: string): Promise<void> {
    try {
      // Validate VPN connection
      await this.vpnPipelineManager.validateVPNForOperation(`preseed_media_${mbtiType}`);
      
      // Call parent method
      await super.seedMediaFiles(mbtiType);
      
      logger.info(`✅ VPN-protected media files seeded for ${mbtiType}`);
    } catch (error) {
      logger.error(`❌ VPN-protected media files seeding failed for ${mbtiType}:`, { error });
      throw error;
    }
  }

  /**
   * VPN-protected AI training data seeding
   */
  async seedAITrainingData(mbtiType: string): Promise<void> {
    try {
      // Validate VPN connection
      await this.vpnPipelineManager.validateVPNForOperation(`preseed_ai_${mbtiType}`);
      
      // Call parent method
      await super.seedAITrainingData(mbtiType);
      
      logger.info(`✅ VPN-protected AI training data seeded for ${mbtiType}`);
    } catch (error) {
      logger.error(`❌ VPN-protected AI training data seeding failed for ${mbtiType}:`, { error });
      throw error;
    }
  }

  /**
   * VPN-protected vector embeddings seeding
   */
  async seedVectorEmbeddings(mbtiType: string): Promise<void> {
    try {
      // Validate VPN connection
      await this.vpnPipelineManager.validateVPNForOperation(`preseed_vectors_${mbtiType}`);
      
      // Call parent method
      await super.seedVectorEmbeddings(mbtiType);
      
      logger.info(`✅ VPN-protected vector embeddings seeded for ${mbtiType}`);
    } catch (error) {
      logger.error(`❌ VPN-protected vector embeddings seeding failed for ${mbtiType}:`, { error });
      throw error;
    }
  }

  /**
   * Get VPN protection status
   */
  getVPNProtectionStatus(): boolean {
    return this.isVPNProtected;
  }

  /**
   * Get VPN status
   */
  getVPNStatus(): any {
    return this.vpnPipelineManager.getVPNStatus();
  }
}

// Factory function
export function createVPNProtectedPreSeedService(
  config: Partial<VPNProtectedPreSeedConfig> = {},
  vpnManager: VPNPipelineManager,
  supabase: any,
  database: any
): VPNProtectedPreSeedService {
  return new VPNProtectedPreSeedService(config, vpnManager, supabase, database);
}

export default VPNProtectedPreSeedService;
