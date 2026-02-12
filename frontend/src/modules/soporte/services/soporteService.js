import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';

const normalizeValue = (value) => (value == null ? '' : String(value).trim().toLowerCase());

const normalizeStatus = (status) => {
  const normalized = normalizeValue(status).replace(/\s+/g, '_');

  const map = {
    open: 'pendiente',
    nuevo: 'pendiente',
    pending: 'pendiente',
    assigned: 'asignado',
    asignado: 'asignado',
    in_progress: 'en_progreso',
    en_proceso: 'en_progreso',
    en_progreso: 'en_progreso',
    resolved: 'resuelto',
    resuelto: 'resuelto',
    closed: 'cerrado',
    cerrado: 'cerrado',
    cancelled: 'cancelado',
    canceled: 'cancelado',
    cancelado: 'cancelado',
    waiting_customer: 'esperando_cliente',
    esperando_cliente: 'esperando_cliente',
  };

  return map[normalized] || normalized;
};

const normalizePriority = (priority) => {
  const normalized = normalizeValue(priority).replace(/\s+/g, '_');

  const map = {
    low: 'baja',
    medium: 'media',
    high: 'alta',
    critical: 'critica',
  };

  return map[normalized] || normalized;
};

const normalizeCategory = (category) => {
  const normalized = normalizeValue(category).replace(/\s+/g, '_');

  const map = {
    technical: 'incidencia',
    billing: 'consulta',
    request: 'peticion',
    bug: 'error',
    improvement: 'mejora',
  };

  return map[normalized] || normalized;
};

const mapTicket = (ticket = {}) => ({
  id: ticket.id,
  titulo: ticket.title,
  descripcion: ticket.description,
  categoria: normalizeCategory(ticket.category),
  prioridad: normalizePriority(ticket.priority),
  estado: normalizeStatus(ticket.status),
  empresaId: ticket.company_id,
  creadorId: ticket.creator_id,
  asignadoA: ticket.assigned_to,
  fechaCreacion: ticket.created_at,
  fechaActualizacion: ticket.updated_at,
  fechaCierre: ticket.closed_at,
});

const mapTimelineItem = (item = {}) => {
  if (item.type === 'message') {
    return {
      id: item.id,
      tipo: 'mensaje',
      ticketId: item.ticketId,
      usuarioId: item.userId,
      contenido: item.content,
      interno: item.isInternal,
      fechaCreacion: item.createdAt,
    };
  }

  return {
    id: item.id,
    tipo: 'auditoria',
    ticketId: item.ticketId,
    usuarioId: item.userId,
    accion: item.action,
    valorAnterior: item.oldValue,
    valorNuevo: item.newValue,
    fechaCreacion: item.createdAt,
  };
};

class SoporteService {
  async getTickets(params = {}) {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.tickets, { params });
    return (response.data || []).map(mapTicket);
  }

  async getTicketById(id) {
    const tickets = await this.getTickets();
    const ticket = tickets.find((t) => String(t.id) === String(id));
    if (!ticket) throw new Error('Ticket no encontrado');
    return ticket;
  }

  async createTicket(ticketData) {
    const payload = {
      title: ticketData.titulo || ticketData.title,
      description: ticketData.descripcion || ticketData.description,
      category: ticketData.categoria || ticketData.category,
      priority: ticketData.prioridad || ticketData.priority,
    };

    const response = await axiosInstance.post(API_ENDPOINTS.soporte.tickets, payload);
    return mapTicket(response.data);
  }

  async updateTicket(id, ticketData) {
    if (ticketData.estado) {
      return this.changeTicketStatus(id, ticketData.estado);
    }
    throw new Error('Actualizacion de ticket no implementada en backend');
  }

  async deleteTicket() {
    throw new Error('Eliminacion de tickets no implementada en backend');
  }

  async assignTicket(id, usuarioId) {
    const response = await axiosInstance.patch(API_ENDPOINTS.soporte.assign(id), {
      assignedTo: usuarioId,
    });
    return response.data;
  }

  async changeTicketStatus(id, status) {
    if (status === 'cerrado' || status === 'closed') {
      const response = await axiosInstance.patch(API_ENDPOINTS.soporte.close(id));
      return response.data;
    }
    throw new Error('Cambio de estado solo soporta cierre en backend actual');
  }

  async escalateTicket() {
    throw new Error('Escalamiento no implementado en backend');
  }

  async getConversation(ticketId) {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.timeline(ticketId));
    return (response.data || [])
      .map(mapTimelineItem)
      .filter((item) => item.tipo === 'mensaje');
  }

  async addMessage(ticketId, messageData) {
    const response = await axiosInstance.post(API_ENDPOINTS.soporte.conversation(ticketId), {
      content: messageData.contenido || messageData.content,
      isInternal: Boolean(messageData.interno || messageData.isInternal),
    });
    return response.data;
  }

  async getAttachments() {
    return [];
  }

  async uploadAttachment() {
    throw new Error('Adjuntos no implementados en backend');
  }

  async deleteAttachment() {
    throw new Error('Adjuntos no implementados en backend');
  }

  async getAuditLog(ticketId) {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.timeline(ticketId));
    return (response.data || [])
      .map(mapTimelineItem)
      .filter((item) => item.tipo === 'auditoria');
  }

  async getSLAList() {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.sla);
    return response.data || [];
  }

  async getSLAById(id) {
    const all = await this.getSLAList();
    return (all || []).find((s) => String(s.id) === String(id)) || null;
  }

  async getDashboardData() {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.dashboard);
    const data = response.data || {};

    return {
      ...data,
      ticketsRecientes: (data.ticketsRecientes || []).map(mapTicket),
      actividadEquipo: data.actividadEquipo || [],
    };
  }

  async getStats() {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.stats);
    return response.data || {};
  }

  async getSLAs() {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.sla);
    return response.data || [];
  }

  async getSLAStats() {
    const stats = await this.getStats();
    return {
      cumplimiento: stats.cumplimientoSLA || 0,
      enRiesgo: stats.slaEnRiesgo || 0,
      incumplimientos: stats.slaIncumplidos || 0,
    };
  }

  async createSLA() {
    throw new Error('Creacion de SLA no implementada en backend');
  }

  async updateSLA() {
    throw new Error('Actualizacion de SLA no implementada en backend');
  }

  async deleteSLA() {
    throw new Error('Eliminacion de SLA no implementada en backend');
  }

  async getReports() {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.reports);
    return response.data || [];
  }

  async exportReports() {
    throw new Error('Exportacion de reportes no implementada en backend');
  }

  async getTablenes() {
    return [];
  }

  async createTablon() {
    throw new Error('Tablones no implementados en backend');
  }

  async updateTablon() {
    throw new Error('Tablones no implementados en backend');
  }

  async deleteTablon() {
    throw new Error('Tablones no implementados en backend');
  }

  async getCategorias() {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.categorias);
    return response.data || [];
  }

  async createCategoria() {
    throw new Error('Categorias personalizadas no implementadas en backend');
  }

  async deleteCategoria() {
    throw new Error('Categorias personalizadas no implementadas en backend');
  }

  async getPrioridades() {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.prioridades);
    return response.data || [];
  }

  async getNotificaciones() {
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.notificaciones);
    return response.data || {};
  }

  async updateNotificaciones() {
    throw new Error('Actualizacion de notificaciones no implementada en backend');
  }

  async getEmpresaConfig() {
    const [categorias, prioridades, notificaciones, sla] = await Promise.all([
      this.getCategorias(),
      this.getPrioridades(),
      this.getNotificaciones(),
      this.getSLAs(),
    ]);

    return {
      tablones: [],
      categorias,
      prioridades,
      estados: [],
      campos: [],
      notificaciones,
      tema: {
        primary: '#3b82f6',
        secondary: '#10b981',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#0ea5e9',
      },
      sla,
    };
  }
}

export default new SoporteService();
