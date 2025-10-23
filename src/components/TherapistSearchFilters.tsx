import React from 'react';
import { Button } from '@nextui-org/react';
import { Filter } from 'lucide-react';

export const TherapistSearchFilters: React.FC = () => {
  return (
    <Button
      color='primary'
      variant='bordered'
      startContent={<Filter className='w-4 h-4' />}
      className='border-purple-400 text-purple-400'
    >
      Filters
    </Button>
  );
};