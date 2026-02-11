import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium',
  fullScreen = false,
  text = '',
}) => {
  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <div className={`loading-spinner loading-spinner-${size}`}></div>
        {text && <p className="loading-spinner-text">{text}</p>}
      </div>
    );
  }

  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner loading-spinner-${size}`}></div>
      {text && <p className="loading-spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
