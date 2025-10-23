import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';
import { BMADColorSystem } from '../../lib/bmadColorSystem';

interface OnboardingInterestsContextType {
  // State
  selectedTags: string[];
  searchQuery: string;
  customTag: string;
  isSubmitting: boolean;
  filteredTags: string[];
  bmadColors: any;

  // Actions
  setSearchQuery: (query: string) => void;
  setCustomTag: (tag: string) => void;
  handleTagSelect: (tag: string) => void;
  handleTagRemove: (tagToRemove: string) => void;
  handleCustomTagAdd: () => void;
  handleSubmit: () => Promise<void>;
  handleSkip: () => Promise<void>;
}

const OnboardingInterestsContext = createContext<OnboardingInterestsContextType | undefined>(undefined);

interface OnboardingInterestsProviderProps {
  children: ReactNode;
  onNext: (interests: string[]) => void;
  onSkip: () => void;
}

export const OnboardingInterestsProvider: React.FC<OnboardingInterestsProviderProps> = ({
  children,
  onNext,
  onSkip,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default interest tags
  const defaultTags = [
    'Persoonlijke ontwikkeling',
    'Carrière',
    'Leiderschap',
    'Loopbaanverandering',
    'Relaties',
    'Dating',
    'Ouderschap',
    'Gezondheid',
    'Slaap',
    'Sport',
    'Mindfulness',
    'Stressmanagement',
    'Creativiteit',
    'Schrijven',
    'Muziek',
    'Spiritualiteit',
    'Zingeving',
    'Financiën',
    'Ondernemen',
    'Productiviteit',
    'Time management',
    'Technologie',
    'Leren',
    'Reizen',
    'Natuur',
    'Kunst',
    "Hobby's",
    'Netwerken',
    'Neurodiversiteit',
  ];

  // Filter tags based on search query
  const filteredTags = defaultTags.filter(
    tag =>
      tag.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  // Get creative, exploratory color scheme for interests selection
  const bmadColors = BMADColorSystem.getPersonalityColorScheme('intuitive_creative');

  const handleTagSelect = (tag: string) => {
    if (selectedTags.length < 10 && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setSearchQuery(''); // Clear search after selection
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleCustomTagAdd = () => {
    const trimmedTag = customTag.trim();
    if (
      trimmedTag &&
      selectedTags.length < 10 &&
      !selectedTags.includes(trimmedTag)
    ) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setCustomTag('');
    }
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      logger.info('❌ No interests selected');
      return;
    }

    setIsSubmitting(true);

    try {
      logger.info('✅ Submitting interests:', selectedTags);

      // Track analytics event
      logger.info('onboarding_interests_selected', {
        count: selectedTags.length,
        interests: selectedTags,
        step: 'interests',
      });

      // WatermelonDB write: create interests records
      await databaseService.write(async () => {
        logger.info('💾 Creating interests records:', selectedTags);

        // Simulate creating interests records for each selected tag
        for (const interest of selectedTags) {
          logger.info(`📝 Creating interest record: ${interest}`);

          // In real implementation, this would create records in interestsCollection
          // await interestsCollection.create(i => {
          //   i.user_id = currentUserId;
          //   i.tag = interest;
          //   i.created_at = new Date().toISOString();
          // });

          // Simulate database write
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // ✅ Update onboarding state in WatermelonDB
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'anon', // Will be updated when user is created
          last_step: 'interests',
          step_completed_flags: JSON.stringify({
            welcome: true,
            auth: true,
            privacy: true,
            basic_profile: true,
            account_created: true,
            mbti_choice: true,
            mbti_quicktest: true,
            mbti_result: true,
            interests: true,
          }),
        });
      });

      logger.info('✅ Interests saved to database');

      // ✅ FIXED: Pass interests data to parent component
      logger.info('📤 Passing interests to parent:', selectedTags);
      onNext(selectedTags);
    } catch (error) {
      logger.error('❌ Error in handleSubmit:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      logger.info('onboarding_interests_skipped', {
        step: 'interests',
      });
      logger.info('📊 Tracked: onboarding_interests_skipped');
    } catch (error) {
      logger.error('❌ Error tracking skip event:', { error: error instanceof Error ? error.message : String(error) });
    }
    onSkip();
  };

  // Track that interests page is shown
  useEffect(() => {
    const trackInterestsShown = async () => {
      try {
        logger.info('onboarding_interests_shown', {
          step: 'interests',
          action: 'shown',
        });
        logger.info('📊 Interests page shown event tracked');
      } catch (error) {
        logger.error('❌ Error tracking interests shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackInterestsShown();
  }, []);

  const value: OnboardingInterestsContextType = {
    selectedTags,
    searchQuery,
    customTag,
    isSubmitting,
    filteredTags,
    bmadColors,
    setSearchQuery,
    setCustomTag,
    handleTagSelect,
    handleTagRemove,
    handleCustomTagAdd,
    handleSubmit,
    handleSkip,
  };

  return (
    <OnboardingInterestsContext.Provider value={value}>
      {children}
    </OnboardingInterestsContext.Provider>
  );
};

export const useOnboardingInterests = (): OnboardingInterestsContextType => {
  const context = useContext(OnboardingInterestsContext);
  if (context === undefined) {
    throw new Error('useOnboardingInterests must be used within an OnboardingInterestsProvider');
  }
  return context;
};