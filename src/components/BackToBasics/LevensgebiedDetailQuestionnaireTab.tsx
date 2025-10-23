/**
 * Levensgebied Detail Questionnaire Tab Component
 *
 * Questionnaire tab for collecting user assessments
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip } from '@nextui-org/react';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useLevensgebiedDetail } from './LevensgebiedDetailPage.provider';

export const LevensgebiedDetailQuestionnaireTab: React.FC = () => {
  const {
    areaData,
    questionnaireAnswers,
    progress,
    isSaving,
    saveStatus,
    handleQuestionnaireAnswer,
    handleSaveQuestionnaire
  } = useLevensgebiedDetail();

  if (!areaData) return null;

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving': return <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />;
      case 'saved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Save className="w-4 h-4" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving': return 'Opslaan...';
      case 'saved': return 'Opgeslagen!';
      case 'error': return 'Fout bij opslaan';
      default: return 'Opslaan';
    }
  };

  return (
    <div className="space-y-6">
      {/* Questionnaire Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-semibold">{areaData.questionnaire.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Beantwoord de vragen om je huidige situatie te assesseren
              </p>
            </div>
            <Chip
              color={progress === 100 ? 'success' : 'default'}
              variant="flat"
            >
              {progress}% compleet
            </Chip>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-6">
            <Progress value={progress} color="primary" />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {areaData.questionnaire.questions.map((question, index) => (
              <Card key={question.id} className="border">
                <CardBody>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">
                      {index + 1}. {question.question}
                    </h3>
                    <p className="text-sm text-gray-600">{question.context}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Schaal: {question.scale}
                    </div>
                  </div>

                  {/* Answer Scale */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {Array.from({ length: question.scale.includes('0-10') ? 11 : 10 }, (_, i) => {
                      const value = question.scale.includes('0-10') ? i : i + 1;
                      const isSelected = questionnaireAnswers[question.id] === value;

                      return (
                        <Button
                          key={value}
                          size="sm"
                          variant={isSelected ? "solid" : "bordered"}
                          color={isSelected ? "primary" : "default"}
                          onClick={() => handleQuestionnaireAnswer(question.id, value)}
                          className="min-w-[40px]"
                        >
                          {value}
                        </Button>
                      );
                    })}
                  </div>

                  {questionnaireAnswers[question.id] && (
                    <div className="mt-3 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Antwoord opgeslagen
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {Object.keys(questionnaireAnswers).length} van {areaData.questionnaire.questions.length} vragen beantwoord
            </div>
            <Button
              color={saveStatus === 'saved' ? 'success' : saveStatus === 'error' ? 'danger' : 'primary'}
              onClick={handleSaveQuestionnaire}
              disabled={isSaving || progress === 0}
              startContent={getSaveStatusIcon()}
            >
              {getSaveStatusText()}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};