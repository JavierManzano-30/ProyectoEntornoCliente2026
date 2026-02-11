import { DATE_CONFIG } from '../config';

/**
 * Formatear fecha para mostrar
 */
export const formatDate = (date, format = DATE_CONFIG.DEFAULT_DATE_FORMAT) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hours)
    .replace('mm', minutes);
};

/**
 * Formatear fecha para API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Obtener período actual
 */
export const getCurrentPeriod = (type = 'monthly') => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  if (type === 'monthly') {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return { startDate, endDate };
  }
  
  if (type === 'quarterly') {
    const quarter = Math.floor(month / 3);
    const startDate = new Date(year, quarter * 3, 1);
    const endDate = new Date(year, (quarter + 1) * 3, 0);
    return { startDate, endDate };
  }
  
  if (type === 'yearly') {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    return { startDate, endDate };
  }
  
  return { startDate: now, endDate: now };
};

/**
 * Truncar texto largo
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Obtener iniciales de nombre
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generar color basado en string (para avatars)
 */
export const stringToColor = (str) => {
  if (!str) return '#999';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 65%, 50%)`;
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Descargar archivo blob
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Copiar al portapapeles
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
