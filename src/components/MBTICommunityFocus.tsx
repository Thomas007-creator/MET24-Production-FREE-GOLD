import React from 'react';
import { useCommunities } from './CommunitiesPage.provider';

export const MBTICommunityFocus: React.FC = () => {
  const { mbtiType } = useCommunities();

  return (
    <div className='glass rounded-xl p-6 mb-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-white mb-2'>
            🎯 Jouw {mbtiType} Community Focus
          </h2>
          <p className='text-gray-300'>
            Verbind met gelijkgestemden en deel je unieke perspectief
          </p>
        </div>
        <div className='text-right'>
          <div className='text-2xl font-bold text-purple-400'>{mbtiType}</div>
          <div className='text-sm text-gray-400'>Jouw Type</div>
        </div>
      </div>
    </div>
  );
};