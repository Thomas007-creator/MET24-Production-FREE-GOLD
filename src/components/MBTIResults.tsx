/**
 * MBTI Results Component for MET24 Phase 1
 * 
 * Displays MBTI assessment results with type, description, strengths, and recommendations
 * 
 * @version 3.0.0-core
 */

import React from 'react';
import { MBTIResult } from '../services/mbtiService';

interface MBTIResultsProps {
  result: MBTIResult;
  onRetakeAssessment: () => void;
  onBackToMain: () => void;
}

export const MBTIResults: React.FC<MBTIResultsProps> = ({
  result,
  onRetakeAssessment,
  onBackToMain
}) => {
  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'INTJ': 'bg-purple-600',
      'INTP': 'bg-blue-600',
      'ENTJ': 'bg-red-600',
      'ENTP': 'bg-orange-600',
      'INFJ': 'bg-green-600',
      'INFP': 'bg-pink-600',
      'ENFJ': 'bg-yellow-600',
      'ENFP': 'bg-indigo-600',
      'ISTJ': 'bg-gray-600',
      'ISFJ': 'bg-teal-600',
      'ESTJ': 'bg-red-700',
      'ESFJ': 'bg-pink-700',
      'ISTP': 'bg-blue-700',
      'ISFP': 'bg-green-700',
      'ESTP': 'bg-orange-700',
      'ESFP': 'bg-yellow-700'
    };
    return colors[type] || 'bg-gray-600';
  };

  const getTypeIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      'INTJ': '🏗️',
      'INTP': '🧠',
      'ENTJ': '👑',
      'ENTP': '💡',
      'INFJ': '🎭',
      'INFP': '🎨',
      'ENFJ': '🌟',
      'ENFP': '🎪',
      'ISTJ': '📋',
      'ISFJ': '🛡️',
      'ESTJ': '⚡',
      'ESFJ': '🤝',
      'ISTP': '🔧',
      'ISFP': '🎵',
      'ESTP': '🚀',
      'ESFP': '🎉'
    };
    return icons[type] || '👤';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Je MBTI Resultaat
          </h1>
          <p className="text-lg text-gray-600">
            Ontdek je persoonlijkheidstype en hoe je het kunt gebruiken
          </p>
        </div>

        {/* MBTI Type Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white text-4xl mb-4 ${getTypeColor(result.type)}`}>
              {getTypeIcon(result.type)}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {result.type}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {result.description}
            </p>
            
            {/* Score Visualization */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(result.percentage).map(([dimension, percentage]) => (
                <div key={dimension} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{dimension}</div>
                  <div className="text-lg text-gray-600">{percentage}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-green-500 mr-3">💪</span>
            Je Sterke Punten
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.strengths.map((strength, index) => (
              <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-orange-500 mr-3">⚠️</span>
            Ontwikkelingsgebieden
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.challenges.map((challenge, index) => (
              <div key={index} className="flex items-center p-4 bg-orange-50 rounded-lg">
                <span className="text-orange-500 mr-3">⚠️</span>
                <span className="text-gray-700">{challenge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-blue-500 mr-3">💡</span>
            Aanbevelingen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-blue-500 mr-3">💡</span>
                <span className="text-gray-700">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* V3 Features Integration */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-purple-500 mr-3">🚀</span>
            V3 Features voor {result.type}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-purple-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Active Imagination</h4>
              <p className="text-gray-600 mb-4">
                Ontdek hoe je {result.type} type je kan helpen bij actieve imaginatie sessies.
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Start Sessie
              </button>
            </div>
            
            <div className="p-6 bg-green-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Enhanced Journaling</h4>
              <p className="text-gray-600 mb-4">
                Gebruik je {result.type} type voor gepersonaliseerde journaling ervaring.
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Start Journaling
              </button>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Challenges</h4>
              <p className="text-gray-600 mb-4">
                Kies uit {result.type}-specifieke uitdagingen die bij je passen.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Bekijk Challenges
              </button>
            </div>
            
            <div className="p-6 bg-orange-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Levensgebieden</h4>
              <p className="text-gray-600 mb-4">
                Verken levensgebieden die aansluiten bij je {result.type} type.
              </p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Verken Gebieden
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetakeAssessment}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Assessment Opnieuw Doen
          </button>
          <button
            onClick={onBackToMain}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Terug naar Hoofdmenu
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>
            Assessment voltooid op {result.timestamp.toLocaleDateString('nl-NL')}
          </p>
          <p className="text-sm mt-2">
            MET24 Phase 1 - V3 Features - MBTI Assessment
          </p>
        </div>
      </div>
    </div>
  );
};

export default MBTIResults;
