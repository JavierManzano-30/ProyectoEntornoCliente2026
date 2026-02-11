function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}

function validateRequiredFields(body, fields) {
  const errors = [];
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      errors.push({ field, message: 'Requerido' });
    }
  }
  return errors;
}

function validateEnum(value, allowed) {
  if (value === undefined || value === null) return null;
  if (!allowed.includes(value)) return `Invalid value. Allowed: ${allowed.join(', ')}`;
  return null;
}

module.exports = {
  isNonEmptyString,
  isNumber,
  validateRequiredFields,
  validateEnum
};
