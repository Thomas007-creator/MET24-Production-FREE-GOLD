import React from 'react';
import { Card, CardBody, Button, Avatar, Chip } from '@nextui-org/react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useCommunities, CommunityPost } from './CommunitiesPage.provider';

export const CommunityPosts: React.FC = () => {
  const {
    selectedCommunity,
    posts,
    setSelectedCommunity,
    handleLikePost,
    handleBookmarkPost,
    getTypeIcon
  } = useCommunities();

  if (!selectedCommunity) return null;

  return (
    <div className='space-y-6'>
      {/* Community Header */}
      <div className='glass rounded-xl p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='text-4xl'>{selectedCommunity.icon}</div>
            <div>
              <h2 className='text-2xl font-semibold text-white'>{selectedCommunity.name}</h2>
              <p className='text-gray-300'>{selectedCommunity.description}</p>
            </div>
          </div>
          <Button
            color='secondary'
            variant='light'
            onClick={() => setSelectedCommunity(null)}
            className='text-white'
          >
            Terug naar Community's
          </Button>
        </div>
      </div>

      {/* Posts List */}
      <div className='space-y-4'>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLikePost}
            onBookmark={handleBookmarkPost}
            getTypeIcon={getTypeIcon}
          />
        ))}
      </div>
    </div>
  );
};

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  getTypeIcon: (type: string) => string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onBookmark,
  getTypeIcon
}) => {
  return (
    <Card className='glass border border-white/10 hover:bg-white/10 transition-all'>
      <CardBody className='p-6'>
        <div className='flex items-start space-x-4 mb-4'>
          <Avatar
            src={post.author.avatar}
            className='w-12 h-12'
          />
          <div className='flex-1'>
            <div className='flex items-center space-x-2 mb-2'>
              <h3 className='font-semibold text-white'>{post.author.name}</h3>
              <Chip
                size='sm'
                variant='flat'
                className='bg-white/10 text-white text-xs'
              >
                {post.author.mbtiType}
              </Chip>
              <span className='text-sm text-gray-400'>{post.timestamp}</span>
            </div>
            <h4 className='text-lg font-semibold text-white mb-2'>{post.title}</h4>
            <p className='text-gray-300 mb-4'>{post.content}</p>
            <div className='flex flex-wrap gap-2 mb-4'>
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  size='sm'
                  variant='flat'
                  className='bg-white/5 text-gray-300 text-xs'
                >
                  #{tag}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button
              color='secondary'
              variant='light'
              startContent={<Heart className='w-4 h-4' />}
              onClick={() => onLike(post.id)}
              className={`text-white ${post.isLiked ? 'text-red-400' : ''}`}
            >
              {post.likes}
            </Button>
            <Button
              color='secondary'
              variant='light'
              startContent={<MessageCircle className='w-4 h-4' />}
              className='text-white'
            >
              {post.comments}
            </Button>
            <Button
              color='secondary'
              variant='light'
              startContent={<Share2 className='w-4 h-4' />}
              className='text-white'
            >
              Delen
            </Button>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              color='secondary'
              variant='light'
              startContent={<Bookmark className='w-4 h-4' />}
              onClick={() => onBookmark(post.id)}
              className={`text-white ${post.isBookmarked ? 'text-yellow-400' : ''}`}
            >
              {post.isBookmarked ? 'Opgeslagen' : 'Opslaan'}
            </Button>
            <Chip
              size='sm'
              variant='flat'
              className='bg-white/10 text-white text-xs'
            >
              {getTypeIcon(post.type)} {post.type}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};