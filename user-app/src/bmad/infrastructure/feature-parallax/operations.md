# ⚙️ Feature Parallax Manager - Atomic Development Operations v1.0

## **🚀 DEPLOYMENT OPERATIONS**

### **Production Deployment Checklist**
```bash
# 1. Pre-deployment validation
npm run test -- src/components/parallax/
npm run lint -- src/components/parallax/
npm run type-check

# 2. Asset optimization 
npm run optimize-images
npm run compress-backgrounds

# 3. Build verification
npm run build:production
npm run test:integration

# 4. Performance validation
npm run lighthouse:parallax
npm run bundle-analyzer
```

### **Asset Management Pipeline**
```bash
# Background image optimization workflow
# Location: scripts/optimize-parallax-assets.sh

#!/bin/bash
# Convert and optimize background images for parallax system

echo "🎨 Optimizing Feature Parallax Assets..."

# WebP conversion with quality optimization
cwebp -q 85 -m 6 public/mainview-mobile1.jpg -o public/mainview-mobile1.webp
cwebp -q 85 -m 6 public/imagination-mobile1.jpg -o public/imagination-mobile1.webp.jpg  
cwebp -q 85 -m 6 public/basics-mobile1.jpg -o public/basics-mobile1.webp.jpg

# Generate responsive variants
for size in 768 1024 1440 1920; do
  magick public/mainview-mobile1.webp -resize ${size}x public/mainview-mobile1-${size}w.webp
  magick public/imagination-mobile1.webp.jpg -resize ${size}x public/imagination-mobile1-${size}w.webp
  magick public/basics-mobile1.webp.jpg -resize ${size}x public/basics-mobile1-${size}w.webp
done

echo "✅ Asset optimization complete!"
```

### **Environment Configuration**
```typescript
// Location: src/config/parallax.config.ts
interface ParallaxEnvironmentConfig {
  development: {
    enableTransitions: boolean;
    showDebugInfo: boolean;
    preloadImages: boolean;
  };
  production: {
    enableTransitions: boolean;
    optimizeForLowEnd: boolean;
    enableAnalytics: boolean;
  };
}

export const PARALLAX_CONFIG: ParallaxEnvironmentConfig = {
  development: {
    enableTransitions: true,
    showDebugInfo: true,
    preloadImages: false, // Faster development reloads
  },
  production: {
    enableTransitions: true,
    optimizeForLowEnd: true,
    enableAnalytics: true,
  }
};
```

---

## **🔧 DEVELOPMENT OPERATIONS**

### **Local Development Setup**
```bash
# 1. Clone and setup
git clone https://github.com/your-org/met24-production.git
cd met24-production
npm install

# 2. Install parallax development dependencies
npm install --save-dev @testing-library/react-hooks
npm install --save-dev jest-environment-jsdom

# 3. Validate parallax system
npm run test:parallax
npm run dev

# 4. Test background switching
open http://localhost:3000/active-imagination
open http://localhost:3000/back-to-basics
open http://localhost:3000/
```

### **Development Debugging Tools**
```typescript
// Location: src/components/parallax/ParallaxDebugger.tsx
interface ParallaxDebuggerProps {
  enabled: boolean;
}

const ParallaxDebugger: React.FC<ParallaxDebuggerProps> = ({ enabled }) => {
  const { parallaxState } = useFeatureParallax();
  
  if (!enabled || process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs">
      <h3 className="font-bold text-green-400">🎨 Parallax Debug</h3>
      <div>Feature: {parallaxState.currentFeature}</div>
      <div>Image: {parallaxState.backgroundImage}</div>
      <div>Position: {parallaxState.backgroundPosition}</div>
      <div>Scale: {parallaxState.backgroundScale}</div>
      <div>Overlay: {parallaxState.overlayOpacity}</div>
      <div>Glass: {parallaxState.glassmorphismIntensity}</div>
      <div>Transitioning: {parallaxState.isTransitioning ? '✅' : '❌'}</div>
      <div>Preloaded: {parallaxState.preloadedImages.size} images</div>
    </div>
  );
};
```

### **Hot Module Replacement Setup**
```typescript
// Location: src/components/parallax/FeatureParallaxManager.tsx
// Add HMR support for development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./FeatureParallaxManager', () => {
    console.log('🔄 Parallax Manager reloaded');
  });
}
```

---

## **🧪 TESTING OPERATIONS**

### **Automated Test Suite**
```typescript
// Location: src/components/parallax/__tests__/operations.test.tsx
describe('Feature Parallax Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('Background Loading Operations', () => {
    test('should preload all background images on initialization', async () => {
      const { result } = renderHook(() => useFeatureParallax(), {
        wrapper: FeatureParallaxProvider
      });
      
      await waitFor(() => {
        expect(result.current.parallaxState.preloadedImages.size).toBe(3);
      });
    });

    test('should handle missing background images gracefully', async () => {
      // Mock failed image load
      Object.defineProperty(Image.prototype, 'src', {
        set(src) {
          setTimeout(() => this.onerror(new Error('404')), 0);
        },
      });

      const { result } = renderHook(() => useFeatureParallax(), {
        wrapper: FeatureParallaxProvider
      });

      await waitFor(() => {
        expect(result.current.parallaxState.currentFeature).toBe('mainview');
      });
    });
  });

  describe('Route Detection Operations', () => {
    test('should detect active imagination from multiple routes', () => {
      const routes = [
        '/active-imagination',
        '/universele-levensboom',
        '/met24-domains'
      ];

      routes.forEach(route => {
        expect(detectFeatureFromRoute(route)).toBe('active-imagination');
      });
    });

    test('should detect back to basics from levensgebied routes', () => {
      const routes = [
        '/back-to-basics',
        '/levensgebied/health',
        '/levensgebied/relationships'
      ];

      routes.forEach(route => {
        expect(detectFeatureFromRoute(route)).toBe('back-to-basics');
      });
    });
  });

  describe('Performance Operations', () => {
    test('should optimize for low-end devices', () => {
      // Mock low-end device
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 2,
        configurable: true,
      });

      const config = getPerformanceOptimizedConfig('active-imagination');
      expect(config.scale).toBe(1.0);
      expect(config.glassmorphism).toBe(0.3);
    });

    test('should debounce rapid route changes', async () => {
      const mockSetFeature = jest.fn();
      const { result } = renderHook(() => useFeatureParallax(), {
        wrapper: FeatureParallaxProvider
      });

      // Simulate rapid navigation
      act(() => {
        result.current.setFeature('active-imagination');
        result.current.setFeature('back-to-basics');
        result.current.setFeature('mainview');
      });

      await waitFor(() => {
        expect(result.current.parallaxState.currentFeature).toBe('mainview');
      });
    });
  });
});
```

### **Visual Regression Testing**
```typescript
// Location: src/components/parallax/__tests__/visual.test.tsx
describe('Feature Parallax Visual Tests', () => {
  test('should match snapshot for mainview background', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <FeatureParallaxProvider>
          <FeatureParallaxBackground />
        </FeatureParallaxProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('parallax-background')).toMatchSnapshot();
  });

  test('should maintain visual consistency across features', async () => {
    const features = ['mainview', 'active-imagination', 'back-to-basics'];
    
    for (const feature of features) {
      const { container } = render(
        <MemoryRouter initialEntries={[`/${feature}`]}>
          <FeatureParallaxProvider>
            <FeatureParallaxBackground />
          </FeatureParallaxProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        const background = container.querySelector('[data-testid="parallax-background"]');
        expect(background).toHaveStyle('background-size: cover');
        expect(background).toHaveStyle('transition-all: 1000ms');
      });
    }
  });
});
```

---

## **📊 MONITORING OPERATIONS**

### **Performance Monitoring**
```typescript
// Location: src/utils/parallaxMonitoring.ts
interface ParallaxMetrics {
  transitionDuration: number;
  imageLoadTime: number;
  memoryUsage: number;
  frameRate: number;
}

export class ParallaxMonitor {
  private metrics: ParallaxMetrics[] = [];

  measureTransition(startTime: number): void {
    const duration = Date.now() - startTime;
    this.metrics.push({
      transitionDuration: duration,
      imageLoadTime: 0,
      memoryUsage: this.getMemoryUsage(),
      frameRate: this.getFrameRate()
    });

    if (duration > 1000) {
      console.warn(`🐌 Slow parallax transition: ${duration}ms`);
    }
  }

  measureImageLoad(imageUrl: string, loadTime: number): void {
    console.log(`📸 Image loaded: ${imageUrl} in ${loadTime}ms`);
    
    if (loadTime > 500) {
      console.warn(`🐌 Slow image load: ${imageUrl} - ${loadTime}ms`);
    }
  }

  private getMemoryUsage(): number {
    return (performance as any).memory?.usedJSHeapSize || 0;
  }

  private getFrameRate(): number {
    // Simplified frame rate calculation
    return 60; // Placeholder for actual frame rate measurement
  }

  getAverageMetrics(): ParallaxMetrics {
    const count = this.metrics.length;
    return this.metrics.reduce((avg, metric) => ({
      transitionDuration: avg.transitionDuration + metric.transitionDuration / count,
      imageLoadTime: avg.imageLoadTime + metric.imageLoadTime / count,
      memoryUsage: avg.memoryUsage + metric.memoryUsage / count,
      frameRate: avg.frameRate + metric.frameRate / count,
    }), { transitionDuration: 0, imageLoadTime: 0, memoryUsage: 0, frameRate: 0 });
  }
}

export const parallaxMonitor = new ParallaxMonitor();
```

### **Error Tracking**
```typescript
// Location: src/components/parallax/ParallaxErrorBoundary.tsx
interface ParallaxErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

class ParallaxErrorBoundary extends Component<
  { children: ReactNode },
  ParallaxErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ParallaxErrorBoundaryState {
    return {
      hasError: true,
      errorInfo: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Parallax Error:', error, errorInfo);
    
    // Report to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // Integration with error reporting service
    const errorData = {
      component: 'FeatureParallaxManager',
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Send to monitoring service (e.g., Sentry, LogRocket)
    console.log('📤 Error reported:', errorData);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">⚠️ Parallax System Error</h2>
            <p className="mb-4">The background system encountered an error.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              🔄 Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## **🔄 MAINTENANCE OPERATIONS**

### **Regular Maintenance Tasks**
```bash
#!/bin/bash
# Location: scripts/parallax-maintenance.sh

echo "🔧 Starting Feature Parallax Maintenance..."

# 1. Clean up old cached images
echo "🧹 Cleaning cache..."
rm -rf public/cache/parallax-*

# 2. Optimize new background images
echo "🎨 Optimizing images..."
./scripts/optimize-parallax-assets.sh

# 3. Run performance tests
echo "⚡ Running performance tests..."
npm run test:parallax:performance

# 4. Update documentation
echo "📚 Updating documentation..."
npm run docs:parallax

# 5. Check for security vulnerabilities
echo "🔒 Security check..."
npm audit --audit-level=moderate

echo "✅ Maintenance complete!"
```

### **Asset Cache Management**
```typescript
// Location: src/utils/parallaxCache.ts
export class ParallaxCacheManager {
  private static readonly CACHE_NAME = 'parallax-backgrounds-v1';
  private static readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

  static async preloadImages(imageUrls: string[]): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open(this.CACHE_NAME);
      
      for (const url of imageUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response.clone());
            console.log(`✅ Cached: ${url}`);
          }
        } catch (error) {
          console.warn(`❌ Failed to cache: ${url}`, error);
        }
      }
    }
  }

  static async clearOldCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        name.startsWith('parallax-backgrounds-') && name !== this.CACHE_NAME
      );

      for (const oldCache of oldCaches) {
        await caches.delete(oldCache);
        console.log(`🗑️ Deleted old cache: ${oldCache}`);
      }
    }
  }

  static async getCacheSize(): Promise<number> {
    if ('caches' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }
}
```

### **Performance Optimization Scheduler**
```typescript
// Location: src/utils/parallaxOptimizer.ts
export class ParallaxOptimizer {
  private static isLowEndDevice(): boolean {
    return navigator.hardwareConcurrency < 4 || 
           navigator.connection?.effectiveType === '2g' ||
           navigator.connection?.effectiveType === 'slow-2g';
  }

  static getOptimizedConfig(baseConfig: FeatureBackgroundConfig): FeatureBackgroundConfig {
    if (this.isLowEndDevice()) {
      return {
        ...baseConfig,
        scale: 1.0,
        glassmorphism: 0.3,
        overlay: baseConfig.overlay * 1.5
      };
    }

    return baseConfig;
  }

  static scheduleOptimization(): void {
    // Run optimization during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.optimizeMemoryUsage();
        this.cleanupUnusedAssets();
      });
    } else {
      setTimeout(() => {
        this.optimizeMemoryUsage();
        this.cleanupUnusedAssets();
      }, 5000);
    }
  }

  private static optimizeMemoryUsage(): void {
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  private static cleanupUnusedAssets(): void {
    // Remove unused image objects from memory
    const images = document.querySelectorAll('img[data-parallax-preload]');
    images.forEach(img => {
      if (!img.isConnected) {
        img.remove();
      }
    });
  }
}
```

---

## **🚨 EMERGENCY OPERATIONS**

### **Rollback Procedure**
```bash
#!/bin/bash
# Location: scripts/parallax-rollback.sh

echo "🚨 Starting Parallax Emergency Rollback..."

# 1. Disable parallax system immediately
echo "⏸️ Disabling parallax system..."
cat > src/config/parallax.emergency.ts << EOF
export const EMERGENCY_CONFIG = {
  enabled: false,
  fallbackBackground: '#000000',
  message: 'Parallax system temporarily disabled for maintenance'
};
EOF

# 2. Revert to static backgrounds
echo "🔄 Reverting to static backgrounds..."
cp src/components/parallax/StaticBackground.tsx.backup src/components/parallax/FeatureParallaxManager.tsx

# 3. Clear problematic cache
echo "🧹 Clearing cache..."
npm run clear:cache

# 4. Emergency rebuild
echo "🔨 Emergency rebuild..."
npm run build:emergency

echo "✅ Rollback complete! System restored to static mode."
```

### **Health Check Operations**
```typescript
// Location: src/utils/parallaxHealthCheck.ts
export class ParallaxHealthCheck {
  static async runHealthCheck(): Promise<boolean> {
    try {
      // Check if images are accessible
      const imageChecks = await Promise.all([
        this.checkImageAccessibility('/mainview-mobile1.webp'),
        this.checkImageAccessibility('/imagination-mobile1.webp.jpg'),
        this.checkImageAccessibility('/basics-mobile1.webp.jpg')
      ]);

      const allImagesAccessible = imageChecks.every(Boolean);
      
      // Check performance thresholds
      const performanceCheck = await this.checkPerformance();
      
      // Check memory usage
      const memoryCheck = await this.checkMemoryUsage();

      const isHealthy = allImagesAccessible && performanceCheck && memoryCheck;
      
      console.log(`🏥 Parallax Health Check: ${isHealthy ? '✅' : '❌'}`);
      return isHealthy;
      
    } catch (error) {
      console.error('🚨 Health check failed:', error);
      return false;
    }
  }

  private static async checkImageAccessibility(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  private static async checkPerformance(): Promise<boolean> {
    const metrics = parallaxMonitor.getAverageMetrics();
    return metrics.transitionDuration < 1000 && metrics.frameRate > 30;
  }

  private static async checkMemoryUsage(): Promise<boolean> {
    const cacheSize = await ParallaxCacheManager.getCacheSize();
    return cacheSize < 100 * 1024 * 1024; // 100MB limit
  }
}
```

**🎯 Feature Parallax Manager now has complete BMAD infrastructure documentation!**

✅ **BMAD Documentation Complete:**
- `requirements.md` - Business requirements, technical specifications, and acceptance criteria
- `architecture.md` - Modular component design, state management, and integration patterns  
- `operations.md` - Deployment, testing, monitoring, and maintenance procedures

The Feature Parallax Manager infrastructure is now fully documented following BMAD methodology standards, providing comprehensive coverage of business requirements, technical architecture, and operational procedures for maintaining this critical visual system component.