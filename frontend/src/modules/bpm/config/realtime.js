import { API_BASE_URL } from '../../../config/api';

const normalizeBaseUrl = (baseUrl) => baseUrl.replace(/\/+$/, '');

const toWebSocketUrl = (baseUrl) => {
  const normalized = normalizeBaseUrl(baseUrl);
  if (normalized.startsWith('https://')) {
    return normalized.replace(/^https:\/\//, 'wss://');
  }
  if (normalized.startsWith('http://')) {
    return normalized.replace(/^http:\/\//, 'ws://');
  }
  return normalized;
};

export const BPM_WS_URL = import.meta.env.VITE_BPM_WS_URL
  || `${toWebSocketUrl(API_BASE_URL).replace(/\/api$/, '')}/bpm/ws`;

export const BPM_REALTIME_ENABLED = Boolean(import.meta.env.VITE_BPM_WS_URL);
