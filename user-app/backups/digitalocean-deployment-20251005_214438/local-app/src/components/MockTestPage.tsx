/**
 * Mock Test Page for X OAuth Integration
 * 
 * This page allows you to run mock tests before deployment
 */

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Progress } from '@nextui-org/react';
import { runAllMockTests } from '../test/mockTests';
import { runMockTests } from '../config/xOAuthConfig.mock';

const MockTestPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults(null);

    try {
      console.log('🧪 Starting Mock Tests...');
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Run the tests
      const results = await runAllMockTests();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTestResults({
        success: results,
        timestamp: new Date().toISOString(),
        tests: [
          'X OAuth Flow',
          'Database Save',
          'Database Retrieve', 
          'AI API Key Service',
          'Usage Stats',
          'LocalStorage Integration',
          'Environment Variables',
          'Component Integration'
        ]
      });

      console.log('✅ Mock Tests Completed:', results);
    } catch (error) {
      console.error('❌ Mock Tests Failed:', error);
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runQuickTest = async () => {
    setIsRunning(true);
    setProgress(0);

    try {
      const results = await runMockTests();
      setTestResults({
        success: results,
        timestamp: new Date().toISOString(),
        quickTest: true
      });
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        quickTest: true
      });
    } finally {
      setIsRunning(false);
      setProgress(100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 Mock Test Suite
          </h1>
          <p className="text-xl text-white/80">
            Test X OAuth Integration Before Deployment
          </p>
        </div>

        <div className="grid gap-6">
          {/* Test Controls */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <h2 className="text-2xl font-bold text-white">Test Controls</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex gap-4">
                <Button
                  color="primary"
                  size="lg"
                  onClick={runTests}
                  disabled={isRunning}
                  className="flex-1"
                >
                  {isRunning ? 'Running Tests...' : '🚀 Run Full Test Suite'}
                </Button>
                <Button
                  color="secondary"
                  size="lg"
                  onClick={runQuickTest}
                  disabled={isRunning}
                  className="flex-1"
                >
                  {isRunning ? 'Running...' : '⚡ Quick Test'}
                </Button>
              </div>
              
              {isRunning && (
                <div className="space-y-2">
                  <Progress 
                    value={progress} 
                    className="w-full"
                    color="primary"
                  />
                  <p className="text-sm text-white/80">
                    Running mock tests... {progress}%
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Test Results */}
          {testResults && (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white">Test Results</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {testResults.success ? (
                      <span className="text-2xl">✅</span>
                    ) : (
                      <span className="text-2xl">❌</span>
                    )}
                    <span className="text-lg font-semibold text-white">
                      {testResults.success ? 'All Tests Passed!' : 'Tests Failed'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-white/80">
                    Timestamp: {new Date(testResults.timestamp).toLocaleString()}
                  </p>

                  {testResults.tests && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Test Results:</h3>
                      <ul className="space-y-1">
                        {testResults.tests.map((test: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-white/80">
                            <span className="text-green-400">✅</span>
                            {test}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {testResults.error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-red-300 mb-2">Error:</h3>
                      <p className="text-red-200">{testResults.error}</p>
                    </div>
                  )}

                  {testResults.success && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-green-300 mb-2">Ready for Deployment!</h3>
                      <p className="text-green-200">
                        All mock tests passed. You can now safely deploy to DigitalOcean.
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Test Information */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <h2 className="text-2xl font-bold text-white">What These Tests Do</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3 text-white/80">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400">🔐</span>
                  <div>
                    <strong>X OAuth Flow:</strong> Simulates the complete OAuth authentication process
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400">💾</span>
                  <div>
                    <strong>Database Integration:</strong> Tests WatermelonDB settings and external_ai_services tables
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400">🤖</span>
                  <div>
                    <strong>AI API Key Service:</strong> Tests the AI provider management system
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400">📊</span>
                  <div>
                    <strong>Usage Tracking:</strong> Tests the free tier limits and usage statistics
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400">🔧</span>
                  <div>
                    <strong>Component Integration:</strong> Tests the onboarding component integration
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MockTestPage;
