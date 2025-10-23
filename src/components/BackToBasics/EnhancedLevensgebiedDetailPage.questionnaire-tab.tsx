import React from 'react';
import { Card, CardBody, CardHeader, Slider, Chip } from '@nextui-org/react';
import { BarChart3 } from 'lucide-react';
import { useEnhancedLevensgebiedDetailPage } from './EnhancedLevensgebiedDetailPage.provider';

export const EnhancedLevensgebiedDetailPageQuestionnaireTab: React.FC = () => {
  const {
    area,
    questionnaireAnswers,
    setQuestionnaireAnswer
  } = useEnhancedLevensgebiedDetailPage();

  if (!area) return null;

  const handleAnswerChange = (questionId: string, value: number | number[]) => {
    const numericValue = Array.isArray(value) ? value[0] : value;
    setQuestionnaireAnswer(questionId, numericValue);
  };

  return (
    <div className="space-y-6">
      <Card className="glass border border-white/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">{area.questionnaire.title}</h2>
          </div>
          <p className="text-gray-300 text-sm">Beantwoord de vragen om je voortgang bij te houden</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-8">
            {area.questionnaire.questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-2">{question.question}</h3>
                    <p className="text-gray-400 text-sm mb-4">{question.context}</p>

                    <div className="space-y-3">
                      <Slider
                        size="lg"
                        step={1}
                        minValue={1}
                        maxValue={10}
                        value={questionnaireAnswers[question.id] || 1}
                        onChange={(value) => handleAnswerChange(question.id, value)}
                        className="max-w-md"
                        classNames={{
                          base: "max-w-md",
                          track: "bg-white/20",
                          filler: "bg-purple-500",
                          thumb: "bg-purple-400 border-purple-600",
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-400 max-w-md">
                        <span>1 - Laag</span>
                        <Chip
                          size="sm"
                          variant="flat"
                          className="bg-purple-600/20 text-purple-300"
                        >
                          {questionnaireAnswers[question.id] || 1}/10
                        </Chip>
                        <span>10 - Hoog</span>
                      </div>
                    </div>
                  </div>
                </div>

                {index < area.questionnaire.questions.length - 1 && (
                  <div className="border-b border-white/10" />
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};