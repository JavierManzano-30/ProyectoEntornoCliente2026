import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';

const normalizeValue = (value) => (value == null ? '' : String(value).trim().toLowerCase());

const FRONTEND_TO_BACKEND_STATUS = {
  pendiente: 'open',
  asignado: 'open',
  en_progreso: 'in_progress',
  resuelto: 'resolved',
  cerrado: 'closed',
  open: 'open',
  in_progress: 'in_progress',
  resolved: 'resolved',
  closed: 'closed',
};

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
    urgent: 'critica',
    critical: 'critica',
  };

  return map[normalized] || normalized;
};

const normalizeCategory = (category) => {
  const normalized = normalizeValue(category).replace(/\s+/g, '_');

  const map = {
    technical: 'incidencia',
    billing: 'consulta',
    other: 'peticion',
    request: 'peticion',
    bug: 'error',
    improvement: 'mejora',
  };

  return map[normalized] || normalized;
};

const mapTicket = (ticket = {}) => {
  const assignedTo = ticket.assigned_to ?? ticket.asignadoA ?? null;
  const normalizedStatus = normalizeStatus(ticket.status ?? ticket.estado);

  return {
    id: ticket.id,
    titulo: ticket.title ?? ticket.titulo,
    descripcion: ticket.description ?? ticket.descripcion,
    categoria: normalizeCategory(ticket.category ?? ticket.categoria),
    prioridad: normalizePriority(ticket.priority ?? ticket.prioridad),
    estado: normalizedStatus,
    empresaId: ticket.company_id ?? ticket.empresaId,
    creadorId: ticket.creator_id ?? ticket.creadorId,
    asignadoA: assignedTo,
    fechaCreacion: ticket.created_at ?? ticket.fechaCreacion,
    fechaActualizacion: ticket.updated_at ?? ticket.fechaActualizacion,
    fechaCierre: ticket.closed_at ?? ticket.fechaCierre,
  };
};

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
    if (ticketData.estado || Object.prototype.hasOwnProperty.call(ticketData, 'asignadoA')) {
      return this.moveTicketToStatus(id, ticketData.estado, {
        assignedTo: ticketData.asignadoA,
      });
    }
    throw new Error('Actualizacion de ticket no implementada en backend');
  }

  async deleteTicket() {
    throw new Error('Eliminacion de tickets no implementada en backend');
  }

  async assignTicket(id, usuarioId) {
    const response = await axiosInstance.patch(API_ENDPOINTS.soporte.status(id), {
      assignedTo: usuarioId || null,
    });
    return mapTicket(response.data);
  }

  async changeTicketStatus(id, status) {
    return this.moveTicketToStatus(id, status);
  }

  async moveTicketToStatus(id, status, options = {}) {
    const normalizedStatus = normalizeStatus(status);
    const backendStatus = FRONTEND_TO_BACKEND_STATUS[normalizedStatus];

    if (!backendStatus && !Object.prototype.hasOwnProperty.call(options, 'assignedTo')) {
      throw new Error(`Estado no soportado: ${status}`);
    }

    const payload = {};

    if (backendStatus) {
      payload.status = backendStatus;
    }

    if (normalizedStatus === 'pendiente') {
      payload.assignedTo = null;
    }

    if (normalizedStatus === 'asignado') {
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) {
        throw new Error('No se puede asignar el ticket sin usuario autenticado');
      }
      payload.assignedTo = currentUserId;
    }

    if (Object.prototype.hasOwnProperty.call(options, 'assignedTo')) {
      payload.assignedTo = options.assignedTo || null;
    }

    if (Object.keys(payload).length === 0) {
      throw new Error('No hay cambios para aplicar');
    }

    const response = await axiosInstance.patch(API_ENDPOINTS.soporte.status(id), payload);
    return mapTicket(response.data);
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
