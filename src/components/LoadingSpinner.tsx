import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
        </div>
        {message && (
          <p className="mt-4 text-gray-600 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}