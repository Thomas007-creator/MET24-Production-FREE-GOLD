import { logger } from '../utils/logger';

export interface PWAInstallContext {
  isOnboardingCompleted: boolean;
  visitCount: number;
  lastVisit: number;
  hasEngaged: boolean;
  currentRoute: string;
}

export interface PWAInstallPrompt {
  show: boolean;
  context: 'onboarding' | 'mainview' | 'engagement' | 'none';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

class PWAInstallService {
  private deferredPrompt: any = null;
  private isInstalled: boolean = false;
  private visitCount: number = 0;
  private lastVisit: number = Date.now();
  private hasEngaged: boolean = false;
  private dismissedCount: number = 0;
  private lastDismissed: number = 0;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    // Check if already installed
    this.checkInstalledStatus();
    
    // Load user engagement data
    this.loadEngagementData();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  private checkInstalledStatus() {
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true;
    
    if (this.isInstalled) {
      logger.info('📱 PWA already installed');
    }
  }

  private loadEngagementData() {
    try {
      const stored = localStorage.getItem('pwa_engagement_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.visitCount = data.visitCount || 0;
        this.lastVisit = data.lastVisit || Date.now();
        this.hasEngaged = data.hasEngaged || false;
        this.dismissedCount = data.dismissedCount || 0;
        this.lastDismissed = data.lastDismissed || 0;
      }
    } catch (error) {
      logger.error('Failed to load PWA engagement data', { error });
    }
  }

  private saveEngagementData() {
    try {
      const data = {
        visitCount: this.visitCount,
        lastVisit: this.lastVisit,
        hasEngaged: this.hasEngaged,
        dismissedCount: this.dismissedCount,
        lastDismissed: this.lastDismissed
      };
      localStorage.setItem('pwa_engagement_data', JSON.stringify(data));
    } catch (error) {
      logger.error('Failed to save PWA engagement data', { error });
    }
  }

  private setupEventListeners() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      logger.info('📱 PWA install prompt available');
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      logger.info('✅ PWA installed successfully');
    });
  }

  public trackVisit() {
    this.visitCount++;
    this.lastVisit = Date.now();
    this.saveEngagementData();
    logger.info('📊 PWA visit tracked', { visitCount: this.visitCount });
  }

  public trackEngagement() {
    this.hasEngaged = true;
    this.saveEngagementData();
    logger.info('🎯 PWA engagement tracked');
  }

  public shouldShowPrompt(context: PWAInstallContext): PWAInstallPrompt {
    // Don't show if already installed or no prompt available
    if (this.isInstalled || !this.deferredPrompt) {
      return { show: false, context: 'none', message: '', priority: 'low' };
    }

    // Don't show if recently dismissed (within 24 hours)
    const hoursSinceDismissed = (Date.now() - this.lastDismissed) / (1000 * 60 * 60);
    if (hoursSinceDismissed < 24) {
      return { show: false, context: 'none', message: '', priority: 'low' };
    }

    // High priority: Just completed onboarding
    if (context.isOnboardingCompleted && this.visitCount === 1) {
      return {
        show: true,
        context: 'onboarding',
        message: 'Welkom! Installeer de app voor de beste ervaring',
        priority: 'high'
      };
    }

    // Medium priority: Engaged user with multiple visits
    if (context.hasEngaged && this.visitCount >= 3 && this.dismissedCount < 2) {
      return {
        show: true,
        context: 'engagement',
        message: 'Je gebruikt de app regelmatig - installeer voor snellere toegang',
        priority: 'medium'
      };
    }

    // Low priority: General user in mainview
    if (context.currentRoute === '/' && this.visitCount >= 2 && this.dismissedCount < 3) {
      return {
        show: true,
        context: 'mainview',
        message: 'Installeer de app voor offline toegang en push notificaties',
        priority: 'low'
      };
    }

    return { show: false, context: 'none', message: '', priority: 'low' };
  }

  public async install(): Promise<boolean> {
    if (!this.deferredPrompt) return false;

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user to respond
      const result = await this.deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        logger.info('✅ PWA installatie geaccepteerd');
        this.trackEngagement();
        return true;
      } else {
        logger.info('❌ PWA installatie geweigerd');
        this.dismissedCount++;
        this.lastDismissed = Date.now();
        this.saveEngagementData();
        return false;
      }
      
    } catch (error) {
      logger.error('❌ PWA installatie failed:', { error });
      return false;
    }
  }

  public dismiss() {
    this.dismissedCount++;
    this.lastDismissed = Date.now();
    this.saveEngagementData();
    logger.info('🚫 PWA prompt dismissed', { dismissedCount: this.dismissedCount });
  }

  public getInstallPrompt() {
    return this.deferredPrompt;
  }

  public getInstallationStatus() {
    return {
      isInstalled: this.isInstalled,
      canInstall: !!this.deferredPrompt,
      visitCount: this.visitCount,
      hasEngaged: this.hasEngaged,
      dismissedCount: this.dismissedCount
    };
  }
}

// Singleton instance
// Export class for TypeScript support
export { PWAInstallService };

export const pwaInstallService = new PWAInstallService();
export default pwaInstallService;








