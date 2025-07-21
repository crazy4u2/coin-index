'use client';

import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ 
  message = '데이터를 불러오는 중...', 
  size = 'md',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600 mb-2`} />
      <p className={`text-gray-600 ${textSizeClasses[size]}`}>
        {message}
      </p>
    </div>
  );
}

export function InlineLoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <RefreshCw className={`w-4 h-4 animate-spin text-blue-600 ${className}`} />
  );
}

export function TableLoadingSpinner() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
      </div>
      <div className="p-6">
        <LoadingSpinner size="sm" message="테이블 데이터 로딩 중..." />
      </div>
    </div>
  );
}

export function ChartLoadingSpinner() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-4"></div>
      <div className="h-80 bg-gray-50 rounded flex items-center justify-center">
        <LoadingSpinner size="sm" message="차트 데이터 로딩 중..." />
      </div>
    </div>
  );
}