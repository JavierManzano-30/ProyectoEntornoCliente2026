/**
 * Constructor de formularios dinámicos para BPM
 */

/**
 * Tipos de campos soportados
 */
export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  DATE: 'date',
  DATETIME: 'datetime',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  FILE: 'file',
  USER_PICKER: 'user_picker',
  CURRENCY: 'currency'
};

/**
 * Crear campo de formulario
 */
export const createField = (type, options = {}) => {
  return {
    id: options.id || generateFieldId(),
    type,
    name: options.name || '',
    label: options.label || '',
    placeholder: options.placeholder || '',
    required: options.required || false,
    disabled: options.disabled || false,
    visible: options.visible !== false,
    defaultValue: options.defaultValue,
    validation: options.validation || {},
    options: options.options || [], // Para select, radio, etc.
    multiple: options.multiple || false, // Para multiselect, file
    rows: options.rows || 3, // Para textarea
    min: options.min, // Para number, date
    max: options.max, // Para number, date
    step: options.step, // Para number
    pattern: options.pattern, // Para text con regex
    helpText: options.helpText || '',
    dependsOn: options.dependsOn || null, // Campo del que depende
    conditionalRules: options.conditionalRules || [] // Reglas condicionales
  };
};

/**
 * Generar ID único para campo
 */
const generateFieldId = () => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Crear formulario
 */
export const createForm = (fields = [], options = {}) => {
  return {
    id: options.id || generateFieldId(),
    name: options.name || '',
    title: options.title || '',
    description: options.description || '',
    fields,
    sections: options.sections || [],
    layout: options.layout || 'vertical', // vertical, horizontal, grid
    submitButtonText: options.submitButtonText || 'Enviar',
    cancelButtonText: options.cancelButtonText || 'Cancelar',
    showCancelButton: options.showCancelButton !== false
  };
};

/**
 * Validar campo
 */
export const validateField = (field, value) => {
  const errors = [];
  
  // Validación de requerido
  if (field.required && (!value || value === '')) {
    errors.push(`${field.label} es obligatorio`);
    return errors;
  }
  
  // Si no hay valor y no es requerido, es válido
  if (!value || value === '') {
    return errors;
  }
  
  // Validaciones por tipo
  switch (field.type) {
    case FIELD_TYPES.EMAIL:
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push('Email inválido');
      }
      break;
      
    case FIELD_TYPES.NUMBER:
    case FIELD_TYPES.CURRENCY:
      if (isNaN(value)) {
        errors.push('Debe ser un número');
      }
      if (field.min !== undefined && parseFloat(value) < field.min) {
        errors.push(`El valor mínimo es ${field.min}`);
      }
      if (field.max !== undefined && parseFloat(value) > field.max) {
        errors.push(`El valor máximo es ${field.max}`);
      }
      break;
      
    case FIELD_TYPES.TEXT:
      if (field.pattern) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
          errors.push(`Formato inválido`);
        }
      }
      if (field.validation.minLength && value.length < field.validation.minLength) {
        errors.push(`Longitud mínima: ${field.validation.minLength} caracteres`);
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        errors.push(`Longitud máxima: ${field.validation.maxLength} caracteres`);
      }
      break;
  }
  
  return errors;
};

/**
 * Validar formulario completo
 */
export const validateForm = (form, values) => {
  const errors = {};
  let isValid = true;
  
  form.fields.forEach(field => {
    // Evaluar visibilidad condicional
    if (!evaluateFieldVisibility(field, values)) {
      return; // Skip hidden fields
    }
    
    const fieldErrors = validateField(field, values[field.name]);
    if (fieldErrors.length > 0) {
      errors[field.name] = fieldErrors;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

/**
 * Evaluar visibilidad de campo
 */
export const evaluateFieldVisibility = (field, values) => {
  if (!field.visible) return false;
  
  if (!field.dependsOn || field.conditionalRules.length === 0) {
    return true;
  }
  
  // Evaluar reglas condicionales
  return field.conditionalRules.some(rule => {
    const dependentValue = values[field.dependsOn];
    
    switch (rule.operator) {
      case 'equals':
        return dependentValue === rule.value;
      case 'not_equals':
        return dependentValue !== rule.value;
      case 'contains':
        return dependentValue && dependentValue.includes(rule.value);
      case 'greater_than':
        return parseFloat(dependentValue) > parseFloat(rule.value);
      case 'less_than':
        return parseFloat(dependentValue) < parseFloat(rule.value);
      default:
        return true;
    }
  });
};

/**
 * Obtener valores por defecto del formulario
 */
export const getFormDefaultValues = (form) => {
  const defaultValues = {};
  
  form.fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      defaultValues[field.name] = field.defaultValue;
    }
  });
  
  return defaultValues;
};

/**
 * Serializar formulario para guardado
 */
export const serializeForm = (form) => {
  return JSON.stringify(form, null, 2);
};

/**
 * Parsear definición de formulario
 */
export const parseFormDefinition = (definition) => {
  try {
    if (typeof definition === 'string') {
      return JSON.parse(definition);
    }
    return definition;
  } catch (error) {
    console.error('Error parseando definición de formulario:', error);
    return null;
  }
};
