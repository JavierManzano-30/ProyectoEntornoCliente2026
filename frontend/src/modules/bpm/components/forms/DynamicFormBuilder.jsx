/**
 * Constructor dinámico de formularios desde definiciones JSON
 */

import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormValidation from './FormValidation';
import { validateForm } from '../../utils/formBuilder';
import './DynamicFormBuilder.css';

const DynamicFormBuilder = ({
  formDefinition,
  initialValues = {},
  onSubmit,
  onCancel,
  submitButtonText = 'Guardar',
  loading = false,
  readOnly = false
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Limpiar error del campo si existe
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = validateForm(formData, formDefinition);

      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Error en formulario:', error);
      setErrors({ submit: 'Error al enviar el formulario' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formDefinition || !formDefinition.fields) {
    return <div className="form-empty">Definición de formulario no válida</div>;
  }

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      {formDefinition.description && (
        <p className="form-description">{formDefinition.description}</p>
      )}

      {errors.submit && (
        <FormValidation errors={[errors.submit]} type="error" />
      )}

      <div className="form-fields">
        {formDefinition.fields.map(field => (
          <div key={field.name} className="form-field-group">
            <FormField
              field={field}
              value={formData[field.name]}
              onChange={(value) => handleFieldChange(field.name, value)}
              onBlur={() => handleFieldBlur(field.name)}
              error={touched[field.name] ? errors[field.name] : ''}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>

      {!readOnly && (
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting || loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || loading}
          >
            {loading || isSubmitting ? 'Enviando...' : submitButtonText}
          </button>
        </div>
      )}
    </form>
  );
};

export default DynamicFormBuilder;
