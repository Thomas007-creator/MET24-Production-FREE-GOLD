# 🏗️ Feature Parallax Manager - Modular Architecture v1.0

## **🎯 ARCHITECTURAL OVERVIEW**

### **Modular Design Philosophy**
The Feature Parallax Manager follows a **provider-consumer pattern** with **modular configuration** and **atomic operations**. Each component is independently testable and replaceable without affecting the overall system.

```
Feature Parallax Architecture
├── Context Provider (Global State)
├── Background Component (Visual Layer)  
├── Content Wrapper (Integration Layer)
├── Configuration System (Data Layer)
└── Route Integration (Navigation Layer)
```

---

## **🔧 CORE ARCHITECTURE COMPONENTS**

### **1. FeatureParallaxProvider (Context Layer)**
```typescript
// Location: src/components/parallax/FeatureParallaxManager.tsx
interface FeatureParallaxProviderProps {
  children: React.ReactNode;
}

const FeatureParallaxProvider: React.FC<FeatureParallaxProviderProps> = ({ children }) => {
  const [parallaxState, setParallaxState] = useState<FeatureParallaxState>(defaultState);
  const location = useLocation();
  
  // Auto-detect feature from route
  useEffect(() => {
    const currentFeature = detectFeatureFromRoute(location.pathname);
    if (currentFeature !== parallaxState.currentFeature) {
      updateFeatureBackground(currentFeature);
    }
  }, [location.pathname]);
  
  return (
    <FeatureParallaxContext.Provider value={{ parallaxState, setFeature }}>
      {children}
    </FeatureParallaxContext.Provider>
  );
};
```

**Responsibilities:**
- Global state management for parallax system
- Automatic route detection and background switching
- Context value provision to child components
- State persistence during navigation

### **2. FeatureParallaxBackground (Visual Layer)**
```typescript
// Location: src/components/parallax/FeatureParallaxManager.tsx
const FeatureParallaxBackground: React.FC = () => {
  const { parallaxState } = useFeatureParallax();
  
  return (
    <>
      {/* Fixed background image */}
      <div 
        className="fixed inset-0 z-[0] transition-all duration-1000"
        style={{
          backgroundImage: `url(${parallaxState.backgroundImage})`,
          backgroundPosition: parallaxState.backgroundPosition,
          backgroundSize: 'cover',
          transform: `scale(${parallaxState.backgroundScale})`,
          transformOrigin: 'center center'
        }}
      />
      
      {/* Feature-specific overlay */}
      <div 
        className="fixed inset-0 z-[1] transition-opacity duration-1000"
        style={{
          background: `linear-gradient(135deg, 
            rgba(30, 27, 75, ${parallaxState.overlayOpacity * 0.1}) 0%, 
            rgba(124, 58, 237, ${parallaxState.overlayOpacity * 0.05}) 50%, 
            rgba(190, 24, 93, ${parallaxState.overlayOpacity * 0.03}) 100%)`,
        }}
      />
    </>
  );
};
```

**Responsibilities:**
- Render background image with dynamic properties
- Apply feature-specific overlay with configurable opacity
- Handle smooth transitions between background changes
- Maintain proper z-index layering

### **3. FeatureParallaxContent (Integration Layer)**
```typescript
// Location: src/components/parallax/FeatureParallaxManager.tsx
interface FeatureContentProps {
  children: React.ReactNode;
  className?: string;
}

const FeatureParallaxContent: React.FC<FeatureContentProps> = ({ 
  children, 
  className = "" 
}) => {
  const { parallaxState } = useFeatureParallax();

  const dynamicGlassStyles = {
    background: `rgba(255, 255, 255, ${0.05 + (parallaxState.glassmorphismIntensity * 0.05)})`,
    backdropFilter: `blur(${12 + (parallaxState.glassmorphismIntensity * 8)}px)`,
    border: `1px solid rgba(255, 255, 255, ${0.1 + (parallaxState.glassmorphismIntensity * 0.1)})`,
    borderRadius: '20px',
    boxShadow: `0 8px 32px rgba(0, 0, 0, ${0.1 + (parallaxState.glassmorphismIntensity * 0.1)})`
  };

  return (
    <div 
      className={`relative z-10 min-h-screen transition-all duration-1000 ${className}`}
      style={dynamicGlassStyles}
    >
      {children}
    </div>
  );
};
```

**Responsibilities:**
- Provide dynamic glassmorphism effects based on current feature
- Ensure content appears above background layers
- Apply feature-specific styling to content containers
- Maintain responsive design across all devices

---

## **🗂️ CONFIGURATION ARCHITECTURE**

### **Background Configuration System**
```typescript
// Location: src/components/parallax/FeatureParallaxManager.tsx
interface FeatureBackgroundConfig {
  image: string;
  position: string;
  scale: number;
  overlay: number;
  glassmorphism: number;
}

const FEATURE_BACKGROUNDS: Record<string, FeatureBackgroundConfig> = {
  mainview: {
    image: '/mainview-mobile1.webp',
    position: 'center bottom',
    scale: 1.25,
    overlay: 0.02,    // Ultra-subtle for main navigation
    glassmorphism: 0.6
  },
  'active-imagination': {
    image: '/imagination-mobile1.webp.jpg',
    position: 'center center',
    scale: 1.1,
    overlay: 0.05,    // Light overlay for creativity
    glassmorphism: 0.8
  },
  'back-to-basics': {
    image: '/basics-mobile1.webp.jpg',
    position: 'center center', 
    scale: 1.0,
    overlay: 0.08,    // Medium overlay for learning focus
    glassmorphism: 0.7
  }
};
```

**Configuration Properties:**
- **image**: Background image path (WebP preferred, JPEG fallback)
- **position**: CSS background-position for optimal composition
- **scale**: Transform scale for parallax depth effect
- **overlay**: Opacity multiplier for readability overlay
- **glassmorphism**: Intensity factor for backdrop-blur effects

### **Route Mapping System**
```typescript
// Location: src/components/parallax/FeatureParallaxManager.tsx
const detectFeatureFromRoute = (pathname: string): string => {
  if (pathname.includes('/active-imagination') || pathname.includes('/universele-levensboom')) {
    return 'active-imagination';
  }
  if (pathname.includes('/back-to-basics')) {
    return 'back-to-basics';
  }
  return 'mainview'; // Default fallback
};
```

**Route Detection Logic:**
- **Active Imagination**: `/active-imagination`, `/universele-levensboom`, `/met24-domains`
- **Back to Basics**: `/back-to-basics`, `/levensgebied/*`
- **MainView**: `/`, `/streamlined`, `/main`, and all other routes

---

## **🔄 STATE MANAGEMENT ARCHITECTURE**

### **State Structure**
```typescript
interface FeatureParallaxState {
  currentFeature: 'mainview' | 'active-imagination' | 'back-to-basics' | null;
  backgroundImage: string;
  backgroundPosition: string;
  backgroundScale: number;
  overlayOpacity: number;
  glassmorphismIntensity: number;
  isTransitioning: boolean;
  preloadedImages: Set<string>;
}
```

### **State Transitions**
```typescript
const updateFeatureBackground = (feature: string) => {
  const config = FEATURE_BACKGROUNDS[feature];
  if (!config) return;
  
  setParallaxState(prev => ({
    ...prev,
    isTransitioning: true,
    currentFeature: feature,
    backgroundImage: config.image,
    backgroundPosition: config.position,
    backgroundScale: config.scale,
    overlayOpacity: config.overlay,
    glassmorphismIntensity: config.glassmorphism
  }));
  
  // Complete transition after animation
  setTimeout(() => {
    setParallaxState(prev => ({ ...prev, isTransitioning: false }));
  }, 1000);
};
```

### **Performance Optimizations**
- **Image Preloading**: All background images loaded on app initialization
- **Transition Debouncing**: Prevent rapid route changes from causing performance issues
- **Memory Management**: Cleanup unused images and event listeners
- **GPU Acceleration**: Use CSS transforms for hardware-accelerated animations

---

## **🎨 INTEGRATION ARCHITECTURE**

### **App.tsx Integration Pattern**
```typescript
// Location: src/App.tsx
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LazyNextUIProvider>
        <Router>
          <FeatureParallaxProvider>
            <div className="relative min-h-screen overflow-hidden">
              {/* Background layer */}
              <FeatureParallaxBackground />
              
              {/* Content layer */}
              <main id="main-content" role="main" className="relative z-10">
                <AppRoutes />
              </main>
            </div>
          </FeatureParallaxProvider>
        </Router>
      </LazyNextUIProvider>
    </ErrorBoundary>
  );
};
```

### **Component Integration Pattern**
```typescript
// Example: ActiveImaginationPage.tsx
const ActiveImaginationPage: React.FC = () => {
  // Automatic background switching handled by provider
  // No manual background management needed
  
  return (
    <div className="min-h-screen p-4">
      {/* Content automatically gets correct background */}
      <Card className="bg-white/10 backdrop-blur-xl">
        {/* Component content */}
      </Card>
    </div>
  );
};
```

### **CSS Override Architecture**
```css
/* Location: src/index.css */
/* Nuclear override system for existing purple backgrounds */
body {
  background: #000000 !important;
}

.bg-purple-50, .bg-purple-100, .bg-purple-200, .bg-purple-300, 
.bg-purple-400, .bg-purple-500, .bg-purple-600, .bg-purple-700, 
.bg-purple-800, .bg-purple-900,
.bg-indigo-50, .bg-indigo-100, .bg-indigo-200, .bg-indigo-300, 
.bg-indigo-400, .bg-indigo-500, .bg-indigo-600, .bg-indigo-700, 
.bg-indigo-800, .bg-indigo-900 {
  background: transparent !important;
}

.bg-gradient-to-br, .bg-gradient-to-r, .bg-gradient-to-l,
.bg-gradient-to-t, .bg-gradient-to-b, .bg-gradient-to-tr,
.bg-gradient-to-tl, .bg-gradient-to-bl {
  background: transparent !important;
}
```

---

## **📱 RESPONSIVE ARCHITECTURE**

### **Mobile-First Design**
```typescript
const getMobileOptimizedConfig = (feature: string): FeatureBackgroundConfig => {
  const baseConfig = FEATURE_BACKGROUNDS[feature];
  
  if (window.innerWidth < 768) {
    return {
      ...baseConfig,
      scale: Math.min(baseConfig.scale, 1.1), // Reduce scale on mobile
      overlay: baseConfig.overlay * 1.2,     // Increase overlay for readability
    };
  }
  
  return baseConfig;
};
```

### **Responsive Breakpoints**
- **Mobile** (<768px): Reduced scale, increased overlay, simplified effects
- **Tablet** (768px-1024px): Balanced configuration between mobile and desktop
- **Desktop** (>1024px): Full parallax effects, optimal scale and positioning
- **Large Desktop** (>1440px): Enhanced effects for large screens

### **Performance Scaling**
```typescript
const getPerformanceOptimizedConfig = (feature: string): FeatureBackgroundConfig => {
  const baseConfig = FEATURE_BACKGROUNDS[feature];
  const isLowEnd = navigator.hardwareConcurrency < 4;
  
  if (isLowEnd) {
    return {
      ...baseConfig,
      scale: 1.0,           // Disable scaling on low-end devices
      glassmorphism: 0.3,   // Reduce blur intensity
    };
  }
  
  return baseConfig;
};
```

---

## **🔍 TESTING ARCHITECTURE**

### **Unit Test Structure**
```typescript
// Location: src/components/parallax/__tests__/FeatureParallaxManager.test.tsx
describe('FeatureParallaxManager', () => {
  describe('FeatureParallaxProvider', () => {
    test('should provide default state');
    test('should detect feature from route');
    test('should update background on route change');
  });
  
  describe('FeatureParallaxBackground', () => {
    test('should render background with correct properties');
    test('should apply overlay with correct opacity');
    test('should transition smoothly between backgrounds');
  });
  
  describe('useFeatureParallax hook', () => {
    test('should return current parallax state');
    test('should provide setFeature function');
    test('should handle invalid feature gracefully');
  });
});
```

### **Integration Test Pattern**
```typescript
// Location: src/components/parallax/__tests__/integration.test.tsx
describe('Feature Parallax Integration', () => {
  test('should switch backgrounds when navigating between features');
  test('should maintain performance during rapid navigation');
  test('should respect reduced motion preferences');
  test('should handle missing background images gracefully');
});
```

---

## **📋 ARCHITECTURAL COMPLIANCE**

### **SOLID Principles**
- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Easy to add new features without modifying existing code
- **Liskov Substitution**: Components can be replaced with compatible implementations
- **Interface Segregation**: Clean, minimal interfaces for each component
- **Dependency Inversion**: Components depend on abstractions, not concretions

### **React Best Practices**
- **Hook Rules**: All hooks follow React rules and conventions
- **Performance**: Proper use of useCallback, useMemo for optimization
- **Error Boundaries**: Graceful error handling for background loading failures
- **Accessibility**: ARIA labels and reduced motion support

### **Modern CSS Architecture**
- **CSS-in-JS**: Inline styles for dynamic properties
- **CSS Custom Properties**: Use of CSS variables for theming
- **PostCSS**: Modern CSS features with backward compatibility
- **Tailwind Integration**: Seamless integration with utility-first CSS

**🎯 Ready for Operations breakdown in operations.md!**