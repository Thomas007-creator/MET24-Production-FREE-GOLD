import React, { Suspense } from 'react';

// Fallback provider zonder NextUI om dom-animation errors te voorkomen
const LazyNextUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="nextui-provider-fallback">
      {children}
    </div>
  );
};

export default LazyNextUIProvider;
