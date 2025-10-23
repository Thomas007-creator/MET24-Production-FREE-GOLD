/**
 * User Feedback Component for MET24 Phase 1
 * 
 * Collects user feedback and ratings
 * 
 * @version 3.0.0-core
 */

import React, { useState } from 'react';

interface UserFeedbackProps {
  onSubmit: (feedback: FeedbackData) => void;
  onCancel: () => void;
  context?: string;
  mbtiType?: string;
}

interface FeedbackData {
  rating: number;
  comment: string;
  category: string;
  context?: string;
  mbtiType?: string;
  timestamp: Date;
}

export const UserFeedback: React.FC<UserFeedbackProps> = ({
  onSubmit,
  onCancel,
  context = 'general',
  mbtiType
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'general', label: 'Algemeen' },
    { value: 'mbti-assessment', label: 'MBTI Assessment' },
    { value: 'active-imagination', label: 'Active Imagination' },
    { value: 'enhanced-journaling', label: 'Enhanced Journaling' },
    { value: 'challenges', label: 'Challenges' },
    { value: 'levensgebieden', label: 'Levensgebieden' },
    { value: 'v3-features', label: 'V3 Features' },
    { value: 'ui-ux', label: 'UI/UX' },
    { value: 'performance', label: 'Performance' },
    { value: 'bug-report', label: 'Bug Report' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Selecteer een rating voordat je feedback indient.');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        rating,
        comment,
        category,
        context,
        mbtiType,
        timestamp: new Date()
      };

      await onSubmit(feedbackData);
      
      // Reset form
      setRating(0);
      setComment('');
      setCategory('general');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Er is een fout opgetreden bij het indienen van je feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (rating: number): string => {
    const labels: { [key: number]: string } = {
      1: 'Zeer slecht',
      2: 'Slecht',
      3: 'Gemiddeld',
      4: 'Goed',
      5: 'Uitstekend'
    };
    return labels[rating] || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Jouw Feedback
            </h2>
            <p className="text-gray-600">
              Help ons MET24 te verbeteren door je ervaring te delen
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hoe tevreden ben je met {context}?
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${
                      star <= rating
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  {getRatingLabel(rating)}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opmerkingen (optioneel)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Deel je gedachten, suggesties of ervaringen..."
              />
            </div>

            {/* MBTI Type Display */}
            {mbtiType && (
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-sm text-indigo-700">
                  <span className="font-medium">MBTI Type:</span> {mbtiType}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Indienen...' : 'Feedback Indienen'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              Je feedback helpt ons om MET24 te verbeteren. 
              Bedankt voor je tijd!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
