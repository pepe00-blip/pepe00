import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorMessage({ message, onRetry, showRetry = true }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <AlertCircle className="h-12 w-12 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">¡Oops! Algo salió mal</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}