/**
 * App Download Service
 * 
 * Beheert app downloads voor verschillende platforms
 * Koppeling met HubSpot pre-download data
 * 
 * @version 1.0.0
 * @author Thomas
 */

import { logger } from '../utils/logger';
import { hubspotLinkService } from './hubspotLinkService';

export interface DownloadPlatform {
  id: string;
  name: string;
  icon: string;
  url: string;
  available: boolean;
  size?: string;
  description: string;
}

export interface DownloadOptions {
  email?: string;
  name?: string;
  mbtiType?: string;
  platform?: string;
  source?: string;
}

export class AppDownloadService {
  private static instance: AppDownloadService;

  public static getInstance(): AppDownloadService {
    if (!AppDownloadService.instance) {
      AppDownloadService.instance = new AppDownloadService();
    }
    return AppDownloadService.instance;
  }

  /**
   * Beschikbare download platforms
   */
  getAvailablePlatforms(): DownloadPlatform[] {
    return [
      {
        id: 'pwa',
        name: 'Web App (PWA)',
        icon: '🌐',
        url: '/install-pwa',
        available: true,
        size: '~55MB',
        description: 'Installeer als web app op je telefoon of computer'
      },
      {
        id: 'ios',
        name: 'iOS App',
        icon: '📱',
        url: 'https://apps.apple.com/app/your-future-self/id123456789',
        available: false, // Nog niet beschikbaar
        size: '~55MB',
        description: 'Download voor iPhone en iPad'
      },
      {
        id: 'android',
        name: 'Android App',
        icon: '🤖',
        url: 'https://play.google.com/store/apps/details?id=com.yourfutureself.app',
        available: false, // Nog niet beschikbaar
        size: '~55MB',
        description: 'Download voor Android telefoons en tablets'
      },
      {
        id: 'web',
        name: 'Web Versie',
        icon: '💻',
        url: 'https://www.your-future-self.app',
        available: true,
        size: '~55MB',
        description: 'Gebruik direct in je browser'
      }
    ];
  }

  /**
   * Detecteer het platform van de gebruiker
   */
  detectPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else if (/windows|mac|linux/.test(userAgent)) {
      return 'web';
    } else {
      return 'pwa';
    }
  }

  /**
   * Krijg de beste download optie voor het huidige platform
   */
  getBestDownloadOption(): DownloadPlatform {
    const platform = this.detectPlatform();
    const platforms = this.getAvailablePlatforms();
    
    // Probeer eerst platform-specifieke app
    let bestOption = platforms.find(p => p.id === platform && p.available);
    
    // Fallback naar PWA als platform-specifieke app niet beschikbaar is
    if (!bestOption) {
      bestOption = platforms.find(p => p.id === 'pwa' && p.available);
    }
    
    // Fallback naar web versie
    if (!bestOption) {
      bestOption = platforms.find(p => p.id === 'web' && p.available);
    }
    
    return bestOption || platforms[0];
  }

  /**
   * Start download proces
   */
  async startDownload(options: DownloadOptions = {}): Promise<boolean> {
    try {
      logger.info('🚀 Starting app download', { options });

      // Log download event
      await this.logDownloadEvent(options);

      // Krijg beste download optie
      const downloadOption = this.getBestDownloadOption();
      
      if (!downloadOption.available) {
        throw new Error(`Download niet beschikbaar voor ${downloadOption.name}`);
      }

      // Start download op basis van platform
      switch (downloadOption.id) {
        case 'pwa':
          return await this.installPWA(options);
        case 'ios':
          return await this.downloadIOS(options);
        case 'android':
          return await this.downloadAndroid(options);
        case 'web':
          return await this.openWebVersion(options);
        default:
          throw new Error(`Onbekend platform: ${downloadOption.id}`);
      }

    } catch (error) {
      logger.error('❌ Download failed:', { error });
      throw error;
    }
  }

  /**
   * Installeer PWA
   */
  private async installPWA(options: DownloadOptions): Promise<boolean> {
    try {
      logger.info('📱 Installing PWA', { options });

      // Check of PWA installatie wordt ondersteund
      if (!('serviceWorker' in navigator)) {
        throw new Error('PWA installatie niet ondersteund in deze browser');
      }

      // Trigger PWA install prompt
      const installPrompt = await this.getInstallPrompt();
      
      if (installPrompt) {
        installPrompt.prompt();
        const result = await installPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
          logger.info('✅ PWA installatie geaccepteerd');
          return true;
        } else {
          logger.info('❌ PWA installatie geweigerd');
          return false;
        }
      } else {
        // Fallback: redirect naar web versie
        window.location.href = '/';
        return true;
      }

    } catch (error) {
      logger.error('❌ PWA installatie failed:', { error });
      throw error;
    }
  }

  /**
   * Krijg PWA install prompt
   */
  private async getInstallPrompt(): Promise<any> {
    return new Promise((resolve) => {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        resolve(e);
      });
      
      // Timeout na 1 seconde
      setTimeout(() => resolve(null), 1000);
    });
  }

  /**
   * Download iOS app
   */
  private async downloadIOS(options: DownloadOptions): Promise<boolean> {
    try {
      logger.info('📱 Downloading iOS app', { options });
      
      // Redirect naar App Store
      window.open('https://apps.apple.com/app/your-future-self/id123456789', '_blank');
      return true;

    } catch (error) {
      logger.error('❌ iOS download failed:', { error });
      throw error;
    }
  }

  /**
   * Download Android app
   */
  private async downloadAndroid(options: DownloadOptions): Promise<boolean> {
    try {
      logger.info('🤖 Downloading Android app', { options });
      
      // Redirect naar Play Store
      window.open('https://play.google.com/store/apps/details?id=com.yourfutureself.app', '_blank');
      return true;

    } catch (error) {
      logger.error('❌ Android download failed:', { error });
      throw error;
    }
  }

  /**
   * Open web versie
   */
  private async openWebVersion(options: DownloadOptions): Promise<boolean> {
    try {
      logger.info('💻 Opening web version', { options });
      
      // Redirect naar web versie
      window.location.href = 'https://www.your-future-self.app';
      return true;

    } catch (error) {
      logger.error('❌ Web version failed:', { error });
      throw error;
    }
  }

  /**
   * Log download event
   */
  private async logDownloadEvent(options: DownloadOptions): Promise<void> {
    try {
      // Log naar HubSpot als email beschikbaar is
      if (options.email && options.name && options.mbtiType) {
        await hubspotLinkService.upsertHubSpotUser(
          options.email,
          options.name,
          options.mbtiType
        );
      }

      // Log analytics event
      logger.info('📊 Download event logged', {
        platform: options.platform || this.detectPlatform(),
        source: options.source || 'hubspot',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('❌ Failed to log download event:', { error });
      // Don't throw - logging failure shouldn't break download
    }
  }

  /**
   * Krijg download statistieken
   */
  async getDownloadStats(): Promise<any> {
    try {
      logger.info('📊 Getting download statistics');

      // Haal MBTI distributie op
      const mbtiDistribution = await hubspotLinkService.getMBTIDistribution();
      
      // Haal analytics op
      const analytics = await hubspotLinkService.getHubSpotAnalytics();

      return {
        mbtiDistribution,
        analytics,
        totalDownloads: mbtiDistribution.reduce((sum, item) => sum + item.count, 0),
        platforms: this.getAvailablePlatforms()
      };

    } catch (error) {
      logger.error('❌ Failed to get download stats:', { error });
      throw error;
    }
  }

  /**
   * Valideer download opties
   */
  validateDownloadOptions(options: DownloadOptions): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (options.email && !hubspotLinkService.validateEmail(options.email)) {
      errors.push('Ongeldig email adres');
    }

    if (options.name && !hubspotLinkService.validateName(options.name)) {
      errors.push('Ongeldig naam');
    }

    if (options.mbtiType && !hubspotLinkService.validateMBTIType(options.mbtiType)) {
      errors.push('Ongeldig MBTI type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const appDownloadService = AppDownloadService.getInstance();








