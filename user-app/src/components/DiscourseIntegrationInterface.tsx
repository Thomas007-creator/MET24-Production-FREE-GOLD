/**
 * Discourse Integration Interface Component
 * UI voor ChatLLM Discourse Support feature
 * 
 * Features:
 * - Technical issue reporting and analysis
 * - Community engagement assistance  
 * - API compatibility checking
 * - Real-time Discourse monitoring
 * 
 * @version 1.0.0
 * @author Thomas - MET24 Production
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, SelectItem, Chip, Tabs, Tab } from '@nextui-org/react';
import { chatLLMService } from '../services/chatLLMService';
import { useAppStore } from '../store/useAppStore';

// Discourse Issue Types
const ISSUE_CATEGORIES = [
  { value: 'api_error', label: 'API Connection Errors', description: 'OpenAI, Anthropic connectivity issues' },
  { value: 'plugin_conflict', label: 'Plugin Conflicts', description: 'Discourse AI plugin compatibility' },
  { value: 'model_compatibility', label: 'Model Compatibility', description: 'o1-mini, GPT-4 model issues' },
  { value: 'ssl_certificate', label: 'SSL/Certificate', description: 'HTTPS, embedding SSL errors' },
  { value: 'rate_limiting', label: 'Rate Limiting', description: 'API quota and limits' },
  { value: 'embedding_failure', label: 'Embedding Failures', description: 'Vector embeddings not working' }
];

const SEVERITY_LEVELS = [
  { value: 'critical', label: 'Critical', color: 'danger' },
  { value: 'high', label: 'High', color: 'warning' },
  { value: 'medium', label: 'Medium', color: 'primary' },
  { value: 'low', label: 'Low', color: 'success' }
];

const PLATFORM_TYPES = [
  { value: 'self_hosted', label: 'Self-Hosted' },
  { value: 'hosted', label: 'Discourse Hosted' },
  { value: 'enterprise', label: 'Enterprise' }
];

export const DiscourseIntegrationInterface: React.FC = () => {
  const { userData } = useAppStore();
  const [activeTab, setActiveTab] = useState('issue_analysis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Issue Analysis State
  const [issueData, setIssueData] = useState({
    category: '',
    severity: 'medium',
    description: '',
    platform: 'self_hosted',
    environment: {
      os: 'Ubuntu 24.04',
      docker: true,
      discourseVersion: '',
      pluginVersion: ''
    },
    apiProviders: ['openai'],
    errorLogs: [''],
    attempted_solutions: ['']
  });

  // Community Engagement State
  const [engagementData, setEngagementData] = useState({
    engagement_type: 'troubleshooting',
    technical_level: 'intermediate',
    content: '',
    requires_ai_assistance: true,
    suggested_response_tone: 'technical'
  });

  // API Compatibility State
  const [apiCheckData, setApiCheckData] = useState({
    provider: 'openai',
    models: ['gpt-4o', 'gpt-4o-mini'],
    version: 'latest'
  });

  /**
   * 🔧 Process Technical Issue Analysis
   */
  const handleIssueAnalysis = async () => {
    if (!issueData.category || !issueData.description) {
      alert('Please fill in category and description');
      return;
    }

    setIsProcessing(true);
    setResults(null);

    try {
      const request = {
        feature: 'discourse_support' as const,
        input: {
          text: `Discourse Technical Issue: ${issueData.description}`,
          sensitivityLevel: 'PUBLIC' as const,
          mbtiType: userData?.mbtiType || 'INTJ'
        },
        data: {
          issue: {
            id: `issue_${Date.now()}`,
            ...issueData
          }
        },
        options: {
          mbtiOptimization: true,
          fallbackEnabled: true
        },
        privacy: {
          allowExternalAPI: false,
          sanitizationLevel: 'STANDARD' as const,
          auditLevel: 'DETAILED' as const,
          encryptOutput: false
        }
      };

      const response = await chatLLMService.processDiscourseSupport(
        request,
        userData,
        `audit_${Date.now()}`
      );

      setResults(response);

    } catch (error) {
      console.error('Discourse issue analysis failed:', error);
      setResults({
        success: false,
        error: `Analysis failed: ${error}`,
        result: {
          type: 'error',
          message: 'Unable to analyze issue. Please try again or check the logs.'
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 💬 Generate Community Response
   */
  const handleCommunityEngagement = async () => {
    if (!engagementData.content) {
      alert('Please provide content for community response');
      return;
    }

    setIsProcessing(true);
    setResults(null);

    try {
      const request = {
        feature: 'discourse_support' as const,
        input: {
          text: `Community Engagement: ${engagementData.content}`,
          sensitivityLevel: 'PUBLIC' as const,
          mbtiType: userData?.mbtiType || 'ENFJ'
        },
        data: {
          engagement: {
            user_id: userData?.id || 'community_user',
            topic_id: `topic_${Date.now()}`,
            ...engagementData
          },
          content: engagementData.content
        }
      };

      const response = await chatLLMService.processDiscourseSupport(
        request,
        userData,
        `audit_${Date.now()}`
      );

      setResults(response);

    } catch (error) {
      console.error('Community engagement failed:', error);
      setResults({
        success: false,
        error: `Response generation failed: ${error}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 📊 Check API Compatibility
   */
  const handleAPICompatibilityCheck = async () => {
    setIsProcessing(true);
    setResults(null);

    try {
      const request = {
        feature: 'discourse_support' as const,
        input: {
          text: `API Compatibility Check: ${apiCheckData.provider}`,
          sensitivityLevel: 'PUBLIC' as const,
          mbtiType: userData?.mbtiType || 'ISTJ'
        },
        data: {
          api_check: apiCheckData
        }
      };

      const response = await chatLLMService.processDiscourseSupport(
        request,
        userData,
        `audit_${Date.now()}`
      );

      setResults(response);

    } catch (error) {
      console.error('API compatibility check failed:', error);
      setResults({
        success: false,
        error: `Compatibility check failed: ${error}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="flex flex-col items-start p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              💬 Discourse AI Integration Support
            </h1>
            <p className="text-white/80">
              ChatLLM-powered assistance voor Discourse technical issues en community engagement
            </p>
          </CardHeader>

          <CardBody className="p-6">
            <Tabs 
              selectedKey={activeTab} 
              onSelectionChange={(key) => setActiveTab(key as string)}
              className="w-full"
            >
              {/* Technical Issue Analysis Tab */}
              <Tab key="issue_analysis" title="🔧 Technical Issues">
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Issue Category"
                      value={issueData.category}
                      onSelectionChange={(value) => setIssueData({...issueData, category: value as string})}
                      className="text-white"
                    >
                      {ISSUE_CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label} - {category.description}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Severity"
                      value={issueData.severity}
                      onSelectionChange={(value) => setIssueData({...issueData, severity: value as string})}
                    >
                      {SEVERITY_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                      label="Platform Type"
                      value={issueData.platform}
                      onSelectionChange={(value) => setIssueData({...issueData, platform: value as string})}
                    >
                      {PLATFORM_TYPES.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Discourse Version"
                      value={issueData.environment.discourseVersion}
                      onValueChange={(value) => setIssueData({
                        ...issueData,
                        environment: { ...issueData.environment, discourseVersion: value }
                      })}
                      placeholder="e.g., 3.2.0"
                    />

                    <Input
                      label="Plugin Version"
                      value={issueData.environment.pluginVersion}
                      onValueChange={(value) => setIssueData({
                        ...issueData,
                        environment: { ...issueData.environment, pluginVersion: value }
                      })}
                      placeholder="e.g., latest"
                    />
                  </div>

                  <Textarea
                    label="Issue Description"
                    value={issueData.description}
                    onValueChange={(value) => setIssueData({...issueData, description: value})}
                    placeholder="Describe the technical issue in detail..."
                    rows={4}
                  />

                  <Textarea
                    label="Error Logs"
                    value={issueData.errorLogs.join('\n')}
                    onValueChange={(value) => setIssueData({
                      ...issueData,
                      errorLogs: value.split('\n').filter(line => line.trim())
                    })}
                    placeholder="Paste relevant error logs here..."
                    rows={6}
                  />

                  <Button
                    onClick={handleIssueAnalysis}
                    isLoading={isProcessing && activeTab === 'issue_analysis'}
                    color="primary"
                    size="lg"
                    className="w-full"
                  >
                    🔧 Analyze Technical Issue
                  </Button>
                </div>
              </Tab>

              {/* Community Engagement Tab */}
              <Tab key="community_engagement" title="💬 Community Response">
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Engagement Type"
                      value={engagementData.engagement_type}
                      onSelectionChange={(value) => setEngagementData({
                        ...engagementData,
                        engagement_type: value as string
                      })}
                    >
                      <SelectItem key="question" value="question">Question</SelectItem>
                      <SelectItem key="answer" value="answer">Answer</SelectItem>
                      <SelectItem key="discussion" value="discussion">Discussion</SelectItem>
                      <SelectItem key="troubleshooting" value="troubleshooting">Troubleshooting</SelectItem>
                    </Select>

                    <Select
                      label="Technical Level"
                      value={engagementData.technical_level}
                      onSelectionChange={(value) => setEngagementData({
                        ...engagementData,
                        technical_level: value as string
                      })}
                    >
                      <SelectItem key="beginner" value="beginner">Beginner</SelectItem>
                      <SelectItem key="intermediate" value="intermediate">Intermediate</SelectItem>
                      <SelectItem key="advanced" value="advanced">Advanced</SelectItem>
                      <SelectItem key="expert" value="expert">Expert</SelectItem>
                    </Select>
                  </div>

                  <Select
                    label="Response Tone"
                    value={engagementData.suggested_response_tone}
                    onSelectionChange={(value) => setEngagementData({
                      ...engagementData,
                      suggested_response_tone: value as string
                    })}
                  >
                    <SelectItem key="technical" value="technical">Technical</SelectItem>
                    <SelectItem key="supportive" value="supportive">Supportive</SelectItem>
                    <SelectItem key="educational" value="educational">Educational</SelectItem>
                    <SelectItem key="collaborative" value="collaborative">Collaborative</SelectItem>
                  </Select>

                  <Textarea
                    label="Original Content"
                    value={engagementData.content}
                    onValueChange={(value) => setEngagementData({...engagementData, content: value})}
                    placeholder="Paste the original forum post or discussion content..."
                    rows={8}
                  />

                  <Button
                    onClick={handleCommunityEngagement}
                    isLoading={isProcessing && activeTab === 'community_engagement'}
                    color="secondary"
                    size="lg"
                    className="w-full"
                  >
                    💬 Generate Community Response
                  </Button>
                </div>
              </Tab>

              {/* API Compatibility Tab */}
              <Tab key="api_compatibility" title="📊 API Compatibility">
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="API Provider"
                      value={apiCheckData.provider}
                      onSelectionChange={(value) => setApiCheckData({
                        ...apiCheckData,
                        provider: value as string
                      })}
                    >
                      <SelectItem key="openai" value="openai">OpenAI</SelectItem>
                      <SelectItem key="anthropic" value="anthropic">Anthropic</SelectItem>
                      <SelectItem key="huggingface" value="huggingface">Hugging Face</SelectItem>
                      <SelectItem key="local" value="local">Local Models</SelectItem>
                    </Select>

                    <Input
                      label="Discourse Version"
                      value={apiCheckData.version}
                      onValueChange={(value) => setApiCheckData({...apiCheckData, version: value})}
                      placeholder="e.g., latest, 3.2.0"
                    />
                  </div>

                  <div>
                    <p className="text-white mb-2">Models to Check:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {apiCheckData.models.map((model, index) => (
                        <Chip
                          key={index}
                          onClose={() => setApiCheckData({
                            ...apiCheckData,
                            models: apiCheckData.models.filter((_, i) => i !== index)
                          })}
                          variant="flat"
                        >
                          {model}
                        </Chip>
                      ))}
                    </div>
                    <Input
                      placeholder="Add model name..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            setApiCheckData({
                              ...apiCheckData,
                              models: [...apiCheckData.models, input.value.trim()]
                            });
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>

                  <Button
                    onClick={handleAPICompatibilityCheck}
                    isLoading={isProcessing && activeTab === 'api_compatibility'}
                    color="success"
                    size="lg"
                    className="w-full"
                  >
                    📊 Check API Compatibility
                  </Button>
                </div>
              </Tab>
            </Tabs>

            {/* Results Display */}
            {results && (
              <Card className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-white">
                    {results.success ? '✅ Analysis Results' : '❌ Analysis Failed'}
                  </h3>
                </CardHeader>
                <CardBody>
                  {results.success ? (
                    <div className="space-y-4">
                      {results.result?.type === 'technical_analysis' && (
                        <div>
                          <h4 className="text-lg font-medium text-white mb-2">Technical Issue Analysis</h4>
                          <div className="bg-black/20 p-4 rounded-lg text-white/90">
                            <p><strong>Confidence:</strong> {results.result.confidence}%</p>
                            <p><strong>Issue ID:</strong> {results.result.issue_id}</p>
                            {results.result.recommendations && (
                              <div className="mt-4">
                                <p className="font-medium">Immediate Actions:</p>
                                <ul className="list-disc list-inside mt-2">
                                  {results.result.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {results.result?.type === 'community_response' && (
                        <div>
                          <h4 className="text-lg font-medium text-white mb-2">Community Response</h4>
                          <div className="bg-black/20 p-4 rounded-lg text-white/90 whitespace-pre-wrap">
                            {typeof results.result.response === 'string' 
                              ? results.result.response 
                              : JSON.stringify(results.result.response, null, 2)}
                          </div>
                        </div>
                      )}

                      {results.result?.type === 'api_compatibility' && (
                        <div>
                          <h4 className="text-lg font-medium text-white mb-2">API Compatibility Report</h4>
                          <div className="bg-black/20 p-4 rounded-lg text-white/90">
                            <p><strong>Overall Status:</strong> {results.result.compatibility_report?.overall_status}</p>
                            <p><strong>Risk Assessment:</strong> {results.result.compatibility_report?.risk_assessment}</p>
                            {results.result.recommendations && (
                              <div className="mt-4">
                                <p className="font-medium">Recommendations:</p>
                                <ul className="list-disc list-inside mt-2">
                                  {results.result.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {results.result?.type === 'general_support' && (
                        <div>
                          <h4 className="text-lg font-medium text-white mb-2">General Support Response</h4>
                          <div className="bg-black/20 p-4 rounded-lg text-white/90 whitespace-pre-wrap">
                            {typeof results.result.response === 'string' 
                              ? results.result.response 
                              : JSON.stringify(results.result.response, null, 2)}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="mt-6 text-sm text-white/60">
                        <p>Processing Time: {results.metadata?.processingTimeMs}ms</p>
                        <p>Model: {results.metadata?.modelUsed}</p>
                        <p>Privacy Compliant: {results.metadata?.privacyCompliant ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-300">
                      <p>Error: {results.error}</p>
                      {results.result?.message && (
                        <p className="mt-2">{results.result.message}</p>
                      )}
                      {results.result?.resources && (
                        <div className="mt-4">
                          <p className="font-medium">Helpful Resources:</p>
                          <ul className="list-disc list-inside mt-2">
                            {results.result.resources.map((resource: string, idx: number) => (
                              <li key={idx}>
                                <a href={resource} target="_blank" rel="noopener noreferrer" 
                                   className="text-blue-400 hover:underline">
                                  {resource}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DiscourseIntegrationInterface;