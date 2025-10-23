/**
 * Wellness Analysis Interface Component
 * 
 * Holistische welzijnsanalyse interface voor de 9 levensgebieden
 * Integreert met wellnessAnalysisChatLLM service voor MBTI-optimized analyse
 * 
 * Features:
 * - 9 levensgebieden overzicht met scores
 * - Holistische score berekening
 * - MBTI-specific insights en aanbevelingen
 * - Trend analysis en progress tracking
 * - Deep-dive area analysis
 * - Action planning en prioritering
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip, Tabs, Tab, Select, SelectItem, Divider } from '@nextui-org/react';
import { Brain, Heart, DollarSign, Briefcase, Palette, Sparkles, BookOpen, Users, Home, TrendingUp, TrendingDown, Minus, Zap, Target, Calendar, BarChart3, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import wellnessAnalysisChatLLM, { WellnessAnalysisResponse, LevensgebiedScore, WellnessAnalysisContext, LEVENSGEBIEDEN } from '../services/wellnessAnalysisChatLLM';

// Types
interface AnalysisView {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const analysisViews: AnalysisView[] = [
  {
    id: 'comprehensive',
    name: 'Holistische Analyse',
    description: 'Complete welzijnsanalyse van alle 9 gebieden',
    icon: <Target className="w-5 h-5" />
  },
  {
    id: 'trend_analysis',
    name: 'Trend Analyse',
    description: 'Ontwikkeling en vooruitgang over tijd',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 'action_planning',
    name: 'Actie Planning',
    description: 'Concrete stappen voor verbetering',
    icon: <Zap className="w-5 h-5" />
  }
];

const timeframes = [
  { value: 'week', label: 'Afgelopen Week' },
  { value: 'month', label: 'Afgelopen Maand' },
  { value: 'quarter', label: 'Afgelopen Kwartaal' },
  { value: 'year', label: 'Afgelopen Jaar' }
];

const WellnessAnalysisInterface: React.FC = () => {
  const { userData } = useAppStore();
  
  // State
  const [currentAnalysis, setCurrentAnalysis] = useState<WellnessAnalysisResponse | null>(null);
  const [levensgebiedScores, setLevensgebiedScores] = useState<LevensgebiedScore[]>([]);
  const [selectedView, setSelectedView] = useState('comprehensive');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [holisticScore, setHolisticScore] = useState(0);

  const mbtiType = userData?.mbtiType || 'INFP';
  const userId = userData?.id || 'demo_user';

  // Load initial wellness data
  useEffect(() => {
    loadWellnessData();
  }, [userId]);

  // Calculate holistic score when scores change
  useEffect(() => {
    if (levensgebiedScores.length > 0) {
      const totalScore = levensgebiedScores.reduce((sum, score) => sum + score.currentScore, 0);
      setHolisticScore(Math.round(totalScore / levensgebiedScores.length));
    }
  }, [levensgebiedScores]);

  // Helper functions
  const loadWellnessData = async () => {
    try {
      // For now, load mock data - in production this would come from database
      const mockScores: LevensgebiedScore[] = LEVENSGEBIEDEN.map(gebied => ({
        id: gebied.id,
        name: gebied.name,
        category: gebied.category,
        currentScore: 50 + Math.random() * 40, // 50-90 range
        baselineScore: 50 + Math.random() * 30,
        trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as any,
        lastUpdated: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Last week
        dataSource: Math.random() > 0.5 ? 'manual_refinement' : 'onboarding'
      }));
      
      setLevensgebiedScores(mockScores);
    } catch (error) {
      console.error('Error loading wellness data:', error);
    }
  };

  // Run wellness analysis
  const runWellnessAnalysis = async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    try {
      const context: WellnessAnalysisContext = {
        userId,
        mbtiType,
        analysisType: selectedView as any,
        timeframe: selectedTimeframe as any,
        currentScores: levensgebiedScores,
        focusAreas: levensgebiedScores
          .filter(score => score.currentScore < 60)
          .map(score => score.name)
      };
      
      const analysis = await wellnessAnalysisChatLLM.analyzeHolisticWellness(context);
      setCurrentAnalysis(analysis);
      
    } catch (error) {
      console.error('Wellness analysis error:', error);
      
      // Show fallback analysis
      setCurrentAnalysis({
        overallAnalysis: `Je holistische welzijnsscore is ${holisticScore}%. Als ${mbtiType} type heb je unieke sterke punten. Laten we samen kijken naar verbetering.`,
        levensgebiedInsights: levensgebiedScores.map(score => ({
          area: score.name,
          score: score.currentScore,
          interpretation: getScoreInterpretation(score.currentScore),
          mbtiAlignment: 'Gemiddelde prioriteit voor jouw type',
          strengthFactors: ['Basis stabiliteit'],
          challengeFactors: ['Ruimte voor groei'],
          improvementSuggestions: ['Verfijn scores via subpagina\'s'],
          relatedAreas: []
        })),
        mbtiSpecificGuidance: [`Als ${mbtiType} focus je op persoonlijke waarden en authentieke ontwikkeling`],
        trendAnalysis: [],
        actionRecommendations: [],
        holisticScore,
        improvementPriorities: getImprovementPriorities(),
        nextSteps: ['Bezoek levensgebied detailpagina\'s', 'Complete 4 vragen per gebied'],
        confidence: 0.7,
        analysisId: `fallback_${Date.now()}`
      });
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreInterpretation = (score: number): string => {
    if (score >= 80) return 'Uitstekend - dit gebied gaat heel goed';
    if (score >= 60) return 'Goed - stabiel niveau met ruimte voor groei';
    if (score >= 40) return 'Matig - aandacht nodig voor verbetering';
    return 'Uitdagend - prioriteit voor ontwikkeling';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getImprovementPriorities = (): string[] => {
    return levensgebiedScores
      .filter(score => score.currentScore < 60)
      .sort((a, b) => a.currentScore - b.currentScore)
      .slice(0, 3)
      .map(score => score.name);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevensgebiedIcon = (areaId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'psychischeGezondheid': <Brain className="w-5 h-5" />,
      'lichamelijkeGezondheid': <Heart className="w-5 h-5" />,
      'financieen': <DollarSign className="w-5 h-5" />,
      'werkCarriere': <Briefcase className="w-5 h-5" />,
      'creativiteitHobbys': <Palette className="w-5 h-5" />,
      'actiefInBeelding': <Sparkles className="w-5 h-5" />,
      'persoonlijkeOntwikkeling': <BookOpen className="w-5 h-5" />,
      'socialeRelaties': <Users className="w-5 h-5" />,
      'thuisOmgeving': <Home className="w-5 h-5" />
    };
    
    return iconMap[areaId] || <Target className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Wellness Analysis</h1>
                  <p className="text-gray-300">Holistische welzijnsanalyse met MBTI-optimalisatie</p>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-4">
                <Select
                  placeholder="Timeframe"
                  selectedKeys={[selectedTimeframe]}
                  onSelectionChange={(keys) => setSelectedTimeframe(Array.from(keys)[0] as string)}
                  className="w-48"
                  size="sm"
                >
                  {timeframes.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label}
                    </SelectItem>
                  ))}
                </Select>
                
                <Button
                  color="primary"
                  onClick={runWellnessAnalysis}
                  isLoading={isAnalyzing}
                  startContent={isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                >
                  {isAnalyzing ? 'Analyseert...' : 'Start Analyse'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls & Holistic Score */}
          <div className="space-y-6">
            {/* Analysis Type Selection */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Analyse Type</h2>
              </CardHeader>
              <CardBody className="space-y-3">
                {analysisViews.map((view) => (
                  <Button
                    key={view.id}
                    variant={selectedView === view.id ? "solid" : "flat"}
                    color={selectedView === view.id ? "primary" : "default"}
                    className="w-full justify-start"
                    startContent={view.icon}
                    onClick={() => setSelectedView(view.id)}
                  >
                    <div className="text-left flex-1">
                      <div className="font-medium">{view.name}</div>
                      <div className="text-xs text-gray-400">{view.description}</div>
                    </div>
                  </Button>
                ))}
              </CardBody>
            </Card>

            {/* Holistic Score */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Holistische Score
                </h2>
              </CardHeader>
              <CardBody>
                <div className="text-center space-y-4">
                  <div className={`text-6xl font-bold ${getScoreColor(holisticScore)}`}>
                    {holisticScore}%
                  </div>
                  <Progress
                    value={holisticScore}
                    color={holisticScore >= 80 ? 'success' : holisticScore >= 60 ? 'primary' : holisticScore >= 40 ? 'warning' : 'danger'}
                    className="w-full"
                    size="lg"
                  />
                  <p className="text-sm text-gray-300">
                    Gebaseerd op {levensgebiedScores.length} levensgebieden
                  </p>
                  <Chip
                    color={holisticScore >= 60 ? 'success' : 'warning'}
                    variant="flat"
                    size="sm"
                  >
                    {mbtiType} Optimized
                  </Chip>
                </div>
              </CardBody>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Quick Stats</h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sterke gebieden:</span>
                  <span className="text-green-400 font-medium">
                    {levensgebiedScores.filter(s => s.currentScore >= 70).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Aandachtsgebieden:</span>
                  <span className="text-yellow-400 font-medium">
                    {levensgebiedScores.filter(s => s.currentScore < 60).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Verbeterende trends:</span>
                  <span className="text-blue-400 font-medium">
                    {levensgebiedScores.filter(s => s.trend === 'improving').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Data sources:</span>
                  <span className="text-purple-400 font-medium">
                    {levensgebiedScores.filter(s => s.dataSource === 'manual_refinement').length} verfijnd
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Center Panel - Levensgebieden Overview */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">9 Levensgebieden</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 gap-3">
                  {levensgebiedScores.map((score) => (
                    <div
                      key={score.id}
                      className={`p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer transition-all hover:bg-white/10 hover:border-white/20 ${selectedArea === score.id ? 'ring-2 ring-purple-500' : ''}`}
                      onClick={() => setSelectedArea(selectedArea === score.id ? null : score.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-purple-400">
                            {getLevensgebiedIcon(score.id)}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{score.name}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                              {getTrendIcon(score.trend)}
                              <span>{score.dataSource === 'manual_refinement' ? 'Verfijnd' : 'Baseline'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(score.currentScore)}`}>
                            {Math.round(score.currentScore)}%
                          </div>
                          <Progress
                            value={score.currentScore}
                            color={score.currentScore >= 60 ? 'success' : 'warning'}
                            className="w-16"
                            size="sm"
                          />
                        </div>
                      </div>
                      
                      {/* Expanded area details */}
                      {selectedArea === score.id && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="text-xs text-gray-300 space-y-1">
                            <div>Baseline: {Math.round(score.baselineScore)}%</div>
                            {score.refinedScore && (
                              <div>Verfijnd: {Math.round(score.refinedScore)}%</div>
                            )}
                            <div>Laatste update: {new Date(score.lastUpdated).toLocaleDateString()}</div>
                            <div className="mt-2">
                              <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to area detail page
                                  window.open(`/back-to-basics/${score.id}`, '_blank');
                                }}
                              >
                                Verfijn in Detail Pagina
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="space-y-6">
            {currentAnalysis ? (
              <>
                {/* Overall Analysis */}
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-white">AI Analyse</h2>
                    <Chip color="success" size="sm" variant="flat">
                      Confidence: {Math.round(currentAnalysis.confidence * 100)}%
                    </Chip>
                  </CardHeader>
                  <CardBody>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {currentAnalysis.overallAnalysis}
                    </p>
                  </CardBody>
                </Card>

                {/* MBTI Guidance */}
                {currentAnalysis.mbtiSpecificGuidance.length > 0 && (
                  <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                    <CardHeader>
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        {mbtiType} Guidance
                      </h2>
                    </CardHeader>
                    <CardBody className="space-y-2">
                      {currentAnalysis.mbtiSpecificGuidance.map((guidance, idx) => (
                        <div key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{guidance}</span>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                )}

                {/* Improvement Priorities */}
                {currentAnalysis.improvementPriorities.length > 0 && (
                  <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                    <CardHeader>
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Prioriteiten
                      </h2>
                    </CardHeader>
                    <CardBody className="space-y-2">
                      {currentAnalysis.improvementPriorities.map((priority, idx) => (
                        <Chip
                          key={idx}
                          color="warning"
                          variant="flat"
                          size="sm"
                          className="mr-2 mb-2"
                        >
                          {priority}
                        </Chip>
                      ))}
                    </CardBody>
                  </Card>
                )}

                {/* Next Steps */}
                {currentAnalysis.nextSteps.length > 0 && (
                  <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                    <CardHeader>
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Volgende Stappen
                      </h2>
                    </CardHeader>
                    <CardBody className="space-y-2">
                      {currentAnalysis.nextSteps.map((step, idx) => (
                        <div key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-green-400 font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                )}
              </>
            ) : (
              /* No Analysis Yet */
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardBody className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-full w-fit mx-auto">
                      <BarChart3 className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Start Wellness Analyse</h3>
                      <p className="text-gray-300 mb-4">
                        Klik op "Start Analyse" om een holistische welzijnsanalyse 
                        te krijgen die perfect aansluit bij je {mbtiType} persoonlijkheidstype.
                      </p>
                      <Button
                        color="primary"
                        size="lg"
                        onClick={runWellnessAnalysis}
                        startContent={<Zap className="w-5 h-5" />}
                      >
                        Start {selectedView === 'comprehensive' ? 'Holistische' : selectedView === 'trend_analysis' ? 'Trend' : 'Actie'} Analyse
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessAnalysisInterface;