// 🧪 MPNet L12-v2 Test Component for MET24
// React component to test all-MiniLM-L12-v2 implementation in the app

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Progress, Textarea } from '@nextui-org/react';
import { mpnetL12EmbeddingService } from '../../services/mpnetL12EmbeddingService';
import { mpnetIntegrationService } from '../../services/mpnetIntegrationService';

interface TestResult {
  test: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  duration?: number;
  data?: any;
}

const MPNetTestComponent: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { test: 'Model Initialization', status: 'pending', message: 'Waiting to start...' },
    { test: 'Embedding Generation', status: 'pending', message: 'Waiting to start...' },
    { test: 'Dutch Language Test', status: 'pending', message: 'Waiting to start...' },
    { test: 'MBTI Personality Test', status: 'pending', message: 'Waiting to start...' },
    { test: 'Similarity Calculation', status: 'pending', message: 'Waiting to start...' },
    { test: 'Performance Test', status: 'pending', message: 'Waiting to start...' }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);
  const [customText, setCustomText] = useState('Ik ben een INFP en zoek balans in mijn leven');
  const [customResult, setCustomResult] = useState<any>(null);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    setCurrentTest(0);

    try {
      // Test 1: Model Initialization
      updateTest(0, { status: 'running', message: 'Initializing all-MiniLM-L12-v2...' });
      const initStart = Date.now();
      await mpnetL12EmbeddingService.initialize();
      const initDuration = Date.now() - initStart;
      updateTest(0, {
        status: 'success',
        message: `Model loaded successfully in ${initDuration}ms`,
        duration: initDuration
      });
      setCurrentTest(1);

      // Test 2: Embedding Generation
      updateTest(1, { status: 'running', message: 'Generating test embedding...' });
      const embeddingStart = Date.now();
      const testText = "Ik voel me gestrest en zoek balans in mijn leven";
      const embeddingResult = await mpnetL12EmbeddingService.generateEmbedding(testText);
      const embeddingDuration = Date.now() - embeddingStart;
      updateTest(1, {
        status: 'success',
        message: `Generated ${embeddingResult.dimensions}-dim embedding in ${embeddingResult.inferenceTime}ms`,
        duration: embeddingDuration,
        data: { dimensions: embeddingResult.dimensions, inference: embeddingResult.inferenceTime }
      });
      setCurrentTest(2);

      // Test 3: Dutch Language Test
      updateTest(2, { status: 'running', message: 'Testing Dutch language support...' });
      const dutchTexts = [
        "Persoonlijkheidsontwikkeling door zelfreflectie",
        "MBTI coaching voor introvert personen"
      ];
      const dutchResults = await Promise.all(
        dutchTexts.map(text => mpnetL12EmbeddingService.generateEmbedding(text))
      );
      const avgDutchInference = dutchResults.reduce((sum: number, r: any) => sum + r.inferenceTime, 0) / dutchResults.length;
      updateTest(2, {
        status: 'success',
        message: `Dutch processing: ${avgDutchInference.toFixed(1)}ms average`,
        data: { averageInference: avgDutchInference }
      });
      setCurrentTest(3);

      // Test 4: MBTI Personality Test
      updateTest(3, { status: 'running', message: 'Testing MBTI-specific functions...' });
      const personalityData = {
        mbtiType: 'INFP',
        traits: ['empathetic', 'creative', 'idealistic'],
        challenges: ['stress management', 'time organization'],
        goals: ['work-life balance', 'emotional regulation']
      };
      const personalityResult = await mpnetL12EmbeddingService.generatePersonalityEmbedding(personalityData);
      updateTest(3, {
        status: 'success',
        message: `MBTI embedding generated in ${personalityResult.inferenceTime}ms`,
        data: { inference: personalityResult.inferenceTime }
      });
      setCurrentTest(4);

      // Test 5: Similarity Calculation
      updateTest(4, { status: 'running', message: 'Testing similarity calculation...' });
      const text1 = "INFP personality coaching";
      const text2 = "INFP persoonlijkheid begeleiding";
      const similarity = await mpnetIntegrationService.analyzeContentSimilarity(text1, text2);
      updateTest(4, {
        status: 'success',
        message: `Similarity: ${similarity.similarity.toFixed(3)} (Dutch/English)`,
        data: { similarity: similarity.similarity }
      });
      setCurrentTest(5);

      // Test 6: Performance Test
      updateTest(5, { status: 'running', message: 'Running performance benchmark...' });
      const perfTexts = [
        "INFP stress management techniques",
        "ENFP creative energy optimization",
        "ISTJ structured daily routines",
        "ENFJ empathetic leadership skills"
      ];
      const perfResult = await mpnetL12EmbeddingService.runPerformanceTest(perfTexts);
      updateTest(5, {
        status: 'success',
        message: `Performance: ${perfResult.averageInferenceTime.toFixed(1)}ms avg, ${perfResult.throughput.toFixed(1)} texts/sec`,
        data: { 
          avgInference: perfResult.averageInferenceTime,
          throughput: perfResult.throughput
        }
      });

    } catch (error) {
      updateTest(currentTest, {
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testCustomText = async () => {
    if (!customText.trim()) return;

    try {
      const result = await mpnetL12EmbeddingService.generateEmbedding(customText);
      setCustomResult(result);
    } catch (error) {
      setCustomResult({
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'running': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'running': return '🔄';
      default: return '⏳';
    }
  };

  const completedTests = tests.filter(t => t.status === 'success').length;
  const progressValue = (completedTests / tests.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
          <CardBody className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              🤖 all-MiniLM-L12-v2 Test Suite
            </h1>
            <p className="text-white/70">
              Testing high-quality embedding generation for MBTI coaching
            </p>
            <div className="mt-4">
              <Progress 
                value={progressValue} 
                color={isRunning ? "warning" : "success"}
                className="max-w-md mx-auto"
              />
              <p className="text-white/60 mt-2">{completedTests}/{tests.length} tests completed</p>
            </div>
          </CardBody>
        </Card>

        {/* Test Results */}
        <div className="grid gap-4 mb-6">
          {tests.map((test, index) => (
            <Card 
              key={index}
              className={`bg-white/10 backdrop-blur-xl border border-white/20 ${
                test.status === 'running' ? 'ring-2 ring-yellow-400/50' : ''
              }`}
            >
              <CardBody>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {getStatusIcon(test.status)} {test.test}
                    </h3>
                    <p className="text-white/70 mt-1">{test.message}</p>
                    {test.data && (
                      <div className="mt-2 text-sm text-white/50">
                        {JSON.stringify(test.data, null, 2)}
                      </div>
                    )}
                  </div>
                  {test.duration && (
                    <div className="text-right text-white/60">
                      <div className="text-sm">Duration</div>
                      <div className="font-mono">{test.duration}ms</div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
          <CardBody>
            <div className="flex gap-4 justify-center">
              <Button
                color="primary"
                size="lg"
                onClick={runTests}
                disabled={isRunning}
                className="font-semibold"
              >
                {isRunning ? '🔄 Running Tests...' : '🚀 Run All Tests'}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Custom Text Test */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody>
            <h3 className="text-xl font-semibold text-white mb-4">
              🧪 Custom Text Test
            </h3>
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter your text to test embedding generation..."
              className="mb-4"
              rows={3}
            />
            <div className="flex gap-4 mb-4">
              <Button
                color="secondary"
                onClick={testCustomText}
                disabled={!customText.trim()}
              >
                Generate Embedding
              </Button>
            </div>
            {customResult && (
              <div className="bg-black/20 rounded-lg p-4">
                {customResult.error ? (
                  <div className="text-red-400">
                    ❌ Error: {customResult.error}
                  </div>
                ) : (
                  <div className="text-white/80">
                    <div>✅ Embedding generated successfully!</div>
                    <div>📏 Dimensions: {customResult.dimensions}</div>
                    <div>⚡ Inference time: {customResult.inferenceTime}ms</div>
                    <div>🔧 Model: {customResult.model}</div>
                    <div className="mt-2 text-xs text-white/50">
                      First 10 values: [{customResult.embedding.slice(0, 10).map((v: number) => v.toFixed(4)).join(', ')}...]
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default MPNetTestComponent;