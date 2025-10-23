/**
 * V14 Audit Integration Test Route
 * 
 * Test pagina voor WatermelonDB ↔ Supabase audit_events integratie
 * Toegankelijk via /test-v14-audit-integration
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button, Chip, Divider, Textarea } from '@nextui-org/react';
import V14AuditIntegrationTest from '../../tests/v14AuditIntegrationTest';

interface TestResult {
  step: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
  error?: any;
}

const V14AuditIntegrationTestPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState(false);

  // Test statistics
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalCount = results.length;

  /**
   * Run integration test
   */
  const runTest = async () => {
    setIsRunning(true);
    setResults([]);
    setLogs([]);
    setHasRun(false);

    try {
      addLog('🚀 Starting V14 Audit Events Integration Test...');
      
      const test = new V14AuditIntegrationTest();
      const testResults = await test.runFullTest();
      
      setResults(testResults);
      setHasRun(true);
      addLog('✅ Test completed successfully');
      
    } catch (error) {
      addLog(`❌ Test failed: ${error}`);
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Add log entry
   */
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  /**
   * Clear results
   */
  const clearResults = () => {
    setResults([]);
    setLogs([]);
    setHasRun(false);
  };

  /**
   * Get status icon
   */
  const getStatusIcon = (status: 'success' | 'error') => {
    return status === 'success' ? 
      <span className="text-green-500 text-lg">✅</span> :
      <span className="text-red-500 text-lg">❌</span>;
  };

  /**
   * Get step status color
   */
  const getStepColor = (status: 'success' | 'error') => {
    return status === 'success' ? 'success' : 'danger';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  V14 Audit Integration Test
                </h1>
                <p className="text-white/70 mt-1">
                  Test WatermelonDB ↔ Supabase audit_events sync na MINIMAL deployment
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  color="primary"
                  size="lg"
                  startContent={<span>▶️</span>}
                  onClick={runTest}
                  isLoading={isRunning}
                  disabled={isRunning}
                >
                  {isRunning ? 'Running...' : 'Run Test'}
                </Button>
                <Button
                  color="default"
                  size="lg"
                  startContent={<span>🔄</span>}
                  onClick={clearResults}
                  disabled={isRunning}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Test Results Overview */}
        {hasRun && (
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold text-white">Test Results Overview</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalCount}</div>
                  <div className="text-white/70 text-sm">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{successCount}</div>
                  <div className="text-white/70 text-sm">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{errorCount}</div>
                  <div className="text-white/70 text-sm">Failed</div>
                </div>
                <div className="text-center">
                  <Chip
                    color={errorCount === 0 ? 'success' : 'danger'}
                    variant="flat"
                    size="lg"
                  >
                    {errorCount === 0 ? '✅ ALL PASSED' : '❌ SOME FAILED'}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Test Steps */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Test Steps</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {results.length === 0 && !isRunning && (
                <div className="text-white/60 text-center py-8">
                  Click "Run Test" to start integration testing
                </div>
              )}
              
              {isRunning && results.length === 0 && (
                <div className="text-white/60 text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
                  Initializing test suite...
                </div>
              )}

              {results.map((result, index) => (
                <div key={index} className="border border-white/10 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium text-white">
                          {result.step.replace(/_/g, ' ').toUpperCase()}
                        </div>
                        <div className="text-white/70 text-sm mt-1">
                          {result.message}
                        </div>
                      </div>
                    </div>
                    <Chip
                      color={getStepColor(result.status)}
                      size="sm"
                      variant="flat"
                    >
                      {result.status.toUpperCase()}
                    </Chip>
                  </div>
                  
                  {result.data && (
                    <div className="mt-3 p-2 bg-white/5 rounded text-xs">
                      <div className="text-white/50 mb-1">Data:</div>
                      <pre className="text-white/70 whitespace-pre-wrap">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {result.error && (
                    <div className="mt-3 p-2 bg-red-500/10 rounded text-xs">
                      <div className="text-red-300 mb-1">Error:</div>
                      <pre className="text-red-200 whitespace-pre-wrap">
                        {typeof result.error === 'string' ? result.error : JSON.stringify(result.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Live Logs */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Live Test Logs</h2>
            </CardHeader>
            <CardBody>
              <Textarea
                value={logs.join('\n')}
                readOnly
                minRows={20}
                maxRows={25}
                className="font-mono text-sm"
                classNames={{
                  input: "text-white/80 bg-transparent",
                  inputWrapper: "bg-black/20 border border-white/10"
                }}
                placeholder="Test logs will appear here..."
              />
            </CardBody>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Test Information</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
              <div>
                <h3 className="font-semibold text-white mb-2">What This Test Does:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Creates audit events in WatermelonDB locally</li>
                  <li>• Tests direct Supabase function calls</li>
                  <li>• Validates WatermelonDB → Supabase sync</li>
                  <li>• Checks data integrity between systems</li>
                  <li>• Cleans up test data automatically</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Prerequisites:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Supabase MINIMAL deployment completed</li>
                  <li>• audit_events table exists in Supabase</li>
                  <li>• create_v14_audit_event function available</li>
                  <li>• Valid Supabase environment variables</li>
                  <li>• WatermelonDB V14 database initialized</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default V14AuditIntegrationTestPage;