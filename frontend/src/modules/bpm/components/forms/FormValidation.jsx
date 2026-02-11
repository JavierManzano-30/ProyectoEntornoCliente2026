/**
 * Mostrador de errores de validación
 */

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import './FormValidation.css';

const FormValidation = ({ errors = [], warnings = [], type = 'error' }) => {
  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  return (
    <div className={`validation-container validation-${type}`}>
      <div className="validation-content">
        <div className="validation-icon">
          {type === 'error' ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle size={20} />
          )}
        </div>
        <div className="validation-messages">
          {errors.length > 0 && (
            <ul className="error-list">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          )}
          {warnings.length > 0 && (
            <ul className="warning-list">
              {warnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormValidation;
