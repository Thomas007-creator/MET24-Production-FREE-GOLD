import React from 'react';
import {
  ArrowRight,
  Settings,
  User,
  Bell,
  Heart,
  Brain,
  CheckCircle,
  AlertCircle,
  Home,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { logger } from '../../utils/logger';
import {
  GlassCard,
  BigButton,
  IconButton,
  ThemePill,
  SectionTitle,
  NavigationFooter,
  NavigationItem,
} from './index';

const ComponentShowcase: React.FC = () => {
  const navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      icon: Home,
      onClick: () => logger.info('Home clicked'),
      active: true,
    },
    {
      label: 'Analytics',
      icon: TrendingUp,
      onClick: () => logger.info('Analytics clicked'),
    },
    {
      label: 'Activity',
      icon: Activity,
      onClick: () => logger.info('Activity clicked'),
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a] p-6'>
      <div className='max-w-6xl mx-auto space-y-8'>
        {/* SectionTitle Examples */}
        <SectionTitle
          title='UI Component Showcase'
          subtitle='Herbruikbare componenten met consistente styling'
          icon={Settings}
          size='xl'
          variant='centered'
        />

        {/* GlassCard Examples */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <GlassCard variant='primary' padding='lg'>
            <SectionTitle title='Primary Card' icon={Heart} size='md' />
            <p className='text-[#e0e0e0]/80 mt-4'>
              Dit is een primary glassmorphism card met standaard styling.
            </p>
          </GlassCard>

          <GlassCard variant='secondary' padding='lg'>
            <SectionTitle title='Secondary Card' icon={Brain} size='md' />
            <p className='text-[#e0e0e0]/80 mt-4'>
              Dit is een secondary card met subtielere styling.
            </p>
          </GlassCard>

          <GlassCard variant='accent' padding='lg'>
            <SectionTitle title='Accent Card' icon={CheckCircle} size='md' />
            <p className='text-[#e0e0e0]/80 mt-4'>
              Dit is een accent card met opvallende styling.
            </p>
          </GlassCard>
        </div>

        {/* BigButton Examples */}
        <div className='space-y-6'>
          <SectionTitle
            title='BigButton Varianten'
            icon={ArrowRight}
            size='lg'
          />

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <BigButton variant='primary' icon={ArrowRight}>
              Primary Button
            </BigButton>

            <BigButton variant='secondary' icon={Settings} iconPosition='start'>
              Secondary Button
            </BigButton>

            <BigButton variant='success' icon={CheckCircle}>
              Success Button
            </BigButton>

            <BigButton variant='warning' icon={AlertCircle}>
              Warning Button
            </BigButton>

            <BigButton variant='danger' icon={AlertCircle}>
              Danger Button
            </BigButton>

            <BigButton variant='gold' icon={Heart}>
              Gold Button
            </BigButton>
          </div>
        </div>

        {/* IconButton Examples */}
        <div className='space-y-6'>
          <SectionTitle
            title='IconButton Varianten'
            icon={Settings}
            size='lg'
          />

          <div className='flex flex-wrap gap-4'>
            <IconButton
              icon={Settings}
              variant='primary'
              size='lg'
              tooltip='Settings'
            />
            <IconButton
              icon={User}
              variant='secondary'
              size='md'
              tooltip='Profile'
            />
            <IconButton
              icon={Bell}
              variant='ghost'
              size='sm'
              tooltip='Notifications'
            />
            <IconButton
              icon={AlertCircle}
              variant='danger'
              size='md'
              tooltip='Alert'
            />
          </div>
        </div>

        {/* ThemePill Examples */}
        <div className='space-y-6'>
          <SectionTitle title='ThemePill Varianten' icon={Heart} size='lg' />

          <div className='flex flex-wrap gap-4'>
            <ThemePill variant='primary' icon={CheckCircle}>
              Primary
            </ThemePill>
            <ThemePill variant='secondary' icon={Settings}>
              Secondary
            </ThemePill>
            <ThemePill variant='success' icon={CheckCircle}>
              Success
            </ThemePill>
            <ThemePill variant='warning' icon={AlertCircle}>
              Warning
            </ThemePill>
            <ThemePill variant='danger' icon={AlertCircle}>
              Danger
            </ThemePill>
            <ThemePill variant='info' icon={Settings}>
              Info
            </ThemePill>
            <ThemePill variant='gradient' icon={Heart}>
              Gradient
            </ThemePill>
          </div>
        </div>

        {/* NavigationFooter Example */}
        <div className='space-y-6'>
          <SectionTitle title='NavigationFooter' icon={Home} size='lg' />

          <GlassCard variant='primary' padding='md'>
            <NavigationFooter
              items={navigationItems}
              variant='horizontal'
              size='md'
              showLabels={true}
            />
          </GlassCard>
        </div>

        {/* Complex Example */}
        <div className='space-y-6'>
          <SectionTitle title='Complexe Combinatie' icon={Brain} size='lg' />

          <GlassCard variant='primary' padding='lg'>
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <SectionTitle
                  title='Dashboard Widget'
                  icon={TrendingUp}
                  size='md'
                />
                <div className='flex gap-2'>
                  <IconButton icon={Settings} variant='ghost' size='sm' />
                  <IconButton icon={Bell} variant='ghost' size='sm' />
                </div>
              </div>

              <div className='flex flex-wrap gap-2'>
                <ThemePill variant='success' icon={CheckCircle}>
                  Actief
                </ThemePill>
                <ThemePill variant='info' icon={Activity}>
                  Real-time
                </ThemePill>
                <ThemePill variant='gradient' icon={Heart}>
                  Premium
                </ThemePill>
              </div>

              <p className='text-[#e0e0e0]/80'>
                Dit is een voorbeeld van hoe je meerdere componenten kunt
                combineren voor een consistente gebruikerservaring.
              </p>

              <div className='flex gap-4'>
                <BigButton
                  variant='primary'
                  icon={ArrowRight}
                  fullWidth={false}
                >
                  Bekijk Details
                </BigButton>
                <BigButton
                  variant='secondary'
                  icon={Settings}
                  fullWidth={false}
                >
                  Instellingen
                </BigButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcase;
