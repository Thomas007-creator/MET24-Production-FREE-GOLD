/**
 * MainView Example - Met nieuw design system
 * 
 * Dit toont hoe je MainView componenten kunt maken met het nieuwe design system.
 * Alle styling is nu gecentraliseerd en makkelijk aan te passen.
 */

import React, { useState } from 'react';
import { 
  PageContainer, 
  ContentContainer, 
  GlassCard, 
  StyledButton, 
  PageHeader,
  StatusIndicator,
  AnimatedContainer,
  Spacer,
  Divider
} from '../ui/DesignSystem';

const MainViewExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleActionClick = (action: string) => {
    console.log('Action clicked:', action);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'coaching', label: 'AI Coaching', icon: '🤖' },
    { id: 'journal', label: 'Journal', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ];

  const quickActions = [
    { id: 'profile', label: 'Profiel', icon: '👤', variant: 'primary' as const },
    { id: 'chat', label: 'Chat', icon: '💬', variant: 'accent' as const },
    { id: 'communities', label: 'Community', icon: '👥', variant: 'secondary' as const },
    { id: 'analytics', label: 'Analytics', icon: '📊', variant: 'glass' as const },
  ];

  return (
    <PageContainer variant="mainview">
      <ContentContainer size="xl">
        {/* Header */}
        <AnimatedContainer animation="fade-in">
          <PageHeader
            title="Welkom terug, Thomas!"
            subtitle="Je persoonlijke AI-coaching dashboard"
            className="mb-8"
          />
        </AnimatedContainer>

        {/* Status Indicators */}
        <AnimatedContainer animation="slide-up" delay={0.1}>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <StatusIndicator status="connected" label="Database" />
            <StatusIndicator status="connected" label="AI Service" />
            <StatusIndicator status="connected" label="Sync" />
          </div>
        </AnimatedContainer>

        {/* Navigation Tabs */}
        <AnimatedContainer animation="scale-in" delay={0.2}>
          <GlassCard variant="strong" className="p-4 mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {tabs.map((tab) => (
                <StyledButton
                  key={tab.id}
                  variant={activeTab === tab.id ? 'accent' : 'glass'}
                  size="md"
                  onClick={() => handleTabClick(tab.id)}
                  className="flex items-center gap-2"
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </StyledButton>
              ))}
            </div>
          </GlassCard>
        </AnimatedContainer>

        {/* Quick Actions */}
        <AnimatedContainer animation="fade-in" delay={0.3}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Snelle Acties
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <GlassCard
                  key={action.id}
                  variant="light"
                  className="p-6 cursor-pointer hover-lift hover-glow-accent"
                  onClick={() => handleActionClick(action.id)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">{action.icon}</div>
                    <h3 className="text-lg font-semibold text-white">
                      {action.label}
                    </h3>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </AnimatedContainer>

        <Divider className="my-8" />

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Coaching Card */}
          <AnimatedContainer animation="slide-up" delay={0.4}>
            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">🤖</div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Coaching</h3>
                  <p className="text-white/80">Persoonlijke begeleiding</p>
                </div>
              </div>
              <p className="text-white/70 mb-4">
                Krijg gepersonaliseerde coaching op basis van je MBTI type en doelen.
              </p>
              <StyledButton
                variant="accent"
                onClick={() => handleActionClick('coaching')}
                className="w-full"
              >
                Start Coaching Sessie
              </StyledButton>
            </GlassCard>
          </AnimatedContainer>

          {/* Analytics Card */}
          <AnimatedContainer animation="slide-up" delay={0.5}>
            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">📊</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Analytics</h3>
                  <p className="text-white/80">Je voortgang</p>
                </div>
              </div>
              <p className="text-white/70 mb-4">
                Bekijk je voortgang en inzichten over je persoonlijke ontwikkeling.
              </p>
              <StyledButton
                variant="primary"
                onClick={() => handleActionClick('analytics')}
                className="w-full"
              >
                Bekijk Analytics
              </StyledButton>
            </GlassCard>
          </AnimatedContainer>

          {/* Journal Card */}
          <AnimatedContainer animation="slide-up" delay={0.6}>
            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">📝</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Journal</h3>
                  <p className="text-white/80">Reflectie & groei</p>
                </div>
              </div>
              <p className="text-white/70 mb-4">
                Schrijf over je ervaringen en krijg AI-inzichten over je groei.
              </p>
              <StyledButton
                variant="secondary"
                onClick={() => handleActionClick('journal')}
                className="w-full"
              >
                Open Journal
              </StyledButton>
            </GlassCard>
          </AnimatedContainer>

          {/* Community Card */}
          <AnimatedContainer animation="slide-up" delay={0.7}>
            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">👥</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Community</h3>
                  <p className="text-white/80">Connect & deel</p>
                </div>
              </div>
              <p className="text-white/70 mb-4">
                Verbind met anderen die werken aan persoonlijke ontwikkeling.
              </p>
              <StyledButton
                variant="glass"
                onClick={() => handleActionClick('community')}
                className="w-full"
              >
                Ga naar Community
              </StyledButton>
            </GlassCard>
          </AnimatedContainer>
        </div>

        <Spacer size="lg" />

        {/* Footer */}
        <AnimatedContainer animation="fade-in" delay={0.8}>
          <div className="text-center">
            <p className="text-sm text-white/60">
              Je bent ingelogd als Thomas (INTJ) • Laatste sync: 2 minuten geleden
            </p>
          </div>
        </AnimatedContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default MainViewExample;








