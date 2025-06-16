import React from "react";
import Button from "./Button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`bg-danger-50 border border-danger-200 rounded-lg p-4 m-4 ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-danger-500 text-xl">⚠️</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-danger-700">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-danger-300 text-danger-700 hover:bg-danger-50"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
