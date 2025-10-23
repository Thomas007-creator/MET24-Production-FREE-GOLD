import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Textarea, Chip, Spinner } from '@nextui-org/react';
import { chatLLMService } from '../services/chatLLMService';
import { useAppStore } from '../store/useAppStore';

const MET23PO23Interface: React.FC = () => {
  const [selectedMBTI, setSelectedMBTI] = useState<string>('');
  const [challenges, setChallenges] = useState<string[]>([]);
  const [deepSeekQuery, setDeepSeekQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { userData } = useAppStore();

  const mbtiTypes = [
    'INTJ', 'INFJ', 'INFP', 'INTP',
    'ENTJ', 'ENFJ', 'ENFP', 'ENTP', 
    'ISTJ', 'ISFJ', 'ISFP', 'ISTP',
    'ESTJ', 'ESFJ', 'ESFP', 'ESTP'
  ];

  const commonChallenges = [
    'stress', 'angst', 'depressie', 'lichaamsspanning',
    'identiteitscrisis', 'relatieproblemen', 'doelloosheid',
    'zingevingscrisis', 'overspanning', 'slaapproblemen'
  ];

  const handleChallengeToggle = (challenge: string) => {
    setChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  const handleIndividuatieAnalyse = async () => {
    if (!selectedMBTI || challenges.length === 0) {
      setError('Selecteer een MBTI type en minimaal één uitdaging');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await chatLLMService.processMET23PO23Individuatie(
        selectedMBTI,
        challenges,
        deepSeekQuery || undefined,
        userData
      );

      if (response.success) {
        setResult(response.result);
      } else {
        setError(response.error || 'Onbekende fout opgetreden');
      }
    } catch (err) {
      console.error('MET2.3/PO2.3 Error:', err);
      setError('Er is een fout opgetreden bij de individuatie analyse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader className="text-center">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-white mb-2">
                🌀 MET2.3/PO2.3 Holistisch Individuatie
              </h1>
              <p className="text-blue-200">
                Meta Emanatie Theorie 2.3 + Psychosomatische Osteopathie 2.3
              </p>
              <p className="text-sm text-blue-300 mt-2">
                Holistisch raamwerk voor post-2027 persoonlijke autoriteit en navigatie
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Input Form */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody className="space-y-6">
            
            {/* MBTI Selection */}
            <div>
              <label className="block text-white font-semibold mb-3">
                🧭 MBTI Persoonlijkheidstype
              </label>
              <Select
                placeholder="Selecteer je MBTI type"
                value={selectedMBTI}
                onChange={(e) => setSelectedMBTI(e.target.value)}
                className="max-w-xs"
              >
                {mbtiTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Challenges Selection */}
            <div>
              <label className="block text-white font-semibold mb-3">
                ⚡ Huidige Uitdagingen & Symptomen
              </label>
              <div className="flex flex-wrap gap-2">
                {commonChallenges.map((challenge) => (
                  <Chip
                    key={challenge}
                    variant={challenges.includes(challenge) ? "solid" : "bordered"}
                    color={challenges.includes(challenge) ? "primary" : "default"}
                    className="cursor-pointer"
                    onClick={() => handleChallengeToggle(challenge)}
                  >
                    {challenge}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Optional DeepSeek Query */}
            <div>
              <label className="block text-white font-semibold mb-3">
                🌳 Optionele DeepSeek Domain Query
              </label>
              <Textarea
                placeholder="Bijvoorbeeld: 'Hoe kan ik balans vinden tussen creativiteit en spiritualiteit in mijn levenspad?'"
                value={deepSeekQuery}
                onChange={(e) => setDeepSeekQuery(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Action Button */}
            <Button
              color="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={handleIndividuatieAnalyse}
              disabled={loading || !selectedMBTI || challenges.length === 0}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Genereren Individuatie Profiel...
                </>
              ) : (
                '🌀 Genereer MET2.3/PO2.3 Individuatie Profiel'
              )}
            </Button>

          </CardBody>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-500/20 border border-red-500/30">
            <CardBody>
              <p className="text-red-200">❌ {error}</p>
            </CardBody>
          </Card>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-4">
            
            {/* Framework Info */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h3 className="text-xl font-bold text-white">
                  📊 {result.framework} Analyse voor {result.individuationProfile?.mbtiType}
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Evolutionaire Fase:</h4>
                    <p className="text-blue-200">{result.individuationProfile?.evolutionaryPhase}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Dominante Domeinen:</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.individuationProfile?.dominantDomains?.map((domain: string, index: number) => (
                        <Chip key={index} size="sm" color="secondary">
                          {domain}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* AI Insights */}
            {result.aiInsights && (
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <h3 className="text-xl font-bold text-white">🤖 AI Orchestration Insights</h3>
                </CardHeader>
                <CardBody>
                  <div className="text-blue-100 whitespace-pre-wrap">
                    {typeof result.aiInsights === 'string' 
                      ? result.aiInsights 
                      : JSON.stringify(result.aiInsights, null, 2)
                    }
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Recommendations */}
            {result.recommendation && (
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <h3 className="text-xl font-bold text-white">💎 MET2.3/PO2.3 Aanbevelingen</h3>
                </CardHeader>
                <CardBody>
                  <div className="text-blue-100 whitespace-pre-wrap">
                    {result.recommendation}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* DeepSeek Integration */}
            {result.deepSeekIntegration && (
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <h3 className="text-xl font-bold text-white">🌳 DeepSeek Domain Insights</h3>
                </CardHeader>
                <CardBody>
                  <div className="text-blue-100 whitespace-pre-wrap">
                    {result.deepSeekIntegration}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Meta Structure */}
            {result.metaStructure && (
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <h3 className="text-xl font-bold text-white">🏗️ MET2.3 Domein Structuur</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {result.metaStructure.met23_domains?.map((domain: any, index: number) => (
                      <div key={index} className="border border-white/20 rounded-lg p-3">
                        <h4 className="text-white font-semibold">{domain.name}</h4>
                        <p className="text-blue-200 text-sm mb-2">{domain.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {domain.keyVariables?.map((variable: string, idx: number) => (
                            <Chip key={idx} size="sm" variant="bordered">
                              {variable}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default MET23PO23Interface;