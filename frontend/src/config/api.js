// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Autenticación
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  // Módulo Soporte
  soporte: {
    tickets: '/soporte/tickets',
    ticketById: (id) => `/soporte/tickets/${id}`,
    conversation: (ticketId) => `/soporte/tickets/${ticketId}/conversacion`,
    attachments: (ticketId) => `/soporte/tickets/${ticketId}/adjuntos`,
    audit: (ticketId) => `/soporte/tickets/${ticketId}/auditoria`,
    sla: '/soporte/sla',
    escalation: '/soporte/escalados',
    dashboard: '/soporte/dashboard',
    stats: '/soporte/estadisticas',
  },
};
