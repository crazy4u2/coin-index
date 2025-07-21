'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5분간 데이터가 fresh 상태 유지
        gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
        retry: (failureCount, error) => {
          // API 서버 에러(5xx)나 네트워크 에러만 재시도
          if (failureCount >= 3) return false;
          if (error instanceof Error) {
            const message = error.message.toLowerCase();
            // 클라이언트 에러(4xx)는 재시도하지 않음
            if (message.includes('400') || message.includes('401') || message.includes('403') || message.includes('404')) {
              return false;
            }
          }
          return true;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: 'always', // 컴포넌트 마운트시 항상 최신 데이터 확인
        refetchOnReconnect: 'always', // 네트워크 재연결시 최신 데이터 확인
      },
      mutations: {
        retry: 1,
        onError: (error) => {
          console.error('Mutation error:', error);
        }
      }
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}