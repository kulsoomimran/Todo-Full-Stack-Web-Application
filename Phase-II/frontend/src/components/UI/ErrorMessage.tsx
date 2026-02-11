import { FC } from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <div
      className={`rounded-lg p-4 ${className}`}
      role="alert"
      style={{ backgroundColor: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)' }}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            style={{ color: 'var(--color-danger)' }}
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{message}</h3>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;