import React from 'react';
import { Card, CardBody, Button, Input, Chip, Badge } from '@nextui-org/react';
import { Search, Filter, Plus } from 'lucide-react';
import { useCommunities, Community } from './CommunitiesPage.provider';

export const CommunitiesGrid: React.FC = () => {
  const {
    communities,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    handleJoinCommunity,
    getCategoryColor
  } = useCommunities();

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || community.category === selectedCategory)
  );

  return (
    <div className='space-y-6'>
      {/* Search and Filters */}
      <div className='glass rounded-xl p-6'>
        <div className='flex flex-col md:flex-row gap-4 mb-4'>
          <Input
            placeholder="Zoek community's..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className='w-4 h-4' />}
            className='flex-1'
          />
          <Button
            color='primary'
            variant='bordered'
            startContent={<Filter className='w-4 h-4' />}
            className='border-purple-400 text-purple-400'
          >
            Filters
          </Button>
          <Button
            color='primary'
            variant='solid'
            startContent={<Plus className='w-4 h-4' />}
            className='bg-purple-600 hover:bg-purple-700'
          >
            Nieuwe Community
          </Button>
        </div>
      </div>

      {/* Communities Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredCommunities.map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            onJoinCommunity={handleJoinCommunity}
            getCategoryColor={getCategoryColor}
          />
        ))}
      </div>
    </div>
  );
};

interface CommunityCardProps {
  community: Community;
  onJoinCommunity: (communityId: string) => void;
  getCategoryColor: (category: string) => string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onJoinCommunity,
  getCategoryColor
}) => {
  return (
    <Card className='glass border border-white/10 hover:bg-white/10 transition-all'>
      <CardBody className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='text-3xl'>{community.icon}</div>
            <div>
              <h3 className='font-semibold text-white'>{community.name}</h3>
              <p className='text-sm text-gray-300'>{community.description}</p>
            </div>
          </div>
          {community.trending && (
            <Badge content='🔥' color='warning' size='sm'>
              <div></div>
            </Badge>
          )}
        </div>

        <div className='space-y-3 mb-4'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-400'>Leden</span>
            <span className='text-white'>{community.memberCount.toLocaleString()}</span>
          </div>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-400'>Laatste activiteit</span>
            <span className='text-white'>{community.lastActivity}</span>
          </div>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-400'>MBTI Types</span>
            <div className='flex space-x-1'>
              {community.mbtiTypes.slice(0, 3).map((type) => (
                <Chip
                  key={type}
                  size='sm'
                  variant='flat'
                  className='bg-white/10 text-white text-xs'
                >
                  {type}
                </Chip>
              ))}
              {community.mbtiTypes.length > 3 && (
                <span className='text-xs text-gray-400'>+{community.mbtiTypes.length - 3}</span>
              )}
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <Chip
            size='sm'
            variant='flat'
            className={getCategoryColor(community.category)}
          >
            {community.category}
          </Chip>
          <Button
            color={community.isJoined ? 'secondary' : 'primary'}
            variant={community.isJoined ? 'bordered' : 'solid'}
            size='sm'
            onClick={() => onJoinCommunity(community.id)}
            className={community.isJoined ? 'border-white/20 text-white' : 'bg-purple-600 hover:bg-purple-700'}
          >
            {community.isJoined ? 'Verlaten' : 'Lid Worden'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};