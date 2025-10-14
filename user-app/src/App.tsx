import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LazyNextUIProvider from './providers/NextUIProvider';
import AppRoutes from './components/AppRoutes';
import { FeatureParallaxProvider, FeatureParallaxBackground } from './components/parallax/FeatureParallaxManager';
import './i18n'; // Initialize i18n

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    // Error logging is handled by the error boundary itself
    // No need for console.error in production
    return null;
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center p-4">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Er is iets misgegaan</h1>
            <p className="mb-4">De applicatie heeft een onverwachte fout ondervonden.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Herlaad de pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// App with NextUIProvider for Tailwind CSS + Feature Parallax
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LazyNextUIProvider>
        <Router>
          <FeatureParallaxProvider>
            <div className="relative min-h-screen overflow-hidden">
              {/* Feature-specific background laag */}
              <FeatureParallaxBackground />
              
              {/* App content */}
              <main id="main-content" role="main" aria-label="MainView AI Coach Application" className="relative z-10">
                <AppRoutes />
              </main>
            </div>
          </FeatureParallaxProvider>
        </Router>
      </LazyNextUIProvider>
    </ErrorBoundary>
  );
};

export default App;
