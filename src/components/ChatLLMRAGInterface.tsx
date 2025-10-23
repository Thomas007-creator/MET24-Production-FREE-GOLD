/**
 * ChatLLM RAG Interface Component
 * Retrieval-Augmented Generation UI voor MET24-V14-Production
 * 
 * Features:
 * - AI Coaching met journal context
 * - Content Discovery met MBTI optimization  
 * - Journal Analysis met community trends
 * - Wellness Check met personalized data
 * 
 * @version 1.0.0 - Complete RAG Implementation
 * @author Thomas - MET24 Production Team
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, SelectItem, Switch, Tabs, Tab, Chip, Progress } from '@nextui-org/react';
import { chatLLMRAGService, RAGQuery, RAGResponse } from '../services/chatLLMRAGService';
import { useAppStore } from '../store/useAppStore';

// Query Type Options
const QUERY_TYPES = [
  { value: 'ai_coaching', label: '🤖 AI Coaching', description: 'Personalized coaching met journal context' },
  { value: 'journal_analysis', label: '📔 Journal Analysis', description: 'Analyse van journal trends en patterns' },
  { value: 'content_discovery', label: '🔍 Content Discovery', description: 'Relevante content op basis van profiel' },
  { value: 'community_engagement', label: '🌐 Community Engagement', description: 'Community trends en MBTI patterns' },
  { value: 'wellness_check', label: '💚 Wellness Check', description: 'Holistische wellness assessment' },
  { value: 'goal_setting', label: '🎯 Goal Setting', description: 'Personalized goal recommendations' }
];

const CONTEXT_DEPTHS = [
  { value: 'shallow', label: 'Shallow', description: 'Basic profile only' },
  { value: 'medium', label: 'Medium', description: 'Profile + recent data' },
  { value: 'deep', label: 'Deep', description: 'Complete historical context' }
];

const TIME_RANGES = [
  { value: 'week', label: 'Past Week' },
  { value: 'month', label: 'Past Month' },
  { value: 'quarter', label: 'Past Quarter' },
  { value: 'year', label: 'Past Year' }
];

export const ChatLLMRAGInterface: React.FC = () => {
  const { userData } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [ragResults, setRAGResults] = useState<RAGResponse | null>(null);
  
  // RAG Query Configuration
  const [ragQuery, setRAGQuery] = useState<RAGQuery>({
    userId: userData?.id || 'demo_user',
    queryType: 'ai_coaching',
    userInput: '',
    contextDepth: 'medium',
    mbtiOptimization: true,
    includeJournalHistory: true,
    includeCommunityTrends: true,
    includeContentLibrary: true,
    timeRange: 'month'
  });

  // Example queries voor demonstration
  const EXAMPLE_QUERIES = {
    ai_coaching: "Ik voel me vastgelopen in mijn creatieve projecten. Hoe kan ik als INFP weer inspiratie vinden en mijn doelen bereiken?",
    journal_analysis: "Analyseer mijn recente journal entries en help me patronen te herkennen in mijn emotionele ontwikkeling.",
    content_discovery: "Welke artikelen, oefeningen en tools zouden perfect passen bij mijn huidige persoonlijke groei fase?",
    community_engagement: "Wat zijn de trends in mijn MBTI community en hoe kan ik meer betrokken raken?",
    wellness_check: "Geef me een holistische wellness check gebaseerd op mijn recente activiteit en humeur patronen.",
    goal_setting: "Help me realistische maar ambitieuze doelen te stellen voor de komende maand, gebaseerd op mijn profiel."
  };

  /**
   * 🧠 Process RAG Query
   */
  const handleRAGQuery = async () => {
    if (!ragQuery.userInput.trim()) {
      alert('Please enter your query');
      return;
    }

    setIsProcessing(true);
    setRAGResults(null);

    try {
      console.log('🔍 Processing RAG Query:', ragQuery);
      const result = await chatLLMRAGService.processRAGQuery(ragQuery);
      setRAGResults(result);
      
      console.log('✅ RAG Query Complete:', result);

    } catch (error) {
      console.error('❌ RAG Query Failed:', error);
      
      setRAGResults({
        success: false,
        ragContext: (chatLLMRAGService as any).getEmptyRAGContext(),
        augmentedPrompt: '',
        llmResponse: null,
        contextSources: [],
        relevanceMetrics: {},
        retrievalMetadata: {},
        processingTimeMs: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 📝 Set Example Query
   */
  const setExampleQuery = (queryType: string) => {
    setRAGQuery({
      ...ragQuery,
      queryType: queryType as any,
      userInput: EXAMPLE_QUERIES[queryType as keyof typeof EXAMPLE_QUERIES] || ''
    });
  };

  /**
   * 🎯 Update Query Configuration
   */
  const updateQueryConfig = (field: keyof RAGQuery, value: any) => {
    setRAGQuery({
      ...ragQuery,
      [field]: value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="flex flex-col items-start p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              🧠 ChatLLM RAG (Retrieval-Augmented Generation)
            </h1>
            <p className="text-white/80">
              AI-powered responses met complete kennisbank context: Profiel + Journal + Community + Content Library
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Chip color="primary" variant="flat">WatermelonDB V14</Chip>
              <Chip color="secondary" variant="flat">Supabase Integration</Chip>
              <Chip color="success" variant="flat">MBTI Optimization</Chip>
              <Chip color="warning" variant="flat">Privacy-First</Chip>
            </div>
          </CardHeader>

          <CardBody className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Query Configuration */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-white">🔧 RAG Configuration</h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    {/* Query Type */}
                    <Select
                      label="Query Type"
                      selectedKeys={[ragQuery.queryType]}
                      onSelectionChange={(keys) => {
                        const type = Array.from(keys)[0] as string;
                        updateQueryConfig('queryType', type);
                      }}
                    >
                      {QUERY_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </SelectItem>
                      ))}
                    </Select>

                    {/* Context Depth */}
                    <Select
                      label="Context Depth"
                      selectedKeys={[ragQuery.contextDepth]}
                      onSelectionChange={(keys) => {
                        const depth = Array.from(keys)[0] as string;
                        updateQueryConfig('contextDepth', depth);
                      }}
                    >
                      {CONTEXT_DEPTHS.map(depth => (
                        <SelectItem key={depth.value} value={depth.value}>
                          {depth.label} - {depth.description}
                        </SelectItem>
                      ))}
                    </Select>

                    {/* Time Range */}
                    <Select
                      label="Historical Data Range"
                      selectedKeys={[ragQuery.timeRange || 'month']}
                      onSelectionChange={(keys) => {
                        const range = Array.from(keys)[0] as string;
                        updateQueryConfig('timeRange', range);
                      }}
                    >
                      {TIME_RANGES.map(range => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </Select>

                    {/* Context Toggles */}
                    <div className="space-y-3">
                      <Switch
                        isSelected={ragQuery.mbtiOptimization}
                        onValueChange={(value) => updateQueryConfig('mbtiOptimization', value)}
                      >
                        <span className="text-white">MBTI Optimization</span>
                      </Switch>

                      <Switch
                        isSelected={ragQuery.includeJournalHistory}
                        onValueChange={(value) => updateQueryConfig('includeJournalHistory', value)}
                      >
                        <span className="text-white">Include Journal History</span>
                      </Switch>

                      <Switch
                        isSelected={ragQuery.includeCommunityTrends}
                        onValueChange={(value) => updateQueryConfig('includeCommunityTrends', value)}
                      >
                        <span className="text-white">Include Community Trends</span>
                      </Switch>

                      <Switch
                        isSelected={ragQuery.includeContentLibrary}
                        onValueChange={(value) => updateQueryConfig('includeContentLibrary', value)}
                      >
                        <span className="text-white">Include Content Library</span>
                      </Switch>
                    </div>

                    {/* Example Queries */}
                    <div>
                      <p className="text-white font-medium mb-2">💡 Example Queries:</p>
                      <div className="space-y-2">
                        {QUERY_TYPES.map(type => (
                          <Button
                            key={type.value}
                            size="sm"
                            variant="flat"
                            className="w-full justify-start text-left"
                            onClick={() => setExampleQuery(type.value)}
                          >
                            {type.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Right Column: Query Input & Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* Query Input */}
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-white">💭 Your Query</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <Textarea
                        label="Enter your query..."
                        value={ragQuery.userInput}
                        onValueChange={(value) => updateQueryConfig('userInput', value)}
                        placeholder="Ask anything about your personal development, journal insights, community trends, or content recommendations..."
                        rows={6}
                        classNames={{
                          input: "text-white",
                          label: "text-white/80"
                        }}
                      />

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={handleRAGQuery}
                          isLoading={isProcessing}
                          color="primary"
                          size="lg"
                          className="flex-1"
                          startContent={!isProcessing ? '🧠' : undefined}
                        >
                          {isProcessing ? 'Processing RAG Query...' : 'Generate RAG Response'}
                        </Button>

                        <Button
                          onClick={() => setRAGQuery({ ...ragQuery, userInput: '' })}
                          variant="flat"
                          size="lg"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* RAG Results */}
                {ragResults && (
                  <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-white">
                        {ragResults.success ? '✅ RAG Response' : '❌ Processing Failed'}
                      </h3>
                    </CardHeader>
                    <CardBody>
                      {ragResults.success ? (
                        <Tabs className="w-full">
                          {/* AI Response Tab */}
                          <Tab key="response" title="🤖 AI Response">
                            <div className="space-y-4 mt-4">
                              <div className="bg-black/20 p-6 rounded-lg text-white/90">
                                <div className="whitespace-pre-wrap">
                                  {typeof ragResults.llmResponse?.response === 'string' 
                                    ? ragResults.llmResponse.response 
                                    : JSON.stringify(ragResults.llmResponse?.response, null, 2)}
                                </div>
                              </div>

                              {/* Response Metadata */}
                              {ragResults.llmResponse?.recommendations && (
                                <div>
                                  <h4 className="text-white font-medium mb-2">💡 Key Recommendations:</h4>
                                  <ul className="list-disc list-inside text-white/80 space-y-1">
                                    {ragResults.llmResponse.recommendations.map((rec: string, idx: number) => (
                                      <li key={idx}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </Tab>

                          {/* Context Sources Tab */}
                          <Tab key="context" title="📊 Context Sources">
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/20 p-4 rounded-lg">
                                  <h4 className="text-white font-medium mb-2">📈 Relevance Metrics</h4>
                                  <div className="space-y-2">
                                    <div>
                                      <div className="flex justify-between text-sm text-white/80">
                                        <span>Overall Relevance</span>
                                        <span>{ragResults.ragContext.relevanceScore}/100</span>
                                      </div>
                                      <Progress 
                                        value={ragResults.ragContext.relevanceScore} 
                                        className="mt-1"
                                        color="primary"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-black/20 p-4 rounded-lg">
                                  <h4 className="text-white font-medium mb-2">🗃️ Data Sources</h4>
                                  <div className="space-y-1 text-sm text-white/80">
                                    {ragResults.contextSources.map((source, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span>
                                        <span>{source}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="bg-black/20 p-4 rounded-lg">
                                <h4 className="text-white font-medium mb-2">👤 User Profile Context</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/80">
                                  <div>
                                    <span className="font-medium">MBTI:</span>
                                    <p>{ragResults.ragContext.userProfile.mbtiType}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Mood:</span>
                                    <p>{ragResults.ragContext.userProfile.currentMood}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Goals:</span>
                                    <p>{ragResults.ragContext.userProfile.primaryGoals.length} active</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Values:</span>
                                    <p>{ragResults.ragContext.userProfile.coreValues.length} defined</p>
                                  </div>
                                </div>
                              </div>

                              {ragResults.ragContext.journalContext.recentEntries.length > 0 && (
                                <div className="bg-black/20 p-4 rounded-lg">
                                  <h4 className="text-white font-medium mb-2">📔 Journal Context</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-white/80">
                                    <div>
                                      <span className="font-medium">Entries:</span>
                                      <p>{ragResults.ragContext.journalContext.recentEntries.length}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Frequency:</span>
                                      <p>{ragResults.ragContext.journalContext.journalingFrequency}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Themes:</span>
                                      <p>{ragResults.ragContext.journalContext.thematicPatterns.length}</p>
                                    </div>
                                  </div>
                                  {ragResults.ragContext.journalContext.thematicPatterns.length > 0 && (
                                    <div className="mt-2">
                                      <span className="font-medium text-white/90">Key Themes: </span>
                                      <span className="text-white/70">
                                        {ragResults.ragContext.journalContext.thematicPatterns.slice(0, 5).join(', ')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </Tab>

                          {/* Debug Tab */}
                          <Tab key="debug" title="🔍 Debug Info">
                            <div className="space-y-4 mt-4">
                              <div className="bg-black/20 p-4 rounded-lg">
                                <h4 className="text-white font-medium mb-2">⚡ Performance</h4>
                                <div className="text-sm text-white/80 space-y-1">
                                  <p>Processing Time: {ragResults.processingTimeMs}ms</p>
                                  <p>RAG Enhanced: {ragResults.llmResponse?.ragEnhanced ? 'Yes' : 'No'}</p>
                                  <p>Orchestration Mode: {ragResults.llmResponse?.orchestrationMode || 'Unknown'}</p>
                                  <p>AI Confidence: {ragResults.llmResponse?.confidence || 'Unknown'}</p>
                                </div>
                              </div>

                              <div className="bg-black/20 p-4 rounded-lg">
                                <h4 className="text-white font-medium mb-2">🔍 Retrieval Metadata</h4>
                                <pre className="text-xs text-white/70 whitespace-pre-wrap">
                                  {JSON.stringify(ragResults.retrievalMetadata, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </Tab>
                        </Tabs>
                      ) : (
                        <div className="text-red-300 space-y-2">
                          <p>❌ RAG processing failed</p>
                          <p className="text-sm text-white/60">
                            Please check your configuration and try again.
                          </p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                )}

                {/* Instructions */}
                {!ragResults && (
                  <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20">
                    <CardBody className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">🎯 How RAG Works in MET24</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white/80">
                        <div>
                          <h4 className="font-medium text-white mb-2">🔍 Retrieval Phase:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            <li>User profiel (MBTI, waarden, goals)</li>
                            <li>Journal entries (themes, trends, mood)</li>
                            <li>Community data (Discourse, MBTI patterns)</li>
                            <li>Content library (artikelen, oefeningen)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">⚡ Augmentation Phase:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Context filtering op relevantie</li>
                            <li>MBTI-specific optimization</li>
                            <li>Prompt enrichment met data</li>
                            <li>AI Orchestration processing</li>
                          </ul>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ChatLLMRAGInterface;