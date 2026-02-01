/**
 * Validar que un monto sea válido
 */
export const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && isFinite(num) && num >= 0;
};

/**
 * Validar fecha
 */
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

/**
 * Validar rango de fechas
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }
  return new Date(startDate) <= new Date(endDate);
};

/**
 * Validar código fiscal (NIF/CIF español)
 */
export const isValidTaxId = (taxId) => {
  // Patrón básico para NIF/CIF español
  const pattern = /^[A-Z]\d{8}$|^\d{8}[A-Z]$/;
  return pattern.test(taxId);
};

/**
 * Validar IBAN
 */
export const isValidIBAN = (iban) => {
  // Patrón básico - validación completa requeriría algoritmo mod-97
  const pattern = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
  return pattern.test(iban.replace(/\s/g, ''));
};

/**
 * Validar email
 */
export const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Validar porcentaje
 */
export const isValidPercentage = (value, min = 0, max = 100) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validar cantidad
 */
export const isValidQuantity = (quantity) => {
  const num = parseFloat(quantity);
  return !isNaN(num) && isFinite(num) && num > 0;
};

/**
 * Validar código contable
 */
export const isValidAccountCode = (code) => {
  // Patrón: XXXX o XXXX.XX o XXXX.XX.XX
  const pattern = /^\d{4}(\.\d{2})*$/;
  return pattern.test(code);
};

/**
 * Validar teléfono (formato español)
 */
export const isValidPhone = (phone) => {
  // Acepta formatos: +34XXXXXXXXX, 34XXXXXXXXX, XXXXXXXXX
  const pattern = /^(\+34|34)?[6-9]\d{8}$/;
  return pattern.test(phone.replace(/\s/g, ''));
};

/**
 * Validar código postal (España)
 */
export const isValidPostalCode = (postalCode) => {
  const pattern = /^\d{5}$/;
  return pattern.test(postalCode);
};

/**
 * Validar datos de línea de factura
 */
export const validateInvoiceLine = (line) => {
  const errors = [];
  
  if (!line.productId) {
    errors.push('Producto requerido');
  }
  
  if (!isValidQuantity(line.quantity)) {
    errors.push('Cantidad inválida');
  }
  
  if (!isValidAmount(line.unitPrice)) {
    errors.push('Precio unitario inválido');
  }
  
  if (line.discount && !isValidPercentage(line.discount, 0, 100)) {
    errors.push('Descuento inválido (0-100%)');
  }
  
  if (line.taxRate && !isValidPercentage(line.taxRate, 0, 100)) {
    errors.push('Tasa de impuesto inválida (0-100%)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validar datos de asiento contable
 */
export const validateJournalEntry = (entry) => {
  const errors = [];
  
  if (!entry.date || !isValidDate(entry.date)) {
    errors.push('Fecha inválida');
  }
  
  if (!entry.description || entry.description.trim().length === 0) {
    errors.push('Descripción requerida');
  }
  
  if (!entry.lines || entry.lines.length < 2) {
    errors.push('Se requieren al menos 2 líneas');
  }
  
  if (entry.lines) {
    const totalDebit = entry.lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredit = entry.lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      errors.push('El asiento no está balanceado (debe = haber)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validar datos de producto
 */
export const validateProduct = (product) => {
  const errors = [];
  
  if (!product.code || product.code.trim().length === 0) {
    errors.push('Código de producto requerido');
  }
  
  if (!product.name || product.name.trim().length === 0) {
    errors.push('Nombre de producto requerido');
  }
  
  if (product.cost && !isValidAmount(product.cost)) {
    errors.push('Costo inválido');
  }
  
  if (product.price && !isValidAmount(product.price)) {
    errors.push('Precio inválido');
  }
  
  if (product.price && product.cost && parseFloat(product.price) < parseFloat(product.cost)) {
    errors.push('El precio no puede ser menor que el costo');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizar string (eliminar caracteres peligrosos)
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .trim();
};

/**
 * Validar datos de proveedor/cliente
 */
export const validateEntity = (entity) => {
  const errors = [];
  
  if (!entity.name || entity.name.trim().length === 0) {
    errors.push('Nombre requerido');
  }
  
  if (!entity.taxId || !isValidTaxId(entity.taxId)) {
    errors.push('NIF/CIF inválido');
  }
  
  if (entity.email && !isValidEmail(entity.email)) {
    errors.push('Email inválido');
  }
  
  if (entity.phone && !isValidPhone(entity.phone)) {
    errors.push('Teléfono inválido');
  }
  
  if (entity.iban && !isValidIBAN(entity.iban)) {
    errors.push('IBAN inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
