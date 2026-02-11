import { CURRENCY_CONFIG } from '../config';

/**
 * Formatear monto en moneda
 */
export const formatCurrency = (amount, currency = CURRENCY_CONFIG.DEFAULT_CURRENCY) => {
  if (amount === null || amount === undefined) return '-';
  
  const formatted = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: CURRENCY_CONFIG.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY_CONFIG.DECIMAL_PLACES
  }).format(amount);
  
  return formatted;
};

/**
 * Formatear número sin símbolo de moneda
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Formatear porcentaje
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  return `${formatNumber(value, decimals)}%`;
};

/**
 * Calcular balance (debe - haber)
 */
export const calculateBalance = (debit, credit) => {
  const debitAmount = parseFloat(debit) || 0;
  const creditAmount = parseFloat(credit) || 0;
  return debitAmount - creditAmount;
};

/**
 * Validar que un asiento esté balanceado (debe = haber)
 */
export const isEntryBalanced = (lines) => {
  const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
  
  // Comparar con tolerancia para errores de punto flotante
  return Math.abs(totalDebit - totalCredit) < 0.01;
};

/**
 * Obtener totales de asiento
 */
export const getEntryTotals = (lines) => {
  const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
  const balance = totalDebit - totalCredit;
  
  return {
    totalDebit,
    totalCredit,
    balance,
    isBalanced: Math.abs(balance) < 0.01
  };
};

/**
 * Generar código de cuenta contable
 */
export const generateAccountCode = (parentCode, sequence) => {
  if (!parentCode) {
    return sequence.toString().padStart(4, '0');
  }
  return `${parentCode}.${sequence.toString().padStart(2, '0')}`;
};

/**
 * Validar código de cuenta
 */
export const isValidAccountCode = (code) => {
  // Debe seguir el patrón: XXXX o XXXX.XX o XXXX.XX.XX
  const pattern = /^\d{4}(\.\d{2})*$/;
  return pattern.test(code);
};

/**
 * Obtener nivel de cuenta (por puntos en el código)
 */
export const getAccountLevel = (code) => {
  if (!code) return 0;
  return code.split('.').length;
};

/**
 * Obtener cuenta padre
 */
export const getParentAccount = (code) => {
  if (!code || !code.includes('.')) return null;
  const parts = code.split('.');
  parts.pop();
  return parts.join('.');
};

/**
 * Convertir tipo de cuenta a signo para balance
 * Activo y Gasto: Debe positivo
 * Pasivo, Patrimonio e Ingreso: Haber positivo
 */
export const getAccountSign = (accountType, amount, isDebit) => {
  const debitTypes = ['asset', 'expense'];
  const creditTypes = ['liability', 'equity', 'revenue'];
  
  if (debitTypes.includes(accountType)) {
    return isDebit ? amount : -amount;
  } else if (creditTypes.includes(accountType)) {
    return isDebit ? -amount : amount;
  }
  
  return isDebit ? amount : -amount;
};
