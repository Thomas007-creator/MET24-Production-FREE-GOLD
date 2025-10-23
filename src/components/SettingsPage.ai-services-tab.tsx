import React from 'react';
import { Card, CardHeader, CardBody, Switch, Input, Button, Chip, Divider } from '@nextui-org/react';
import { getProviderDisplayName, getProviderDescription } from '../services/providers/validationService';
import { useSettingsPage } from './SettingsPage.provider';

export const SettingsPageAIServicesTab: React.FC = () => {
  const {
    aiProviders,
    routeLLMConfig,
    updateAIProvider,
    validateAndSaveAPIKey,
    handleOptimizationLevelChange,
    handleFallbackToLocalChange,
  } = useSettingsPage();

  const handleProviderToggle = (provider: keyof typeof aiProviders, enabled: boolean) => {
    updateAIProvider(provider, { enabled });
  };

  const handleAPIKeyChange = (provider: keyof typeof aiProviders, apiKey: string) => {
    updateAIProvider(provider, { apiKey });
  };

  const handleValidateAPIKey = async (provider: keyof typeof aiProviders) => {
    const success = await validateAndSaveAPIKey(provider);
    if (success) {
      alert('✅ API Key validated and saved!');
    } else {
      alert('❌ Invalid API Key');
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Tier Info */}
      <Card className="glass border border-[rgba(100,223,223,0.2)]">
        <CardHeader>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>🆓</span>
            Current Tier: FREE
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="space-y-2">
            <p className="text-gray-300">Je gebruikt momenteel het gratis lokale AI model (Phi-2)</p>
            <div className="space-y-1 text-sm">
              <p className="text-green-400">✅ 100% Privacy & Offline</p>
              <p className="text-green-400">✅ Onbeperkt gebruik</p>
              <p className="text-green-400">✅ Geen API keys nodig</p>
              <p className="text-yellow-400">⚠️ Beperkte features & kwaliteit</p>
            </div>
          </div>
          <Button
            color="primary"
            variant="shadow"
            size="lg"
            className="w-full"
            startContent={<span>💎</span>}
          >
            Upgrade naar PRO - $10/maand
          </Button>
        </CardBody>
      </Card>

      {/* Pro Tier - AI Providers */}
      <Card className="glass border border-[rgba(100,223,223,0.2)]">
        <CardHeader>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>💎</span>
            PRO Tier - BYOK (Bring Your Own Key)
          </h3>
        </CardHeader>
        <CardBody className="space-y-6">
          <p className="text-gray-300 text-sm">
            Unlock advanced features met je eigen API keys. Geschatte kosten: $15-35/maand
            (betaald direct aan providers, niet aan ons)
          </p>

          {/* Anthropic Provider */}
          <div className="space-y-3 p-4 rounded-lg bg-[rgba(255,255,255,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <span>🧠</span>
                  {getProviderDisplayName('anthropic')}
                </h4>
                <p className="text-sm text-gray-400">{getProviderDescription('anthropic')}</p>
              </div>
              <Switch
                isSelected={aiProviders.anthropic.enabled}
                onValueChange={(enabled) => handleProviderToggle('anthropic', enabled)}
              />
            </div>

            {aiProviders.anthropic.enabled && (
              <div className="space-y-3">
                <Input
                  type="password"
                  label="API Key"
                  placeholder="sk-ant-..."
                  value={aiProviders.anthropic.apiKey}
                  onChange={(e) => handleAPIKeyChange('anthropic', e.target.value)}
                  endContent={
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => handleValidateAPIKey('anthropic')}
                    >
                      Validate
                    </Button>
                  }
                />
                <div className="flex gap-2 flex-wrap">
                  <Chip size="sm" variant="flat">Opus</Chip>
                  <Chip size="sm" variant="flat">Sonnet</Chip>
                  <Chip size="sm" variant="flat">Haiku</Chip>
                </div>
                <a
                  href="https://console.anthropic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  How to get Anthropic API key →
                </a>
              </div>
            )}
          </div>

          {/* xAI Provider */}
          <div className="space-y-3 p-4 rounded-lg bg-[rgba(255,255,255,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <span>🚀</span>
                  {getProviderDisplayName('xai')}
                  <Chip size="sm" color="success" variant="flat">NEW!</Chip>
                </h4>
                <p className="text-sm text-gray-400">{getProviderDescription('xai')}</p>
              </div>
              <Switch
                isSelected={aiProviders.xai.enabled}
                onValueChange={(enabled) => handleProviderToggle('xai', enabled)}
              />
            </div>

            {aiProviders.xai.enabled && (
              <div className="space-y-3">
                <Input
                  type="password"
                  label="API Key"
                  placeholder="xai-..."
                  value={aiProviders.xai.apiKey}
                  onChange={(e) => handleAPIKeyChange('xai', e.target.value)}
                  endContent={
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => handleValidateAPIKey('xai')}
                    >
                      Validate
                    </Button>
                  }
                />
                <div className="flex gap-2 flex-wrap">
                  <Chip size="sm" variant="flat">Grok-3</Chip>
                  <Chip size="sm" variant="flat">Grok-3-mini</Chip>
                </div>
                <a
                  href="https://x.ai/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  How to get xAI API key →
                </a>
              </div>
            )}
          </div>

          {/* OpenAI Provider */}
          <div className="space-y-3 p-4 rounded-lg bg-[rgba(255,255,255,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <span>🤖</span>
                  {getProviderDisplayName('openai')}
                </h4>
                <p className="text-sm text-gray-400">{getProviderDescription('openai')}</p>
              </div>
              <Switch
                isSelected={aiProviders.openai.enabled}
                onValueChange={(enabled) => handleProviderToggle('openai', enabled)}
              />
            </div>

            {aiProviders.openai.enabled && (
              <div className="space-y-3">
                <Input
                  type="password"
                  label="API Key"
                  placeholder="sk-..."
                  value={aiProviders.openai.apiKey}
                  onChange={(e) => handleAPIKeyChange('openai', e.target.value)}
                  endContent={
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => handleValidateAPIKey('openai')}
                    >
                      Validate
                    </Button>
                  }
                />
                <div className="flex gap-2 flex-wrap">
                  <Chip size="sm" variant="flat">GPT-4</Chip>
                  <Chip size="sm" variant="flat">GPT-4o</Chip>
                  <Chip size="sm" variant="flat">GPT-4o-mini</Chip>
                  <Chip size="sm" variant="flat">GPT-3.5-turbo</Chip>
                </div>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  How to get OpenAI API key →
                </a>
              </div>
            )}
          </div>

          {/* Google Provider */}
          <div className="space-y-3 p-4 rounded-lg bg-[rgba(255,255,255,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <span>🔍</span>
                  {getProviderDisplayName('google')}
                </h4>
                <p className="text-sm text-gray-400">{getProviderDescription('google')}</p>
              </div>
              <Switch
                isSelected={aiProviders.google.enabled}
                onValueChange={(enabled) => handleProviderToggle('google', enabled)}
              />
            </div>

            {aiProviders.google.enabled && (
              <div className="space-y-3">
                <Input
                  type="password"
                  label="API Key"
                  placeholder="AIza..."
                  value={aiProviders.google.apiKey}
                  onChange={(e) => handleAPIKeyChange('google', e.target.value)}
                  endContent={
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => handleValidateAPIKey('google')}
                    >
                      Validate
                    </Button>
                  }
                />
                <div className="flex gap-2 flex-wrap">
                  <Chip size="sm" variant="flat">Gemini Pro</Chip>
                  <Chip size="sm" variant="flat">Gemini Ultra</Chip>
                </div>
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  How to get Google API key →
                </a>
              </div>
            )}
          </div>

          {/* Abacus.AI Provider */}
          <div className="space-y-3 p-4 rounded-lg bg-[rgba(255,255,255,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <span>🌐</span>
                  {getProviderDisplayName('abacus')}
                </h4>
                <p className="text-sm text-gray-400">{getProviderDescription('abacus')}</p>
              </div>
              <Switch
                isSelected={aiProviders.abacus.enabled}
                onValueChange={(enabled) => handleProviderToggle('abacus', enabled)}
              />
            </div>

            {aiProviders.abacus.enabled && (
              <div className="space-y-3">
                <Input
                  type="password"
                  label="API Key"
                  placeholder="abacus_..."
                  value={aiProviders.abacus.apiKey}
                  onChange={(e) => handleAPIKeyChange('abacus', e.target.value)}
                  endContent={
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => handleValidateAPIKey('abacus')}
                    >
                      Validate
                    </Button>
                  }
                />
                <div className="flex gap-2 flex-wrap">
                  <Chip size="sm" variant="flat" color="warning">Grok-4</Chip>
                  <Chip size="sm" variant="flat" color="secondary">Claude 4.1 Opus</Chip>
                  <Chip size="sm" variant="flat" color="success">GPT-5</Chip>
                  <Chip size="sm" variant="flat" color="primary">Gemini 2.5 Pro</Chip>
                  <Chip size="sm" variant="flat">Gemini 2.5 Flash</Chip>
                  <Chip size="sm" variant="flat" color="danger">Qwen-2.5-Coder</Chip>
                </div>
                <a
                  href="https://abacus.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Get Abacus.AI API key →
                </a>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* RouteLLM Configuration */}
      <Card className="glass border border-[rgba(100,223,223,0.2)]">
        <CardHeader>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>💰</span>
            RouteLLM Cost Optimization
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-gray-300 text-sm">
            RouteLLM selecteert automatisch het beste AI model voor elke query,
            zodat je 60-75% bespaart op API kosten.
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={routeLLMConfig.optimizationLevel === 'aggressive'}
                onChange={() => handleOptimizationLevelChange('aggressive')}
                className="w-4 h-4"
              />
              <div>
                <p className="text-white font-medium">Aggressive</p>
                <p className="text-sm text-gray-400">Maximale besparingen (goedkoopste modellen)</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={routeLLMConfig.optimizationLevel === 'balanced'}
                onChange={() => handleOptimizationLevelChange('balanced')}
                className="w-4 h-4"
              />
              <div>
                <p className="text-white font-medium">Balanced (Aanbevolen)</p>
                <p className="text-sm text-gray-400">Optimale mix van kwaliteit en kosten</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={routeLLMConfig.optimizationLevel === 'quality_first'}
                onChange={() => handleOptimizationLevelChange('quality_first')}
                className="w-4 h-4"
              />
              <div>
                <p className="text-white font-medium">Quality First</p>
                <p className="text-sm text-gray-400">Beste kwaliteit (duurdere modellen)</p>
              </div>
            </label>
          </div>

          <Divider />

          <Switch
            isSelected={routeLLMConfig.fallbackToLocal}
            onValueChange={handleFallbackToLocalChange}
          >
            <div className="ml-2">
              <p className="text-white font-medium">Fallback naar lokaal model</p>
              <p className="text-sm text-gray-400">Gebruik Phi-2 als API's falen</p>
            </div>
          </Switch>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-blue-400 text-sm">
              💡 <strong>Tip:</strong> Met RouteLLM bespaar je gemiddeld 60-75% op API kosten
              vergeleken met alleen premium modellen gebruiken.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};