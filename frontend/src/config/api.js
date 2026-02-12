// Configuracion de la API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const API_ENDPOINTS = {
  // Autenticacion
  auth: {
    login: '/core/auth/login',
    register: '/core/auth/register',
  },

  // Modulo Core
  core: {
    companies: '/core/companies',
    companyById: (id) => `/core/companies/${id}`,
    users: '/core/usuarios',
    userById: (id) => `/core/usuarios/${id}`,
    roles: '/core/roles',
    roleById: (id) => `/core/roles/${id}`,
    dashboard: '/core/dashboard',
  },

  // Modulo Soporte
  soporte: {
    tickets: '/support/tickets',
    ticketById: (id) => `/support/tickets/${id}`,
    conversation: (ticketId) => `/support/tickets/${ticketId}/messages`,
    assign: (ticketId) => `/support/tickets/${ticketId}/assign`,
    close: (ticketId) => `/support/tickets/${ticketId}/close`,
    timeline: (ticketId) => `/support/tickets/${ticketId}/timeline`,
    dashboard: '/support/dashboard',
    stats: '/support/stats',
    reports: '/support/reportes',
    sla: '/support/sla',
    categorias: '/support/categorias',
    prioridades: '/support/prioridades',
    notificaciones: '/support/notificaciones',
  },

  // Modulo CRM
  crm: {
    customers: '/crm/customers',
    customerById: (id) => `/crm/customers/${id}`,
    contacts: '/crm/contacts',
    contactById: (id) => `/crm/contacts/${id}`,
    opportunities: '/crm/opportunities',
    opportunityById: (id) => `/crm/opportunities/${id}`,
    activities: '/crm/activities',
    activityById: (id) => `/crm/activities/${id}`,
    pipelines: '/crm/config/pipelines',
  },

  // Modulo BI
  bi: {
    kpis: '/bi/kpis',
    dashboard: '/bi/dashboard',
    reports: '/bi/reports',
    reportById: (id) => `/bi/reports/${id}`,
    runReport: (id) => `/bi/reports/${id}/run`,
    alerts: '/bi/alertas',
    datasets: '/bi/datasets',
    metricById: (id) => `/bi/metrics/${id}`,
  },
};
