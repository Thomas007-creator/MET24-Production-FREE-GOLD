import { createTable } from '@nozbe/watermelondb/Schema/migrations';

export default [
  // Initial migration - creates all tables
  createTable({
    name: 'users',
    columns: [
      { name: 'first_name', type: 'string', isOptional: true },
      { name: 'last_name', type: 'string', isOptional: true },
      { name: 'email', type: 'string', isOptional: true },
      { name: 'dob', type: 'string', isOptional: true },
      { name: 'auth_method', type: 'string', isOptional: true },
      { name: 'privacy_accepted', type: 'boolean', isOptional: true },
      { name: 'verified', type: 'boolean', isOptional: true },
      { name: 'verified_at', type: 'string', isOptional: true },
      { name: 'onboarded_at', type: 'string', isOptional: true },
      { name: 'onboarding_completed', type: 'boolean', isOptional: true },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ],
  }),
  createTable({
    name: 'onboarding_states',
    columns: [
      { name: 'user_id', type: 'string', isIndexed: true },
      { name: 'last_step', type: 'string', isOptional: true }, // 'step-1', 'step-2', etc. for NEW-OnboardingFlow
      { name: 'step_completed_flags', type: 'string', isOptional: true }, // JSON string for NEW-OnboardingFlow steps
      { name: 'consent_time', type: 'string', isOptional: true },
      { name: 'flow_type', type: 'string', isOptional: true }, // 'NEW-OnboardingFlow' or legacy
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ],
  }),
  createTable({
    name: 'analytics_events',
    columns: [
      { name: 'event_name', type: 'string' },
      { name: 'properties', type: 'string', isOptional: true },
      { name: 'session_id', type: 'string', isOptional: true },
      { name: 'synced', type: 'boolean', isOptional: true },
      { name: 'synced_at', type: 'string', isOptional: true },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ],
  }),
];
