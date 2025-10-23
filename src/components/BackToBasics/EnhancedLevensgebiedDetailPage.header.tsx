import React from 'react';
import { Button, Chip, Badge } from '@nextui-org/react';
import { ArrowLeft, Save, Activity } from 'lucide-react';
import { useEnhancedLevensgebiedDetailPage } from './EnhancedLevensgebiedDetailPage.provider';

export const EnhancedLevensgebiedDetailPageHeader: React.FC = () => {
  const {
    area,
    mbtiType,
    saveStatus,
    isSaving,
    handleSaveProgress,
    navigateBack
  } = useEnhancedLevensgebiedDetailPage();

  if (!area) return null;

  return (
    <div className="max-w-6xl mx-auto mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            isIconOnly
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={navigateBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{area.name}</h1>
            <p className="text-gray-300">{area.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Chip size="sm" variant="flat" className="bg-white/20 text-white">
                {mbtiType} Optimized
              </Chip>
              <Badge content="Live" color="success" variant="flat">
                <Activity className="w-4 h-4 text-green-400" />
              </Badge>
            </div>
          </div>
        </div>

        <Button
          color="primary"
          variant="solid"
          onClick={handleSaveProgress}
          isLoading={isSaving}
          startContent={!isSaving && <Save className="w-4 h-4" />}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {saveStatus === "saved" ? "Opgeslagen!" : "Opslaan"}
        </Button>
      </div>
    </div>
  );
};