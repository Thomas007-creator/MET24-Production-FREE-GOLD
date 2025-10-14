/**
 * HubSpot Link Service
 * 
 * Koppeling tussen HubSpot en Supabase MET2.4.2
 * Minimale privacy variabelen: naam, email, MBTI type
 * 
 * @version 1.0.0
 * @author Thomas
 */

import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface HubSpotUser {
  id: string;
  email: string;
  name: string;
  mbtiType: string;
  hubspotContactId?: string;
  status: 'active' | 'inactive';
  syncStatus: 'pending' | 'synced' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface MBTIDistribution {
  mbtiType: string;
  count: number;
  percentage: number;
}

export class HubSpotLinkService {
  private static instance: HubSpotLinkService;

  public static getInstance(): HubSpotLinkService {
    if (!HubSpotLinkService.instance) {
      HubSpotLinkService.instance = new HubSpotLinkService();
    }
    return HubSpotLinkService.instance;
  }

  /**
   * Maak/update HubSpot user in Supabase
   */
  async upsertHubSpotUser(
    email: string,
    name: string,
    mbtiType: string,
    hubspotContactId?: string
  ): Promise<string> {
    try {
      logger.info('🔗 Upserting HubSpot user', { email, name, mbtiType, hubspotContactId });

      const { data, error } = await supabase.rpc('upsert_hubspot_user', {
        p_email: email,
        p_name: name,
        p_mbti_type: mbtiType,
        p_hubspot_contact_id: hubspotContactId
      });

      if (error) {
        logger.error('❌ Error upserting HubSpot user:', { error });
        throw new Error(`Failed to upsert HubSpot user: ${error.message}`);
      }

      logger.info('✅ HubSpot user upserted successfully', { userId: data });
      return data;

    } catch (error) {
      logger.error('❌ HubSpotLinkService.upsertHubSpotUser error:', { error });
      throw error;
    }
  }

  /**
   * Haal HubSpot user op via email
   */
  async getHubSpotUserByEmail(email: string): Promise<HubSpotUser | null> {
    try {
      logger.info('🔍 Getting HubSpot user by email', { email });

      const { data, error } = await supabase.rpc('get_hubspot_user_by_email', {
        p_email: email
      });

      if (error) {
        logger.error('❌ Error getting HubSpot user:', { error });
        throw new Error(`Failed to get HubSpot user: ${error.message}`);
      }

      if (!data || data.length === 0) {
        logger.info('ℹ️ No HubSpot user found for email', { email });
        return null;
      }

      const user = data[0];
      logger.info('✅ HubSpot user found', { userId: user.id });
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        mbtiType: user.mbti_type,
        hubspotContactId: user.hubspot_contact_id,
        status: user.status,
        syncStatus: user.sync_status,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };

    } catch (error) {
      logger.error('❌ HubSpotLinkService.getHubSpotUserByEmail error:', { error });
      throw error;
    }
  }

  /**
   * Haal MBTI distributie op
   */
  async getMBTIDistribution(): Promise<MBTIDistribution[]> {
    try {
      logger.info('📊 Fetching MBTI distribution from HubSpot data');

      const { data, error } = await supabase.rpc('get_hubspot_mbti_distribution');

      if (error) {
        logger.error('❌ Error fetching MBTI distribution:', { error });
        throw new Error(`Failed to fetch MBTI distribution: ${error.message}`);
      }

      logger.info('✅ MBTI distribution fetched successfully', { count: data?.length });
      return data || [];

    } catch (error) {
      logger.error('❌ HubSpotLinkService.getMBTIDistribution error:', { error });
      throw error;
    }
  }

  /**
   * Haal HubSpot analytics op
   */
  async getHubSpotAnalytics(): Promise<any[]> {
    try {
      logger.info('📈 Fetching HubSpot analytics');

      const { data, error } = await supabase
        .from('hubspot_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30); // Laatste 30 dagen

      if (error) {
        logger.error('❌ Error fetching HubSpot analytics:', { error });
        throw new Error(`Failed to fetch analytics: ${error.message}`);
      }

      logger.info('✅ HubSpot analytics fetched successfully', { count: data?.length });
      return data || [];

    } catch (error) {
      logger.error('❌ HubSpotLinkService.getHubSpotAnalytics error:', { error });
      throw error;
    }
  }

  /**
   * Haal MBTI insights op
   */
  async getMBTIInsights(): Promise<any[]> {
    try {
      logger.info('🔍 Fetching MBTI insights from HubSpot data');

      const { data, error } = await supabase
        .from('hubspot_mbti_insights')
        .select('*')
        .order('total_users', { ascending: false });

      if (error) {
        logger.error('❌ Error fetching MBTI insights:', { error });
        throw new Error(`Failed to fetch MBTI insights: ${error.message}`);
      }

      logger.info('✅ MBTI insights fetched successfully', { count: data?.length });
      return data || [];

    } catch (error) {
      logger.error('❌ HubSpotLinkService.getMBTIInsights error:', { error });
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
  async exportDataForHubSpot(): Promise<HubSpotUser[]> {
    try {
      logger.info('📤 Exporting data for HubSpot integration');

      const { data, error } = await supabase
        .from('hubspot_users')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('❌ Error exporting data for HubSpot:', { error });
        throw new Error(`Failed to export data: ${error.message}`);
      }

      logger.info('✅ Data exported for HubSpot successfully', { count: data?.length });
      return data || [];

    } catch (error) {
      logger.error('❌ HubSpotLinkService.exportDataForHubSpot error:', { error });
      throw error;
    }
  }

  /**
   * Test de koppeling
   */
  async testConnection(): Promise<boolean> {
    try {
      logger.info('🧪 Testing HubSpot-Supabase connection');

      // Test met dummy data
      const testEmail = 'test@example.com';
      const testName = 'Test User';
      const testMBTI = 'INTJ';

      // Probeer een test user aan te maken
      await this.upsertHubSpotUser(testEmail, testName, testMBTI);

      // Probeer de user op te halen
      const user = await this.getHubSpotUserByEmail(testEmail);

      if (user) {
        logger.info('✅ HubSpot-Supabase connection test successful');
        return true;
      } else {
        logger.error('❌ HubSpot-Supabase connection test failed: User not found');
        return false;
      }

    } catch (error) {
      logger.error('❌ HubSpot-Supabase connection test failed:', { error });
      return false;
    }
  }
}

// Export singleton instance
export const hubspotLinkService = HubSpotLinkService.getInstance();








