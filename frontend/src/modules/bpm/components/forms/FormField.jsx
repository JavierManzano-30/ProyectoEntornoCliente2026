/**
 * Campo individual de formulario soporta múltiples tipos
 */

import React from 'react';
import './FormField.css';

const FormField = ({
  field,
  value = '',
  onChange,
  onBlur,
  error = '',
  readOnly = false
}) => {
  const handleChange = (e) => {
    if (field.type === 'checkbox') {
      onChange(e.target.checked);
    } else if (field.type === 'number') {
      onChange(e.target.value ? parseFloat(e.target.value) : '');
    } else {
      onChange(e.target.value);
    }
  };

  const labelId = `field-${field.name}`;
  const errorId = error ? `${labelId}-error` : undefined;

  const baseProps = {
    id: labelId,
    name: field.name,
    onChange: handleChange,
    onBlur: onBlur,
    disabled: field.disabled || readOnly,
    'aria-describedby': errorId,
    'aria-invalid': !!error,
    required: field.required
  };

  return (
    <div className="form-field">
      {field.type !== 'checkbox' && (
        <label htmlFor={labelId} className="field-label">
          {field.label}
          {field.required && <span className="required">*</span>}
        </label>
      )}

      {field.type === 'text' && (
        <input
          {...baseProps}
          type="text"
          placeholder={field.placeholder}
          value={value || ''}
          className="field-input"
          readOnly={readOnly}
        />
      )}

      {field.type === 'email' && (
        <input
          {...baseProps}
          type="email"
          placeholder={field.placeholder}
          value={value || ''}
          className="field-input"
          readOnly={readOnly}
        />
      )}

      {field.type === 'number' && (
        <input
          {...baseProps}
          type="number"
          placeholder={field.placeholder}
          value={value === '' ? '' : value}
          className="field-input"
          readOnly={readOnly}
          min={field.min}
          max={field.max}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          {...baseProps}
          placeholder={field.placeholder}
          value={value || ''}
          className="field-textarea"
          rows={field.rows || 4}
          readOnly={readOnly}
        />
      )}

      {field.type === 'select' && (
        <select
          {...baseProps}
          value={value || ''}
          className="field-select"
        >
          <option value="">{field.placeholder || 'Seleccionar...'}</option>
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {field.type === 'checkbox' && (
        <div className="checkbox-wrapper">
          <input
            {...baseProps}
            type="checkbox"
            checked={value || false}
            className="field-checkbox"
          />
          <label htmlFor={labelId} className="checkbox-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
        </div>
      )}

      {field.type === 'radio' && (
        <div className="radio-group">
          {field.options?.map(option => (
            <div key={option.value} className="radio-item">
              <input
                {...baseProps}
                type="radio"
                value={option.value}
                checked={value === option.value}
                className="field-radio"
              />
              <label htmlFor={`${labelId}-${option.value}`} className="radio-label">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}

      {field.type === 'date' && (
        <input
          {...baseProps}
          type="date"
          value={value || ''}
          className="field-input"
          readOnly={readOnly}
        />
      )}

      {field.help && (
        <p className="field-help">{field.help}</p>
      )}

      {error && (
        <p className="field-error" id={errorId}>{error}</p>
      )}
    </div>
  );
};

export default FormField;
