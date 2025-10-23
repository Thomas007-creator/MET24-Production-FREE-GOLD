/**
 * Universele Levensboom - BMAD Refactored
 * 
 * React component voor universele levensboom AI raadpleging
 * Refactored using BMAD composition patterns to eliminate monolithic structure
 * 
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { useState, createContext, useContext } from 'react';
import { Card, CardBody, CardHeader, Button, Textarea, Spinner } from '@nextui-org/react';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { deepSeekService } from '../services/deepSeekService';
import { useAppStore } from '../store/useAppStore';

// ================================================
// BMAD Types
// ================================================

interface UniverseleLevensboomProps {
  onBack?: () => void;
}

interface UniverseleLevensboomContextType {
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  result: string | null;
  setResult: (result: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  responseMetadata: any;
  setResponseMetadata: (metadata: any) => void;
  userData: any;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleClearAll: () => void;
}

// ================================================
// BMAD Universele Levensboom Context & Provider
// ================================================

const UniverseleLevensboomContext = createContext<UniverseleLevensboomContextType | null>(null);

interface UniverseleLevensboomProviderProps {
  children: React.ReactNode;
}

const UniverseleLevensboomProvider: React.FC<UniverseleLevensboomProviderProps> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseMetadata, setResponseMetadata] = useState<any>(null);

  const { userData } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setResponseMetadata(null);

    try {
      const response = await deepSeekService.processQuery(query, userData);
      
      if (response.success) {
        setResult(response.result || null);
        setResponseMetadata(response.metadata);
      } else {
        setError(response.error || 'Er is een onbekende fout opgetreden');
      }
    } catch (err) {
      console.error('UniverseleLevensboom query error:', err);
      setError('Er is een fout opgetreden bij het verwerken van je vraag');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setQuery('');
    setResult(null);
    setError(null);
  };

  const contextValue: UniverseleLevensboomContextType = {
    query,
    setQuery,
    loading,
    setLoading,
    result,
    setResult,
    error,
    setError,
    responseMetadata,
    setResponseMetadata,
    userData,
    handleSubmit,
    handleClearAll
  };

  return (
    <UniverseleLevensboomContext.Provider value={contextValue}>
      {children}
    </UniverseleLevensboomContext.Provider>
  );
};

// ================================================
// BMAD Universele Levensboom Hook
// ================================================

const useUniverseleLevensboom = (): UniverseleLevensboomContextType => {
  const context = useContext(UniverseleLevensboomContext);
  if (!context) {
    throw new Error('useUniverseleLevensboom must be used within UniverseleLevensboomProvider');
  }
  return context;
};

// ================================================
// BMAD Header Component
// ================================================

const UniverseleLevensboomHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="mb-6 animate-fade-in">
        <div className="text-6xl mb-4">🌳</div>
        <h1 className="text-4xl font-bold text-white mb-2">Universele Levensboom</h1>
        <p className="text-xl text-gray-300">Raadpleeg DeepSeek AI voor inzichten in je levensdomein</p>
      </div>
    </div>
  );
};

// ================================================
// BMAD Levensboom Visual Component
// ================================================

const LevensboomVisual: React.FC = () => {
  return (
    <Card className="glass rounded-xl mb-6">
      <CardBody className="p-6">
        <div className="flex justify-center mb-4">
          <pre className="text-green-300 text-center font-mono text-sm leading-tight">
{`           🌟
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
`}
          </pre>
        </div>
        <p className="text-center text-gray-300 text-sm">
          De Universele Levensboom verbindt alle aspecten van je bestaan - 
          van je diepste wortels tot je hoogste aspiraties.
        </p>
      </CardBody>
    </Card>
  );
};

// ================================================
// BMAD Query Interface Component
// ================================================

const QueryInterface: React.FC = () => {
  const { query, setQuery, loading, handleSubmit, handleClearAll } = useUniverseleLevensboom();

  return (
    <Card className="glass rounded-xl mb-6">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-white">🤖 DeepSeek AI Raadpleging</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Stel je vraag aan DeepSeek
          </label>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bijvoorbeeld: 'Wat zijn de verbindingen tussen mijn creativiteit en spirituele groei?' of 'Hoe kan ik mijn levensdomein beter begrijpen?'"
            rows={4}
            className="w-full"
            variant="bordered"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold"
            size="lg"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                DeepSeek verwerkt...
              </>
            ) : (
              '🔍 Raadpleeg DeepSeek'
            )}
          </Button>
          
          <Button
            onClick={handleClearAll}
            variant="bordered"
            className="text-gray-300 border-gray-500"
            size="lg"
          >
            🗑️ Wissen
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

// ================================================
// BMAD Error Display Component
// ================================================

const ErrorDisplay: React.FC = () => {
  const { error } = useUniverseleLevensboom();

  if (!error) return null;

  return (
    <Card className="bg-red-900/20 border border-red-500/30 mb-6">
      <CardBody>
        <p className="text-red-300">⚠️ {error}</p>
      </CardBody>
    </Card>
  );
};

// ================================================
// BMAD Results Display Component
// ================================================

const ResultsDisplay: React.FC = () => {
  const { result } = useUniverseleLevensboom();

  if (!result) return null;

  return (
    <Card className="glass rounded-xl mb-6">
      <CardHeader>
        <h3 className="text-xl font-semibold text-white">🧠 DeepSeek Resultaten</h3>
      </CardHeader>
      <CardBody>
        <div className="bg-black/20 rounded-lg p-4">
          <pre className="text-gray-200 whitespace-pre-wrap font-mono text-sm">
            {result}
          </pre>
        </div>
      </CardBody>
    </Card>
  );
};

// ================================================
// BMAD Quick Examples Component
// ================================================

const QuickExamples: React.FC = () => {
  const { setQuery } = useUniverseleLevensboom();

  return (
    <Card className="glass rounded-xl mb-6">
      <CardHeader>
        <h3 className="text-xl font-semibold text-white">💡 Voorbeeldvragen</h3>
      </CardHeader>
      <CardBody className="space-y-2">
        {deepSeekService.getQueryTemplates().map((example, index) => (
          <Button
            key={index}
            onClick={() => setQuery(example)}
            variant="ghost"
            className="text-left text-gray-300 hover:text-white hover:bg-white/10 justify-start h-auto py-2 px-3"
            size="sm"
          >
            "{example}"
          </Button>
        ))}
      </CardBody>
    </Card>
  );
};

// ================================================
// BMAD Navigation Component
// ================================================

interface NavigationProps {
  onBack?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onBack }) => {
  return (
    <div className="text-center space-y-4">
      <div className="text-sm text-gray-400">
        👈 Swipe links naar Active Imagination | Swipe rechts naar MainView 👉
      </div>
      
      {onBack && (
        <Button
          onClick={onBack}
          variant="bordered"
          className="text-gray-300 border-gray-500"
        >
          ← Terug naar Hoofdmenu
        </Button>
      )}
    </div>
  );
};

// ================================================
// BMAD Main Universele Levensboom Component
// ================================================

const UniverseleLevensboomContent: React.FC<UniverseleLevensboomProps> = ({ onBack }) => {
  // Swipe navigation hooks
  useSwipeNavigation({
    swipeLeft: '/active-imagination',
    swipeRight: '/'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-800 p-6">
      <div className="max-w-4xl mx-auto">
        <UniverseleLevensboomHeader />
        <LevensboomVisual />
        <QueryInterface />
        <ErrorDisplay />
        <ResultsDisplay />
        <QuickExamples />
        <Navigation onBack={onBack} />
      </div>
    </div>
  );
};

// ================================================
// BMAD Main Universele Levensboom Component with Provider
// ================================================

const UniverseleLevensboom: React.FC<UniverseleLevensboomProps> = (props) => {
  return (
    <UniverseleLevensboomProvider>
      <UniverseleLevensboomContent {...props} />
    </UniverseleLevensboomProvider>
  );
};

// ================================================
// BMAD Compound Components Export
// ================================================

export const UniverseleLevensboomComponents = {
  Provider: UniverseleLevensboomProvider,
  Page: UniverseleLevensboom,
  Header: UniverseleLevensboomHeader,
  Visual: LevensboomVisual,
  QueryInterface,
  ErrorDisplay,
  ResultsDisplay,
  QuickExamples,
  Navigation,
  useUniverseleLevensboom
};

export default UniverseleLevensboom;
