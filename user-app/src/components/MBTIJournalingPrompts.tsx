import React, { useState } from 'react';
import { Card, CardBody, Button, Chip } from '@nextui-org/react';
import { useAppStore } from '../store/useAppStore';

interface MBTIPrompt {
  id: string;
  title: string;
  description: string;
  category: 'self-awareness' | 'relationships' | 'growth' | 'creativity' | 'values';
  mbtiTypes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  tags: string[];
}

interface MBTIJournalingPromptsProps {
  onSelectPrompt: (prompt: MBTIPrompt) => void;
  onClose: () => void;
}

const MBTIJournalingPrompts: React.FC<MBTIJournalingPromptsProps> = ({
  onSelectPrompt,
  onClose
}) => {
  const { userData } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const mbtiType = userData?.mbtiType || 'INFP';

  // MBTI-specifieke journaling prompts
  const prompts: MBTIPrompt[] = [
    // INFP/ENFP prompts
    {
      id: 'infp_1',
      title: 'Mijn Innerlijke Waarden Verkenning',
      description: 'Ontdek welke waarden het meest belangrijk zijn voor jou en hoe ze je dagelijkse keuzes beïnvloeden.',
      category: 'values',
      mbtiTypes: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
      difficulty: 'beginner',
      estimatedTime: 15,
      tags: ['waarden', 'authenticiteit', 'zelfreflectie']
    },
    {
      id: 'infp_2',
      title: 'Creatieve Expressie en Emoties',
      description: 'Verbind je emoties met creatieve uitdrukking. Hoe kun je je gevoelens omzetten in kunst, muziek of schrijven?',
      category: 'creativity',
      mbtiTypes: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
      difficulty: 'intermediate',
      estimatedTime: 20,
      tags: ['creativiteit', 'emoties', 'expressie']
    },
    {
      id: 'infp_3',
      title: 'Empathie en Grenzen',
      description: 'Reflecteer op hoe je empathie gebruikt en waar je grenzen moet stellen om je eigen energie te beschermen.',
      category: 'relationships',
      mbtiTypes: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
      difficulty: 'intermediate',
      estimatedTime: 18,
      tags: ['empathie', 'grenzen', 'energie']
    },
    
    // INTJ/ENTJ prompts
    {
      id: 'intj_1',
      title: 'Strategische Levensplanning',
      description: 'Analyseer je lange-termijn doelen en ontwikkel een concrete strategie om ze te bereiken.',
      category: 'growth',
      mbtiTypes: ['INTJ', 'ENTJ', 'INTP', 'ENTP'],
      difficulty: 'advanced',
      estimatedTime: 25,
      tags: ['strategie', 'doelen', 'planning']
    },
    {
      id: 'intj_2',
      title: 'Efficiëntie en Productiviteit',
      description: 'Evalueer je huidige systemen en processen. Hoe kun je je effectiviteit verbeteren?',
      category: 'growth',
      mbtiTypes: ['INTJ', 'ENTJ', 'ISTJ', 'ESTJ'],
      difficulty: 'intermediate',
      estimatedTime: 20,
      tags: ['efficiëntie', 'productiviteit', 'systemen']
    },
    
    // ISFJ/ESFJ prompts
    {
      id: 'isfj_1',
      title: 'Zorg voor Anderen vs. Zelfzorg',
      description: 'Balans tussen het helpen van anderen en het zorgen voor jezelf. Waar liggen jouw grenzen?',
      category: 'relationships',
      mbtiTypes: ['ISFJ', 'ESFJ', 'ISFP', 'ESFP'],
      difficulty: 'beginner',
      estimatedTime: 15,
      tags: ['zorg', 'balans', 'zelfzorg']
    },
    {
      id: 'isfj_2',
      title: 'Traditie en Verandering',
      description: 'Hoe verhoud je je tot tradities? Welke wil je behouden en welke wil je veranderen?',
      category: 'values',
      mbtiTypes: ['ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'],
      difficulty: 'intermediate',
      estimatedTime: 18,
      tags: ['traditie', 'verandering', 'waarden']
    },
    
    // ISTP/ESTP prompts
    {
      id: 'istp_1',
      title: 'Praktische Probleemoplossing',
      description: 'Reflecteer op een recent probleem dat je hebt opgelost. Wat was je aanpak en wat leerde je ervan?',
      category: 'growth',
      mbtiTypes: ['ISTP', 'ESTP', 'ISTJ', 'ESTJ'],
      difficulty: 'beginner',
      estimatedTime: 12,
      tags: ['probleemoplossing', 'praktisch', 'leren']
    },
    {
      id: 'istp_2',
      title: 'Onafhankelijkheid en Samenwerking',
      description: 'Hoe balanseer je je behoefte aan onafhankelijkheid met de voordelen van samenwerking?',
      category: 'relationships',
      mbtiTypes: ['ISTP', 'ESTP', 'INTP', 'ENTP'],
      difficulty: 'intermediate',
      estimatedTime: 16,
      tags: ['onafhankelijkheid', 'samenwerking', 'balans']
    },
    
    // Universele prompts
    {
      id: 'universal_1',
      title: 'Dagelijkse Reflectie',
      description: 'Wat ging goed vandaag? Wat zou je anders willen doen? Wat leerde je over jezelf?',
      category: 'self-awareness',
      mbtiTypes: ['ALL'],
      difficulty: 'beginner',
      estimatedTime: 10,
      tags: ['dagelijks', 'reflectie', 'groei']
    },
    {
      id: 'universal_2',
      title: 'Gratitude en Waardering',
      description: 'Schrijf over drie dingen waar je vandaag dankbaar voor bent en waarom ze belangrijk voor je zijn.',
      category: 'self-awareness',
      mbtiTypes: ['ALL'],
      difficulty: 'beginner',
      estimatedTime: 8,
      tags: ['gratitude', 'waardering', 'positief']
    }
  ];

  // Filter prompts based on MBTI type, category, and difficulty
  const filteredPrompts = prompts.filter(prompt => {
    const mbtiMatch = prompt.mbtiTypes.includes(mbtiType) || prompt.mbtiTypes.includes('ALL');
    const categoryMatch = selectedCategory === 'all' || prompt.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || prompt.difficulty === selectedDifficulty;
    
    return mbtiMatch && categoryMatch && difficultyMatch;
  });

  const categories = [
    { id: 'all', label: 'Alle', icon: '🌟' },
    { id: 'self-awareness', label: 'Zelfbewustzijn', icon: '🔍' },
    { id: 'relationships', label: 'Relaties', icon: '💕' },
    { id: 'growth', label: 'Groei', icon: '🌱' },
    { id: 'creativity', label: 'Creativiteit', icon: '🎨' },
    { id: 'values', label: 'Waarden', icon: '⭐' }
  ];

  const difficulties = [
    { id: 'all', label: 'Alle', color: 'default' },
    { id: 'beginner', label: 'Beginner', color: 'success' },
    { id: 'intermediate', label: 'Gemiddeld', color: 'warning' },
    { id: 'advanced', label: 'Gevorderd', color: 'danger' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      beginner: 'text-green-400',
      intermediate: 'text-yellow-400',
      advanced: 'text-red-400'
    };
    return colors[difficulty] || 'text-gray-400';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'self-awareness': '🔍',
      'relationships': '💕',
      'growth': '🌱',
      'creativity': '🎨',
      'values': '⭐'
    };
    return icons[category] || '📝';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                🧠 MBTI Journaling Prompts
              </h2>
              <p className="text-gray-300">
                Gepersonaliseerde prompts voor jouw {mbtiType} persoonlijkheidstype
              </p>
            </div>
            <Button
              color="danger"
              variant="light"
              onClick={onClose}
              className="text-white"
            >
              ✕
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Categorie</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    size="sm"
                    variant={selectedCategory === category.id ? 'solid' : 'bordered'}
                    color={selectedCategory === category.id ? 'primary' : 'default'}
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-white"
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-2">Moeilijkheidsgraad</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty.id}
                    size="sm"
                    variant={selectedDifficulty === difficulty.id ? 'solid' : 'bordered'}
                    color={selectedDifficulty === difficulty.id ? 'primary' : 'default'}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className="text-white"
                  >
                    {difficulty.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Prompts List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((prompt) => (
                <Card
                  key={prompt.id}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => onSelectPrompt(prompt)}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{getCategoryIcon(prompt.category)}</span>
                          <h3 className="font-semibold text-white">{prompt.title}</h3>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{prompt.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {prompt.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              size="sm"
                              variant="flat"
                              className="bg-white/10 text-white"
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-sm font-medium ${getDifficultyColor(prompt.difficulty)}`}>
                          {prompt.difficulty}
                        </div>
                        <div className="text-xs text-gray-400">
                          ⏱️ {prompt.estimatedTime} min
                        </div>
                      </div>
                    </div>
                    <Button
                      color="primary"
                      variant="solid"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPrompt(prompt);
                      }}
                    >
                      Gebruik deze prompt
                    </Button>
                  </CardBody>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Geen prompts gevonden voor de geselecteerde filters.
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MBTIJournalingPrompts;
