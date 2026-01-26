import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  message = 'Ha ocurrido un error',
  onRetry,
  fullScreen = false,
}) => {
  const content = (
    <div className="error-content">
      <AlertCircle size={48} className="error-icon" />
      <h3 className="error-title">Error</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <Button 
          variant="primary" 
          onClick={onRetry}
          icon={RefreshCw}
        >
          Reintentar
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="error-fullscreen">
        {content}
      </div>
    );
  }

  return (
    <div className="error-container">
      {content}
    </div>
  );
};

export default ErrorMessage;
