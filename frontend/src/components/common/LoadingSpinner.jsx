import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium',
  fullScreen = false,
  text = '',
}) => {
  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className={`spinner spinner-${size}`}></div>
        {text && <p className="spinner-text">{text}</p>}
      </div>
    );
  }

  return (
    <div className="spinner-container">
      <div className={`spinner spinner-${size}`}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
