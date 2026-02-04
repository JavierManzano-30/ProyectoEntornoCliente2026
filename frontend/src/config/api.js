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
    reports: '/soporte/reportes',
    tablones: '/soporte/tablones',
    categorias: '/soporte/categorias',
    prioridades: '/soporte/prioridades',
    notificaciones: '/soporte/notificaciones',
    config: '/soporte/config',
  },
  // Módulo CRM
  crm: {
    customers: '/crm/clientes',
    customerById: (id) => `/crm/clientes/${id}`,
    leads: '/crm/leads',
    leadById: (id) => `/crm/leads/${id}`,
    opportunities: '/crm/oportunidades',
    opportunityById: (id) => `/crm/oportunidades/${id}`,
    activities: '/crm/actividades',
    activityById: (id) => `/crm/actividades/${id}`,
    dashboard: '/crm/dashboard',
    stats: '/crm/estadisticas',
  },
};
