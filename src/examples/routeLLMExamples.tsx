/**
 * RouteLLM Quick Start Examples
 *
 * Copy-paste examples for immediate use
 */

// Consolidated imports
import { useState } from 'react';
import {
  routeLLMChat,
  quickRoute,
  estimateRouteCost,
  routeLLMConfigService
} from '../services/routing';
import { aiOrchestrationService } from '../services/aiOrchestrationService';

// =====================================================
// EXAMPLE 1: Simple Chat Query
// =====================================================

async function simpleExample() {
  const result = await routeLLMChat({
    query: "What's the best workout for building endurance?",
    feature: "wellness_analysis",
    privacyLevel: "PERSONAL",
    mbtiType: "ENFP"
  });

  if (result.response.success) {
    console.log('✅ Response:', result.response.content);
    console.log('💰 Cost:', result.actualCost.toFixed(4));
    console.log('🤖 Provider:', result.route.provider);
    console.log('📊 Model:', result.route.model);
  } else {
    console.error('❌ Error:', result.response.error);
  }
}

// =====================================================
// EXAMPLE 2: Quick One-Liner
// =====================================================

async function quickExample() {
  const response = await quickRoute(
    "Give me 3 motivational quotes",
    "creative_generation",
    "PUBLIC"
  );

  console.log(response);
}

// =====================================================
// EXAMPLE 3: Via AI Orchestration Service
// =====================================================

async function orchestrationExample() {
  const result = await aiOrchestrationService.routeLLMQuery({
    query: "Analyze my sleep patterns and suggest improvements",
    feature: "wellness_analysis",
    privacyLevel: "PERSONAL",
    mbtiType: "INTJ",
    context: {
      sleepData: [
        { date: '2024-01-01', hours: 7.5, quality: 'good' },
        { date: '2024-01-02', hours: 6.2, quality: 'poor' }
      ]
    }
  });

  console.log('Content:', result.content);
  console.log('Cost:', result.cost);
  console.log('Provider:', result.provider);
}

// =====================================================
// EXAMPLE 4: Cost Estimation Before Execution
// =====================================================

async function costEstimationExample() {
  const { estimatedCost } = await estimateRouteCost({
    query: "Write a poem about artificial intelligence",
    feature: "creative_generation",
    privacyLevel: "PUBLIC"
  });

  console.log(`Estimated cost: $${estimatedCost.toFixed(4)}`);
}

// =====================================================
// EXAMPLE 5: Privacy-First Routing
// =====================================================

async function privacyExample() {
  // SENSITIVE data always routes locally
  const sensitiveResult = await routeLLMChat({
    query: "My medical history includes...",
    feature: "wellness_analysis",
    privacyLevel: "SENSITIVE"
  });

  // PUBLIC data can use cloud providers
  const publicResult = await routeLLMChat({
    query: "What's trending in AI today?",
    feature: "chat_coaching",
    privacyLevel: "PUBLIC"
  });

  console.log('Sensitive (local):', sensitiveResult.route.provider);
  console.log('Public (cloud):', publicResult.route.provider);
}

// =====================================================
// EXAMPLE 6: Batch Processing with Cost Tracking
// =====================================================

async function batchExample() {
  const notifications = [
    { id: 1, text: "New friend request", hint: "low" },
    { id: 2, text: "Important meeting reminder", hint: "medium" },
    { id: 3, text: "Critical system alert", hint: "high" }
  ];

  console.log('Processing notifications...\n');

  for (const notif of notifications) {
    const result = await routeLLMChat({
      query: `Summarize: ${notif.text}`,
      feature: "notification_intelligence",
      privacyLevel: "PERSONAL",
      complexityHint: notif.hint as 'low' | 'medium' | 'high'
    });

    console.log(`[${notif.hint}] ${result.route.provider}/${result.route.model}`);
    console.log(`Cost: $${result.actualCost.toFixed(4)}\n`);
  }
}

// =====================================================
// EXAMPLE 7: Programmatic Config Changes
// =====================================================

async function configExample() {
  // Get current config
  const config = routeLLMConfigService.getConfig();
  console.log('Current optimization:', config.optimizationLevel);

  // Switch to aggressive mode (max savings)
  await routeLLMConfigService.setOptimizationLevel('aggressive');

  // Verify change
  const newConfig = routeLLMConfigService.getConfig();
  console.log('New optimization:', newConfig.optimizationLevel);
}

// =====================================================
// EXAMPLE 8: Error Handling
// =====================================================

async function errorHandlingExample() {
  try {
    const result = await routeLLMChat({
      query: "This might fail",
      feature: "chat_coaching",
      privacyLevel: "PUBLIC"
    });

    if (result.response.success) {
      console.log(result.response.content);
    } else {
      console.error('RouteLLM Error:', result.response.error);
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
  }
}

// =====================================================
// EXAMPLE 9: Feature-Specific Routing
// =====================================================

async function featureRoutingExample() {
  const features = [
    'chat_coaching',
    'wellness_analysis',
    'journal_analysis',
    'ai_orchestration',
    'pattern_recognition',
    'creative_generation'
  ];

  for (const feature of features) {
    const result = await routeLLMChat({
      query: `Process this ${feature} request`,
      feature: feature as any,
      privacyLevel: "PUBLIC"
    });

    console.log(`${feature}: ${result.route.provider}/${result.route.model}`);
  }
}

// =====================================================
// EXAMPLE 10: React Component Integration
// =====================================================

export function ChatComponent() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState(0);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    try {
      const result = await routeLLMChat({
        query,
        feature: "chat_coaching",
        privacyLevel: "PUBLIC"
      });

      if (result.response.success) {
        setResponse(result.response.content || '');
        setCost(result.actualCost);
      } else {
        setResponse(`Error: ${result.response.error}`);
      }
    } catch (error) {
      setResponse(`Unexpected error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>RouteLLM Chat</h3>
      <input
        type="text"
        placeholder="Ask anything..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const input = e.currentTarget as HTMLInputElement;
            handleSubmit(input.value);
            input.value = '';
          }
        }}
      />
      {loading && <div>Thinking...</div>}
      {response && (
        <div>
          <p>{response}</p>
          <small>Cost: ${cost.toFixed(4)}</small>
        </div>
      )}
    </div>
  );
}