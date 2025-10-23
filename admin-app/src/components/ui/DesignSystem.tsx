/**
 * Design System Components
 * 
 * Herbruikbare componenten met consistente styling voor onboarding en mainview
 */

import React from 'react';
// Import fallback components om NextUI dom-animation errors te voorkomen
import {
  PageContainer as FallbackPageContainer,
  ContentContainer as FallbackContentContainer,
  GlassCard as FallbackGlassCard,
  StyledButton as FallbackStyledButton,
  PageHeader as FallbackPageHeader,
  FormContainer as FallbackFormContainer,
  FormGroup as FallbackFormGroup,
  StatusIndicator as FallbackStatusIndicator,
  AnimatedContainer as FallbackAnimatedContainer,
  Spacer as FallbackSpacer,
  Divider as FallbackDivider,
} from './DesignSystemFallback';

// ===== LAYOUT COMPONENTS =====

interface PageContainerProps {
  children: React.ReactNode;
  variant?: 'onboarding' | 'mainview' | 'default';
  className?: string;
}

export const PageContainer = FallbackPageContainer;

interface ContentContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ContentContainer = FallbackContentContainer;

// ===== CARD COMPONENTS =====

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'strong' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const GlassCard = FallbackGlassCard;

// ===== BUTTON COMPONENTS =====

interface StyledButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const StyledButton = FallbackStyledButton;

// ===== HEADER COMPONENTS =====

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  className?: string;
}

export const PageHeader = FallbackPageHeader;

// ===== FORM COMPONENTS =====

interface FormContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const FormContainer = FallbackFormContainer;

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup = FallbackFormGroup;

// ===== STATUS COMPONENTS =====

interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'loading' | 'error';
  label?: string;
  className?: string;
}

export const StatusIndicator = FallbackStatusIndicator;

// ===== ANIMATION COMPONENTS =====

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'float';
  delay?: number;
  className?: string;
}

export const AnimatedContainer = FallbackAnimatedContainer;

// ===== UTILITY COMPONENTS =====

interface SpacerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Spacer = FallbackSpacer;

interface DividerProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export const Divider = FallbackDivider;

// Export all components
export default {
  PageContainer,
  ContentContainer,
  GlassCard,
  StyledButton,
  PageHeader,
  FormContainer,
  FormGroup,
  StatusIndicator,
  AnimatedContainer,
  Spacer,
  Divider,
};
