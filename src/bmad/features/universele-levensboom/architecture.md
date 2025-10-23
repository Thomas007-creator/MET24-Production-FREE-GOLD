# 🌳 Universele Levensboom - Modular Architecture v1.0

## **🎯 ARCHITECTURAL OVERVIEW**

### **Component Design Philosophy**
De Universele Levensboom volgt een **service-oriented architecture** met **state-driven rendering** en **AI service abstraction**. Het component is ontworpen als een **standalone feature** met **loose coupling** en **high cohesion** voor maximale testbaarheid en herbruikbaarheid.

```
Universele Levensboom Architecture
├── Component Layer (React UI)
├── Service Layer (DeepSeek Integration)
├── State Management (Local useState)
├── Navigation Integration (Swipe Hooks)
└── Visual Presentation (ASCII Art + Glassmorphism)
```

---

## **🔧 CORE ARCHITECTURE COMPONENTS**

### **1. UniverseleLevensboom Component (Presentation Layer)**
```typescript
// Location: src/components/UniverseleLevensboom.tsx
interface UniverseleLevensboomProps {
  onBack?: () => void; // Optional callback for programmatic navigation
}

const UniverseleLevensboom: React.FC<UniverseleLevensboomProps> = ({ onBack }) => {
  // Local state management
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Navigation integration
  useSwipeNavigation({
    swipeLeft: '/active-imagination',
    swipeRight: '/'
  });

  // Core business logic handlers
  const handleDeepSeekQuery = async () => { /* Implementation */ };
  const handleClearAll = () => { /* Implementation */ };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-800">
      {/* Component structure */}
    </div>
  );
};
```

**Responsibilities**:
- UI state management (query, result, loading, error)
- User interaction handling (form submission, clearing)
- Visual rendering coordination (cards, buttons, displays)
- Integration met navigation system via swipe hooks

### **2. DeepSeek Service Layer (Business Logic)**
```typescript
// Location: src/services/deepSeekService.ts
interface DeepSeekQuery {
  query: string;
  context: string;
  database_schema: string;
}

interface DeepSeekResponse {
  success: boolean;
  result?: string;
  error?: string;
  metadata?: {
    processing_time: number;
    domains_analyzed: string[];
    confidence_score: number;
  };
}

class DeepSeekService {
  private baseUrl = process.env.REACT_APP_API_URL || '/api';

  async processQuery(query: DeepSeekQuery): Promise<DeepSeekResponse> {
    // Mock implementation with realistic timing
    const mockResponse = this.generateMockResponse(query);
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    return mockResponse;
  }

  private generateMockResponse(query: DeepSeekQuery): DeepSeekResponse {
    // Domain detection and response generation logic
  }

  getQueryTemplates(): string[] {
    // Pre-defined query suggestions
  }
}
```

**Responsibilities**:
- AI query processing en response generation
- Domain detection gebaseerd op query keywords
- Mock data generation met realistische delay
- Query template management voor user guidance

### **3. Navigation Integration Layer**
```typescript
// Location: src/hooks/useSwipeNavigation.ts (imported)
useSwipeNavigation({
  swipeLeft: '/active-imagination',  // Previous feature in sequence
  swipeRight: '/'                    // Next feature (MainView)
});
```

**Responsibilities**:
- Gesture detection voor touch navigation
- Programmatic routing naar adjacent features
- State preservation tijdens navigation
- Mobile-first interaction support

---

## **🗂️ DATA FLOW ARCHITECTURE**

### **Query Processing Pipeline**
```typescript
User Input → Validation → Service Call → Response Processing → UI Update

// Step 1: User Input Validation
if (!query.trim()) {
  setError('Voer een vraag in om DeepSeek te raadplegen');
  return;
}

// Step 2: Service Call with Context
const response = await deepSeekService.processQuery({
  query: query,
  context: 'universele_levensboom',
  database_schema: 'met24_domains'
});

// Step 3: Response Processing
if (!response.success) {
  throw new Error(response.error || 'DeepSeek query failed');
}

// Step 4: UI State Update
setResult(response.result || 'DeepSeek heeft je vraag verwerkt.');
```

### **State Management Pattern**
```typescript
// Local state with clear separation of concerns
interface ComponentState {
  query: string;        // User input
  loading: boolean;     // Processing state
  result: string | null; // AI response
  error: string | null; // Error state
}

// State transitions
type StateAction = 
  | 'START_QUERY'       // loading = true, error = null
  | 'QUERY_SUCCESS'     // loading = false, result = data
  | 'QUERY_ERROR'       // loading = false, error = message
  | 'CLEAR_ALL';        // Reset all states
```

### **Domain Detection Algorithm**
```typescript
// Keyword-based domain classification
const domainKeywords: Record<string, string[]> = {
  'spiritualiteit': ['spiritueel', 'ziel', 'bewustzijn', 'transcendentie'],
  'creativiteit': ['creatief', 'kunst', 'expressie', 'inspiratie'],
  'relaties': ['relatie', 'verbinding', 'liefde', 'familie'],
  'gezondheid': ['gezondheid', 'wellness', 'energie', 'lichamelijk'],
  'groei': ['groei', 'ontwikkeling', 'leren', 'evolutie'],
  'doel': ['doel', 'visie', 'missie', 'richting'],
  'wijsheid': ['wijsheid', 'inzicht', 'begrip', 'kennis']
};

// Multi-domain detection logic
const detectRelevantDomains = (queryText: string): string[] => {
  const lowerQuery = queryText.toLowerCase();
  const relevantDomains: string[] = [];
  
  Object.entries(domainKeywords).forEach(([domain, keywords]) => {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      relevantDomains.push(domain);
    }
  });
  
  return relevantDomains.length > 0 ? relevantDomains : ['groei', 'wijsheid'];
};
```

---

## **🎨 VISUAL ARCHITECTURE**

### **ASCII Tree Rendering System**
```typescript
// Static ASCII art for universal life tree visualization
const TreeVisualization = `
           🌟
            |
         ___🍃___
        /    |    \\
       🍃    |    🍃
      /      |      \\
     🌿     🌳     🌿
    /        |        \\
   🍂      🌱🌱      🍂
  /          |          \\
 🌿         ===         🌿
           /   \\
          /     \\
         🌰     🌰
`;

// Responsive rendering considerations
const TreeDisplay = () => (
  <pre className="text-green-300 text-center font-mono text-sm leading-tight">
    {TreeVisualization}
  </pre>
);
```

**Design Principles**:
- **Symbolic Representation**: Emoji-based tree voor universal recognition
- **Vertical Hierarchy**: Root → Trunk → Branches → Leaves structure
- **Mobile Optimization**: Compact rendering voor small screens
- **Accessibility**: Screen reader compatible met meaningful structure

### **Glassmorphism Design System**
```typescript
// Card component styling patterns
const glassCardClasses = "glass rounded-xl"; // NextUI custom glass class

// Background gradient system
const backgroundGradient = "bg-gradient-to-br from-emerald-900 via-green-900 to-teal-800";

// Interactive element styling
const primaryButton = "bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold";
const secondaryButton = "text-gray-300 border-gray-500";
```

### **Responsive Layout Strategy**
```typescript
// Container structure voor responsive design
<div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-800 p-6">
  <div className="max-w-4xl mx-auto">
    {/* Responsive content containers */}
    <div className="text-center mb-8">        {/* Header section */}
    <Card className="glass rounded-xl mb-6">  {/* Tree visualization */}
    <Card className="glass rounded-xl mb-6">  {/* Query interface */}
    <Card className="glass rounded-xl mb-6">  {/* Results display */}
    <Card className="glass rounded-xl mb-6">  {/* Template suggestions */}
  </div>
</div>
```

---

## **🔄 SERVICE INTEGRATION ARCHITECTURE**

### **DeepSeek Service Mock Implementation**
```typescript
class DeepSeekService {
  // Mock response generation met domain-specific templates
  private generateMockResponse(query: DeepSeekQuery): DeepSeekResponse {
    const relevantDomains = this.detectDomains(query.query);
    const primaryDomain = relevantDomains[0];
    
    // Domain-specific response templates
    const responseTemplates = {
      'spiritualiteit': this.generateSpiritualityResponse(),
      'creativiteit': this.generateCreativityResponse(),
      'relaties': this.generateRelationshipResponse(),
      // ... andere domains
    };
    
    let result = responseTemplates[primaryDomain] || this.getDefaultResponse();
    
    // Cross-domain insights toevoegen
    if (relevantDomains.length > 1) {
      result += this.generateCrossDomainInsights(relevantDomains);
    }
    
    // Actionable items toevoegen
    result += this.generateActionItems(query.query);
    
    return {
      success: true,
      result,
      metadata: {
        processing_time: Math.floor(1000 + Math.random() * 3000),
        domains_analyzed: relevantDomains,
        confidence_score: Math.floor(80 + Math.random() * 20)
      }
    };
  }
}
```

### **Error Handling Architecture**
```typescript
// Comprehensive error handling pattern
const handleDeepSeekQuery = async () => {
  try {
    setLoading(true);
    setError(null);
    setResult(null);
    
    const response = await deepSeekService.processQuery({
      query,
      context: 'universele_levensboom',
      database_schema: 'met24_domains'
    });
    
    if (!response.success) {
      throw new Error(response.error || 'DeepSeek query failed');
    }
    
    setResult(response.result || 'DeepSeek heeft je vraag verwerkt.');
    
  } catch (err) {
    console.error('DeepSeek query error:', err);
    setError('Er is een fout opgetreden bij het raadplegen van DeepSeek. Probeer het opnieuw.');
  } finally {
    setLoading(false);
  }
};
```

---

## **📱 MOBILE-FIRST ARCHITECTURE**

### **Responsive Breakpoint Strategy**
```typescript
// Mobile-first design considerations
const ResponsiveLayout = {
  mobile: {
    screenWidth: '<768px',
    cardPadding: 'p-4',
    fontSize: 'text-sm',
    treeScale: '0.8x'
  },
  tablet: {
    screenWidth: '768px-1024px',
    cardPadding: 'p-6',
    fontSize: 'text-base',
    treeScale: '1.0x'
  },
  desktop: {
    screenWidth: '>1024px',
    cardPadding: 'p-8',
    fontSize: 'text-lg',
    treeScale: '1.2x'
  }
};
```

### **Touch Interaction Optimization**
```typescript
// Swipe navigation met touch-friendly targets
useSwipeNavigation({
  swipeLeft: '/active-imagination',
  swipeRight: '/',
  touchThreshold: 50,      // Minimum swipe distance
  velocityThreshold: 0.3   // Minimum swipe velocity
});

// Button sizing voor touch accessibility
const touchFriendlyButton = "size-lg"; // NextUI large size
const minimumTouchTarget = "min-h-[44px] min-w-[44px]"; // iOS guidelines
```

### **Performance Optimization**
```typescript
// Lazy loading en code splitting
const UniverseleLevensboom = React.lazy(() => 
  import('./UniverseleLevensboom').then(module => ({ default: module.UniverseleLevensboom }))
);

// Memoization voor expensive operations
const MemoizedTreeVisualization = React.memo(() => (
  <TreeDisplay />
));

// Service worker caching voor AI responses
const cacheResponse = (query: string, response: DeepSeekResponse) => {
  localStorage.setItem(`deepseek_${query}`, JSON.stringify(response));
};
```

---

## **🔍 TESTING ARCHITECTURE**

### **Unit Test Structure**
```typescript
// Location: src/components/__tests__/UniverseleLevensboom.test.tsx
describe('UniverseleLevensboom Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Interface', () => {
    test('should render tree visualization correctly');
    test('should display query input interface');
    test('should show loading state during query processing');
    test('should display results after successful query');
    test('should show error message on query failure');
  });

  describe('Query Processing', () => {
    test('should validate user input before processing');
    test('should call DeepSeek service with correct parameters');
    test('should handle service errors gracefully');
    test('should clear results when user clears input');
  });

  describe('Navigation Integration', () => {
    test('should initialize swipe navigation hooks');
    test('should maintain component state during navigation');
  });
});
```

### **Integration Test Patterns**
```typescript
// Location: src/services/__tests__/deepSeekService.test.tsx
describe('DeepSeek Service Integration', () => {
  describe('Domain Detection', () => {
    test('should detect spirituality keywords correctly');
    test('should detect multiple domains in complex queries');
    test('should fallback to default domains when no keywords match');
  });

  describe('Response Generation', () => {
    test('should generate domain-specific responses');
    test('should include cross-domain insights for multi-domain queries');
    test('should provide actionable items in all responses');
    test('should include realistic metadata');
  });

  describe('Performance', () => {
    test('should complete queries within 5 seconds');
    test('should handle concurrent queries correctly');
  });
});
```

---

## **📋 ARCHITECTURAL COMPLIANCE**

### **React Best Practices**
- **Functional Components**: Gebruik van moderne React hooks pattern
- **Single Responsibility**: Elke component heeft één duidelijke verantwoordelijkheid
- **Props Interface**: Strikte TypeScript typing voor alle component interfaces
- **State Management**: Local state voor component-specific data
- **Error Boundaries**: Graceful error handling zonder app crashes

### **TypeScript Integration**
- **Strict Typing**: Alle interfaces en types expliciet gedefinieerd
- **Null Safety**: Proper handling van nullable values
- **Generic Types**: Herbruikbare type definitions voor service responses
- **Enum Usage**: Type-safe constants voor domain classifications

### **Performance Standards**
- **Lazy Loading**: Component kan lazy geladen worden voor code splitting
- **Memoization**: Expensive calculations worden gecached
- **Efficient Re-renders**: Minimal re-renders door optimale state structure
- **Memory Management**: Proper cleanup van event listeners en timeouts

### **Accessibility Architecture**
- **ARIA Labels**: Meaningful labels voor screen readers
- **Keyboard Navigation**: Tab order en keyboard shortcuts
- **Color Contrast**: WCAG 2.1 AA compliant color combinations
- **Responsive Text**: Dynamic text scaling voor readability

**🎯 Ready voor Atomic Development operations in operations.md!**