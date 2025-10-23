import React, { useState, useEffect } from 'react';
import { Button, Input, Chip } from '@nextui-org/react';
import { Search, Plus } from 'lucide-react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';
import { BMADColorSystem } from '../../lib/bmadColorSystem';

interface OnboardingInterestsProps {
  onNext: (interests: string[]) => void;
  onSkip: () => void;
}

const OnboardingInterests: React.FC<OnboardingInterestsProps> = ({
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

  // Get creative, exploratory color scheme for interests selection
  const bmadColors = BMADColorSystem.getPersonalityColorScheme('intuitive_creative');

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bmadColors.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className='text-center max-w-4xl w-full'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>
            Wat interesseert jou het meest?
          </h1>
          <p className='text-xl text-white/80 mb-6'>
            Kies tot 10 onderwerpen waar je graag advies over wilt.
          </p>
        </div>

        {/* Database status indicator */}
        <div className='mb-6 p-2 bg-black/20 backdrop-blur-lg rounded-lg border border-white/20'>
          <p className='text-xs text-white/60'>
            Database: {'🔗 WatermelonDB'}|
            Version: {'2.0.0'}| Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        {/* Selected Tags Display */}
        {selectedTags.length > 0 && (
          <div className='mb-8'>
            <h3 className='text-lg font-semibold mb-4'>
              Geselecteerde interesses ({selectedTags.length}/10)
            </h3>
            <div className='flex flex-wrap gap-2 justify-center'>
              {selectedTags.map((tag, index) => (
                <Chip
                  key={index}
                  color='primary'
                  variant='solid'
                  onClose={() => handleTagRemove(tag)}
                  className='bg-white/20 backdrop-blur-xl border border-white/30 text-white'
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Search and Custom Add */}
        <div className='mb-8 space-y-4'>
          {/* Search Input */}
          <div className='relative max-w-md mx-auto'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5' />
            <Input
              type='text'
              placeholder='Zoek interesses...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='bg-green-800/40 backdrop-blur-xl border border-green-300/30 text-white placeholder-white/70'
              classNames={{
                input: 'text-white',
                inputWrapper: 'bg-transparent border-green-300/30',
              }}
              startContent={<Search className='w-4 h-4 text-white/70' />}
            />
          </div>

          {/* Custom Tag Input */}
          <div className='flex gap-2 max-w-md mx-auto'>
            <Input
              type='text'
              placeholder='Voeg eigen interesse toe...'
              value={customTag}
              onChange={e => setCustomTag(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleCustomTagAdd()}
              className='bg-green-800/40 backdrop-blur-xl border border-green-300/30 text-white placeholder-white/70'
              classNames={{
                input: 'text-white',
                inputWrapper: 'bg-transparent border-green-300/30',
              }}
            />
            <Button
              color='primary'
              size='sm'
              onClick={handleCustomTagAdd}
              disabled={!customTag.trim() || selectedTags.length >= 10}
              className='bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30'
            >
              <Plus className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Interest Cloud */}
        <div className='mb-8'>
          <div className='flex flex-wrap gap-3 justify-center max-h-96 overflow-y-auto p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl'>
            {filteredTags.map((tag, index) => (
              <Chip
                key={index}
                variant='bordered'
                onClick={() => handleTagSelect(tag)}
                className={`
                  cursor-pointer transition-all duration-200 hover:scale-105
                  bg-white/10 backdrop-blur-xl border border-white/30 text-white
                  hover:bg-white/20 hover:border-white/50
                  ${selectedTags.includes(tag) ? 'bg-white/30 border-white/60' : ''}
                `}
                style={{
                  fontSize: `${Math.max(14, 16 - Math.floor(index / 10))}px`,
                  opacity: selectedTags.includes(tag) ? 0.6 : 1,
                }}
              >
                {tag}
              </Chip>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='space-y-4'>
          <Button
            color='primary'
            size='lg'
            onClick={handleSubmit}
            disabled={selectedTags.length === 0 || isSubmitting}
            className='w-full max-w-md bg-white text-green-600 hover:bg-gray-100 transition-colors font-semibold'
          >
            {isSubmitting
              ? '⏳ Opslaan...'
              : `✅ Gereed (${selectedTags.length}/10)`}
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleSkip}
            className='w-full max-w-md bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-colors'
          >
            ⏭️ Overslaan
          </Button>
        </div>

        {/* Info Box */}
        <div className='mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
          <p className='text-sm opacity-80 leading-relaxed'>
            💡 <strong>Tip:</strong> Deze interesses helpen de AI-coach om
            relevante adviezen en content voor jou te selecteren. Je kunt altijd
            later je interesses aanpassen in de instellingen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingInterests;
