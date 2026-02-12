// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

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
    tickets: '/support/tickets',
    ticketById: (id) => `/support/tickets/${id}`,
    conversation: (ticketId) => `/support/tickets/${ticketId}/messages`,
    attachments: (ticketId) => `/support/tickets/${ticketId}/adjuntos`,
    audit: (ticketId) => `/support/tickets/${ticketId}/timeline`,
    sla: '/support/sla',
    escalation: '/support/escalados',
    dashboard: '/support/dashboard',
    stats: '/support/stats',
    reports: '/support/reportes',
    tablones: '/support/tablones',
    categorias: '/support/categorias',
    prioridades: '/support/prioridades',
    notificaciones: '/support/notificaciones',
    config: '/support/config',
  },
  // Módulo CRM
  crm: {
    customers: '/crm/customers',
    customerById: (id) => `/crm/customers/${id}`,
    leads: '/crm/leads',
    leadById: (id) => `/crm/leads/${id}`,
    opportunities: '/crm/opportunities',
    opportunityById: (id) => `/crm/opportunities/${id}`,
    activities: '/crm/activities',
    activityById: (id) => `/crm/activities/${id}`,
    dashboard: '/crm/dashboard',
    stats: '/crm/stats',
    contacts: '/crm/contacts',
    contactById: (id) => `/crm/contacts/${id}`,
  },
  // Módulo BI
  bi: {
    kpis: '/bi/kpis',
    dashboard: '/bi/dashboard',
    reports: '/bi/reports',
    reportById: (id) => `/bi/reports/${id}`,
    runReport: (id) => `/bi/reports/${id}/run`,
    datasets: '/bi/datasets',
    datasetById: (id) => `/bi/datasets/${id}`,
    alerts: '/bi/alertas',
    metrics: '/bi/metricas',
    metricById: (id) => `/bi/metricas/${id}`,
  },
};
