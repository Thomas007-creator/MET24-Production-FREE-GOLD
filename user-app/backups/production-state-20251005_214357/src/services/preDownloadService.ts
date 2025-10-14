/**
 * Pre-Download Service
 * 
 * Beheert pre-download user data voor your-future-self.app
 * Minimale privacy variabelen: naam, email, MBTI type
 * 
 * @version 1.0.0
 * @author Thomas
 */

import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface PreDownloadUser {
  id: string;
  email: string;
  name: string;
  mbtiType: string;
  downloadRequestedAt: string;
  appDownloadedAt?: string;
  hubspotContactId?: string;
  consentGiven: boolean;
  consentTimestamp?: string;
  status: 'pending' | 'downloaded' | 'active';
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface MBTIDistribution {
  mbtiType: string;
  count: number;
  percentage: number;
}

export interface PreDownloadAnalytics {
  date: string;
  totalRequests: number;
  consentGiven: number;
  downloads: number;
  activeUsers: number;
  conversionRate: number;
}

export class PreDownloadService {
  private static instance: PreDownloadService;

  public static getInstance(): PreDownloadService {
    if (!PreDownloadService.instance) {
      PreDownloadService.instance = new PreDownloadService();
    }
    return PreDownloadService.instance;
  }

  /**
   * Maak een nieuwe pre-download user aan
   */
  async createPreDownloadUser(
    email: string,
    name: string,
    mbtiType: string,
    consentGiven: boolean = true
  ): Promise<string> {
    try {
      logger.info('🚀 Creating pre-download user', { email, name, mbtiType });

      const { data, error } = await supabase.rpc('create_pre_download_user', {
        p_email: email,
        p_name: name,
        p_mbti_type: mbtiType,
        p_consent_given: consentGiven
      });

      if (error) {
        logger.error('❌ Error creating pre-download user:', { error });
        throw new Error(`Failed to create pre-download user: ${error.message}`);
      }

      logger.info('✅ Pre-download user created successfully', { userId: data });
      return data;

    } catch (error) {
      logger.error('❌ PreDownloadService.createPreDownloadUser error:', { error });
      throw error;
    }
  }

  /**
   * Update download status wanneer app wordt gedownload
   */
  async updateDownloadStatus(
    email: string,
    hubspotContactId?: string
  ): Promise<boolean> {
    try {
      logger.info('📱 Updating download status', { email, hubspotContactId });

      const { data, error } = await supabase.rpc('update_download_status', {
        p_email: email,
        p_hubspot_contact_id: hubspotContactId
      });

      if (error) {
        logger.error('❌ Error updating download status:', { error });
        throw new Error(`Failed to update download status: ${error.message}`);
      }

      logger.info('✅ Download status updated successfully', { success: data });
      return data;

    } catch (error) {
      logger.error('❌ PreDownloadService.updateDownloadStatus error:', { error });
      throw error;
    }
  }

  /**
   * Haal MBTI distributie op
   */
  async getMBTIDistribution(): Promise<MBTIDistribution[]> {
    try {
      logger.info('📊 Fetching MBTI distribution');

      const { data, error } = await supabase.rpc('get_mbti_distribution');

      if (error) {
        logger.error('❌ Error fetching MBTI distribution:', { error });
        throw new Error(`Failed to fetch MBTI distribution: ${error.message}`);
      }

      logger.info('✅ MBTI distribution fetched successfully', { count: data?.length });
      return data || [];

    } catch (error) {
      logger.error('❌ PreDownloadService.getMBTIDistribution error:', { error });
      throw error;
    }
  }

  /**
   * Haal pre-download analytics op
   */
  async getPreDownloadAnalytics(): Promise<PreDownloadAnalytics[]> {
    try {
      logger.info('📈 Fetching pre-download analytics');

      const { data, error } = await supabase
        .from('pre_download_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30); // Laatste 30 dagen

      if (error) {
        logger.error('❌ Error fetching pre-download analytics:', { error });
        throw new Error(`Failed to fetch analytics: ${error.message}`);
      }

      logger.info('✅ Pre-download analytics fetched successfully', { count: data?.length });
      return data || [];

    } catch (error) {
      logger.error('❌ PreDownloadService.getPreDownloadAnalytics error:', { error });
      throw error;
    }
  }

  /**
   * Haal MBTI insights op
   */
  async getMBTIInsights(): Promise<any[]> {
    try {
      logger.info('🔍 Fetching MBTI insights');

      const { data, error } = await supabase
        .from('mbti_insights')
        .select('*')
        .order('total_users', { ascending: false });

      if (error) {
        logger.error('❌ Error fetching MBTI insights:', { error });
        throw new Error(`Failed to fetch MBTI insights: ${error.message}`);
      }

      logger.info('✅ MBTI insights fetched successfully', { count: data?.length });
      return data || [];

    } catch (error) {
      logger.error('❌ PreDownloadService.getMBTIInsights error:', { error });
      throw error;
    }
  }

  /**
   * Zoek pre-download user op email
   */
  async getPreDownloadUserByEmail(email: string): Promise<PreDownloadUser | null> {
    try {
      logger.info('🔍 Searching pre-download user by email', { email });

      const { data, error } = await supabase
        .from('pre_download_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          logger.info('ℹ️ No pre-download user found for email', { email });
          return null;
        }
        logger.error('❌ Error searching pre-download user:', { error });
        throw new Error(`Failed to search pre-download user: ${error.message}`);
      }

      logger.info('✅ Pre-download user found', { userId: data.id });
      return data;

    } catch (error) {
      logger.error('❌ PreDownloadService.getPreDownloadUserByEmail error:', { error });
      throw error;
    }
  }

  /**
   * Valideer email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valideer MBTI type
   */
  validateMBTIType(mbtiType: string): boolean {
    const validTypes = [
      'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ];
    return validTypes.includes(mbtiType.toUpperCase());
  }

  /**
   * Valideer naam
   */
  validateName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 100;
  }

  /**
   * Valideer alle form data
   */
  validateFormData(email: string, name: string, mbtiType: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!this.validateEmail(email)) {
      errors.push('Ongeldig email adres');
    }

    if (!this.validateName(name)) {
      errors.push('Naam moet tussen 2 en 100 karakters zijn');
    }

    if (!this.validateMBTIType(mbtiType)) {
      errors.push('Ongeldig MBTI type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Export data voor HubSpot integratie
   */
  async exportDataForHubSpot(): Promise<PreDownloadUser[]> {
    try {
      logger.info('📤 Exporting data for HubSpot integration');

      const { data, error } = await supabase
        .from('pre_download_users')
        .select('*')
        .eq('consent_given', true)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('❌ Error exporting data for HubSpot:', { error });
        throw new Error(`Failed to export data: ${error.message}`);
      }

      logger.info('✅ Data exported for HubSpot successfully', { count: data?.length });
      return data || [];

    } catch (error) {
      logger.error('❌ PreDownloadService.exportDataForHubSpot error:', { error });
      throw error;
    }
  }
}

// Export singleton instance
export const preDownloadService = PreDownloadService.getInstance();








