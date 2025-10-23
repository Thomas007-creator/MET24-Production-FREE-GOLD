/**
 * Token Usage Alert Component
 * Displays token usage warnings and provides API key setup guidance
 */

import React from 'react';
import { useTokenMonitor } from '../hooks/useTokenMonitor';

interface TokenUsageAlertProps {
  className?: string;
}

export const TokenUsageAlert: React.FC<TokenUsageAlertProps> = ({ 
  className = '' 
}) => {
  const {
    summary,
    isLoading,
    error,
    hasWarnings,
    hasCritical,
    needsAttention,
    simulateTokenUsage
  } = useTokenMonitor();

  if (isLoading) {
    return (
      <div className={`token-usage-alert ${className}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`token-usage-alert ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            Token Monitoring Error
          </h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!needsAttention) {
    return null; // Don't show alert if no issues
  }

  const criticalProviders = summary.summary.filter(s => s.status === 'critical');
  const warningProviders = summary.summary.filter(s => s.status === 'warning');

  return (
    <div className={`token-usage-alert ${className}`}>
      {/* Critical Alerts */}
      {hasCritical && (
        <div className="mb-4">
          {criticalProviders.map((provider) => (
            <div key={provider.provider} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    🚨 {provider.provider.toUpperCase()} Tokens Kritiek!
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    Je hebt {provider.percentage.toFixed(0)}% van je {provider.provider} tokens gebruikt.
                    {provider.provider === 'grok-3' && (
                      <span className="block mt-2">
                        Voeg je eigen API key toe om door te gaan met optimale AI functionaliteit!
                      </span>
                    )}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => window.location.href = '/settings/api-keys'}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      API Key Toevoegen
                    </button>
                    <button
                      onClick={() => window.location.href = '/help/api-setup'}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      Hulp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning Alerts */}
      {hasWarnings && (
        <div className="mb-4">
          {warningProviders.map((provider) => (
            <div key={provider.provider} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">⚠</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">
                    ⚠️ {provider.provider.toUpperCase()} Token Waarschuwing
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Je hebt {provider.percentage.toFixed(0)}% van je {provider.provider} tokens gebruikt.
                    {provider.provider === 'grok-3' && (
                      <span className="block mt-2">
                        Overweeg je eigen API key toe te voegen voor onbeperkte toegang.
                      </span>
                    )}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => window.location.href = '/settings/api-keys'}
                      className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                    >
                      API Key Toevoegen
                    </button>
                    <button
                      onClick={() => window.location.href = '/help/api-setup'}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      Meer Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API Key Setup Benefits */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          🚀 Voordelen van Eigen API Key
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Onbeperkte AI functionaliteit</li>
          <li>• Snellere response tijden</li>
          <li>• Toegang tot nieuwste modellen</li>
          <li>• Geen token limieten</li>
          <li>• Volledige controle over je data</li>
        </ul>
        <div className="mt-3">
          <button
            onClick={() => window.location.href = '/settings/api-keys'}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            API Key Instellen
          </button>
        </div>
      </div>

      {/* Development Testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Development Testing:</h5>
          <div className="flex gap-2">
            <button
              onClick={() => simulateTokenUsage('grok-3', 85)}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
            >
              Simulate 85%
            </button>
            <button
              onClick={() => simulateTokenUsage('grok-3', 95)}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              Simulate 95%
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenUsageAlert;
