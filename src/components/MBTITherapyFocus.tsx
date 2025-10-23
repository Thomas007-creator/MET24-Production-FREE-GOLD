import React from 'react';
import { Chip } from '@nextui-org/react';
import { useTherapistPage } from './TherapistPage.provider';

export const MBTITherapyFocus: React.FC = () => {
  const { mbtiType } = useTherapistPage();

  const getMBTITherapyFocus = (mbti: string) => {
    const focuses: { [key: string]: string } = {
      'INFP': 'Emotionele expressie, creativiteit en authenticiteit',
      'ENFP': 'Energie management, focus en actie ondernemen',
      'INFJ': 'Intuïtie ontwikkelen, visie en leiderschap',
      'ENFJ': 'Empathie balanceren, grenzen en zelfzorg',
      'INTJ': 'Strategische planning, perfectionisme en flexibiliteit',
      'ENTJ': 'Leiderschap, stress management en werk-privé balans',
      'INTP': 'Besluitvorming, sociale vaardigheden en praktische toepassing',
      'ENTP': 'Focus, follow-through en detailgerichtheid',
      'ISTJ': 'Flexibiliteit, spontaniteit en creativiteit',
      'ESTJ': 'Empathie, luisteren en samenwerking',
      'ISFJ': 'Zelfzorg, grenzen en assertiviteit',
      'ESFJ': 'Perfectionisme, kritiek en zelfacceptatie',
      'ISTP': 'Planning, structuur en langetermijn doelen',
      'ESTP': 'Reflectie, geduld en diepte',
      'ISFP': 'Conflicthantering, assertiviteit en besluitvorming',
      'ESFP': 'Planning, structuur en langetermijn focus'
    };
    return focuses[mbti] || 'Persoonlijke groei en zelfontwikkeling';
  };

  const getMBTIRecommendations = (mbti: string) => {
    // Mock recommendations - in a real implementation this would come from a service
    const recommendations: { [key: string]: { specialty: string } } = {
      'INFP': { specialty: 'Creatieve Therapie' },
      'ENFP': { specialty: 'Coaching & Ontwikkeling' },
      'INFJ': { specialty: 'Spirituele Begeleiding' },
      'ENFJ': { specialty: 'Relatie Therapie' },
      'INTJ': { specialty: 'Strategische Coaching' },
      'ENTJ': { specialty: 'Leiderschapsontwikkeling' },
      'INTP': { specialty: 'Cognitieve Therapie' },
      'ENTP': { specialty: 'Innovatie Coaching' },
      'ISTJ': { specialty: 'Structuur & Organisatie' },
      'ESTJ': { specialty: 'Team Dynamiek' },
      'ISFJ': { specialty: 'Zorg & Welzijn' },
      'ESFJ': { specialty: 'Sociale Vaardigheden' },
      'ISTP': { specialty: 'Praktische Coaching' },
      'ESTP': { specialty: 'Avontuur Therapie' },
      'ISFP': { specialty: 'Kunstzinnige Therapie' },
      'ESFP': { specialty: 'Entertainment Coaching' }
    };
    return recommendations[mbti] || { specialty: 'Algemene Therapie' };
  };

  return (
    <div className='glass rounded-xl p-6 mb-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-white mb-2'>
            🧠 Jouw {mbtiType} Therapie Focus
          </h2>
          <p className='text-gray-300'>
            {getMBTITherapyFocus(mbtiType)}
          </p>
          <div className='mt-2'>
            <Chip
              size='sm'
              variant='flat'
              className='bg-purple-500/20 text-purple-300'
            >
              {getMBTIRecommendations(mbtiType).specialty}
            </Chip>
          </div>
        </div>
        <div className='text-right'>
          <div className='text-2xl font-bold text-purple-400'>{mbtiType}</div>
          <div className='text-sm text-gray-400'>Persoonlijkheidstype</div>
        </div>
      </div>
    </div>
  );
};