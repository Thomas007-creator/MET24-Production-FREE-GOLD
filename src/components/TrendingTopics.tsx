import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { TrendingUp } from 'lucide-react';
import { useCommunities } from './CommunitiesPage.provider';

export const TrendingTopics: React.FC = () => {
  const { trendingTopics } = useCommunities();

  return (
    <div className='space-y-6'>
      <div className='glass rounded-xl p-6'>
        <h2 className='text-2xl font-semibold text-white mb-4'>
          🔥 Trending Topics
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {trendingTopics.map((topic, index) => (
            <Card key={index} className='glass border border-white/10 hover:bg-white/10 transition-all'>
              <CardBody className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-white'>{topic.topic}</h3>
                    <p className='text-sm text-gray-400'>{topic.posts} posts</p>
                  </div>
                  <div className='text-green-400'>
                    <TrendingUp className='w-5 h-5' />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};