'use client';

import React, { Component, ReactNode } from 'react';

type Props = { children: ReactNode };

class ErrorBoundary extends Component<Props, { hasError: boolean; error?: any }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error('ActiveImagination error:', error, info);
    // TODO: send to logging (Sentry)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-4 bg-red-50 text-red-900 rounded-md">
          <h3 className="font-semibold">Er is iets misgegaan</h3>
          <p>De imaginatieve sessie kon niet geladen worden. Probeer het opnieuw of contacteer ondersteuning.</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="mt-2 underline">
            Herstart component
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ActiveImaginationBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div className="p-4">Laden...</div>}>{children}</React.Suspense>
    </ErrorBoundary>
  );
}
