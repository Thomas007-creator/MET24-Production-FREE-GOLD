import React from 'react';
import { Button, Input } from '@nextui-org/react';
import { Search, Plus } from 'lucide-react';
import { useOnboardingInterests } from './i-OnboardingInterests.provider';

export const OnboardingInterestsSearchInput: React.FC = () => {
  const {
    searchQuery,
    customTag,
    selectedTags,
    setSearchQuery,
    setCustomTag,
    handleCustomTagAdd
  } = useOnboardingInterests();

  return (
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
  );
};