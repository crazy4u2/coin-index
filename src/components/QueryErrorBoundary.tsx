'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface QueryErrorBoundaryProps {
  children: ReactNode;
}

export default function QueryErrorBoundary({ children }: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {() => (
        <div className="query-error-reset-wrapper">
          {children}
        </div>
      )}
    </QueryErrorResetBoundary>
  );
}