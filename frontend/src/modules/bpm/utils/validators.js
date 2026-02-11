/**
 * Validadores para formularios BPM
 */

/**
 * Validar email
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar teléfono
 */
export const validatePhone = (phone) => {
  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return regex.test(phone);
};

/**
 * Validar URL
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validar que no esté vacío
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validar longitud mínima
 */
export const validateMinLength = (value, minLength) => {
  if (!value) return false;
  return value.toString().length >= minLength;
};

/**
 * Validar longitud máxima
 */
export const validateMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.toString().length <= maxLength;
};

/**
 * Validar rango numérico
 */
export const validateRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

/**
 * Validar patrón regex
 */
export const validatePattern = (value, pattern) => {
  if (!value) return true;
  const regex = new RegExp(pattern);
  return regex.test(value);
};

/**
 * Validar fecha
 */
export const validateDate = (date) => {
  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * Validar fecha futura
 */
export const validateFutureDate = (date) => {
  if (!validateDate(date)) return false;
  return new Date(date) > new Date();
};

/**
 * Validar fecha pasada
 */
export const validatePastDate = (date) => {
  if (!validateDate(date)) return false;
  return new Date(date) < new Date();
};

/**
 * Validar archivo
 */
export const validateFile = (file, options = {}) => {
  if (!file) return false;
  
  // Validar tamaño
  if (options.maxSize && file.size > options.maxSize) {
    return false;
  }
  
  // Validar tipo
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const fileType = file.type || '';
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    const isAllowed = options.allowedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return fileType.startsWith(baseType);
      }
      return fileType === type || fileExtension === type.replace('.', '');
    });
    
    if (!isAllowed) return false;
  }
  
  return true;
};

/**
 * Validar múltiples archivos
 */
export const validateFiles = (files, options = {}) => {
  if (!files || files.length === 0) return false;
  
  // Validar cantidad
  if (options.maxFiles && files.length > options.maxFiles) {
    return false;
  }
  
  // Validar cada archivo
  return Array.from(files).every(file => validateFile(file, options));
};

/**
 * Obtener mensajes de error de validación
 */
export const getValidationMessage = (field, value, validation) => {
  if (validation.required && !validateRequired(value)) {
    return `${field} es obligatorio`;
  }
  
  if (validation.email && value && !validateEmail(value)) {
    return 'Email inválido';
  }
  
  if (validation.phone && value && !validatePhone(value)) {
    return 'Teléfono inválido';
  }
  
  if (validation.url && value && !validateURL(value)) {
    return 'URL inválida';
  }
  
  if (validation.minLength && value && !validateMinLength(value, validation.minLength)) {
    return `Mínimo ${validation.minLength} caracteres`;
  }
  
  if (validation.maxLength && value && !validateMaxLength(value, validation.maxLength)) {
    return `Máximo ${validation.maxLength} caracteres`;
  }
  
  if (validation.min !== undefined || validation.max !== undefined) {
    if (value && !validateRange(value, validation.min, validation.max)) {
      if (validation.min !== undefined && validation.max !== undefined) {
        return `Debe estar entre ${validation.min} y ${validation.max}`;
      } else if (validation.min !== undefined) {
        return `Mínimo ${validation.min}`;
      } else {
        return `Máximo ${validation.max}`;
      }
    }
  }
  
  if (validation.pattern && value && !validatePattern(value, validation.pattern)) {
    return validation.patternMessage || 'Formato inválido';
  }
  
  return null;
};

/**
 * Validar objeto completo con reglas
 */
export const validateObject = (obj, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = obj[field];
    const validation = rules[field];
    const message = getValidationMessage(field, value, validation);
    
    if (message) {
      errors[field] = message;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
