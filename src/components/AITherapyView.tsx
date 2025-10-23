import React from 'react';
import AICoachingWithContext from './AICoachingWithContext';
import { useTherapistPage } from './TherapistPage.provider';

export const AITherapyView: React.FC = () => {
  const { mbtiType } = useTherapistPage();

  // In a real implementation, userId would come from user data
  const userId = 'temp_user';

  return (
    <AICoachingWithContext
      userId={userId}
      mbtiType={mbtiType}
    />
  );
};