import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';
import { mockTickets, mockMessages, mockDashboardData, mockStats, mockReports } from '../data/mockData';

// Modo de demostración (cambiar a false cuando el backend esté listo)
// TODO: Implementar endpoints faltantes en backend: /dashboard, /stats, /reports
const DEMO_MODE = true;

class SoporteService {
  // ============ TICKETS ============
  
  async getTickets(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Filtrar por empresaId si se proporciona
      let tickets = mockTickets;
      if (params.empresaId) {
        tickets = tickets.filter(t => t.empresaId === params.empresaId);
      }
      if (params.tablonId) {
        tickets = tickets.filter(t => t.tablonId === params.tablonId);
      }
      return tickets;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.tickets, { params });
    return response.data;
  }

  async getTicketById(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticket = mockTickets.find(t => t.id === parseInt(id));
      if (!ticket) throw new Error('Ticket no encontrado');
      return ticket;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.ticketById(id));
    return response.data;
  }

  async createTicket(ticketData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...ticketData, id: mockTickets.length + 1 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.soporte.tickets, ticketData);
    return response.data;
  }

  async updateTicket(id, ticketData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticket = mockTickets.find(t => t.id === parseInt(id));
      return { ...ticket, ...ticketData };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.soporte.ticketById(id), ticketData);
    return response.data;
  }

  async deleteTicket(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.delete(API_ENDPOINTS.soporte.ticketById(id));
    return response.data;
  }

  async assignTicket(id, usuarioId) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticket = mockTickets.find(t => t.id === parseInt(id));
      return { ...ticket, asignadoA: { id: usuarioId, nombre: 'Usuario Asignado' } };
    }
    const response = await axiosInstance.post(`${API_ENDPOINTS.soporte.ticketById(id)}/asignar`, {
      usuarioId,
    });
    return response.data;
  }

  async changeTicketStatus(id, status) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticket = mockTickets.find(t => t.id === parseInt(id));
      return { ...ticket, estado: status, fechaActualizacion: new Date().toISOString() };
    }
    const response = await axiosInstance.patch(`${API_ENDPOINTS.soporte.ticketById(id)}/estado`, {
      estado: status,
    });
    return response.data;
  }

  async escalateTicket(id, motivo) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, message: 'Ticket escalado correctamente' };
    }
    const response = await axiosInstance.post(`${API_ENDPOINTS.soporte.ticketById(id)}/escalar`, {
      motivo,
    });
    return response.data;
  }

  // ============ CONVERSACIÓN ============
  
  async getConversation(ticketId) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockMessages[ticketId] || [];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.conversation(ticketId));
    return response.data;
  }

  async addMessage(ticketId, messageData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newMessage = {
        id: Date.now(),
        ticketId: parseInt(ticketId),
        ...messageData,
        autor: { id: 1, nombre: 'Usuario Actual', rol: 'Usuario' },
        fechaCreacion: new Date().toISOString(),
        adjuntos: [],
      };
      return newMessage;
    }
    const response = await axiosInstance.post(
      API_ENDPOINTS.soporte.conversation(ticketId),
      messageData
    );
    return response.data;
  }

  // ============ ADJUNTOS ============
  
  async getAttachments(ticketId) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.attachments(ticketId));
    return response.data;
  }

  async uploadAttachment(ticketId, file, messageId = null) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        id: Date.now(),
        nombre: file.name,
        url: '#',
        tamano: file.size,
      };
    }
    const formData = new FormData();
    formData.append('file', file);
    if (messageId) {
      formData.append('messageId', messageId);
    }

    const response = await axiosInstance.post(
      API_ENDPOINTS.soporte.attachments(ticketId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async deleteAttachment(ticketId, attachmentId) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.soporte.attachments(ticketId)}/${attachmentId}`
    );
    return response.data;
  }

  // ============ AUDITORÍA ============
  
  async getAuditLog(ticketId) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.audit(ticketId));
    return response.data;
  }

  // ============ SLA ============
  
  async getSLAList() {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.sla);
    return response.data;
  }

  async getSLAById(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return null;
    }
    const response = await axiosInstance.get(`${API_ENDPOINTS.soporte.sla}/${id}`);
    return response.data;
  }

  // ============ DASHBOARD ============
  
  async getDashboardData() {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDashboardData[1];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.dashboard);
    return response.data;
  }

  async getStats(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockStats[1];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.stats);
    return response.data;
  }

  // ============ SLA MANAGEMENT ============
  
  async getSLAs(empresaId = null) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const slas = [
        {
          id: 1,
          nombre: 'SLA Premium',
          descripcion: 'Soporte premium para clientes VIP',
          prioridad: 'alta',
          tiempoRespuesta: 2,
          tiempoResolucion: 8,
          unidadTiempoRespuesta: 'horas',
          unidadTiempoResolucion: 'horas',
          empresa: 'Empresa A',
          empresaId: 1,
          departamento: 'TI',
          activo: true,
        },
        {
          id: 2,
          nombre: 'SLA Estándar',
          descripcion: 'Soporte estándar para todos los usuarios',
          prioridad: 'media',
          tiempoRespuesta: 4,
          tiempoResolucion: 24,
          unidadTiempoRespuesta: 'horas',
          unidadTiempoResolucion: 'horas',
          empresaId: 1,
          activo: true,
        },
      ];
      return empresaId ? slas.filter(s => s.empresaId === empresaId) : slas;
    }
    const params = empresaId ? { empresaId } : {};
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.sla, { params });
    return response.data;
  }

  async getSLAStats() {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        cumplimiento: 92,
        enRiesgo: 5,
        incumplimientos: 3,
      };
    }
    const response = await axiosInstance.get(`${API_ENDPOINTS.soporte.sla}/stats`);
    return response.data;
  }

  async createSLA(slaData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { ...slaData, id: Date.now() };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.soporte.sla, slaData);
    return response.data;
  }

  async updateSLA(id, slaData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { ...slaData, id };
    }
    const response = await axiosInstance.put(`${API_ENDPOINTS.soporte.sla}/${id}`, slaData);
    return response.data;
  }

  async deleteSLA(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.delete(`${API_ENDPOINTS.soporte.sla}/${id}`);
    return response.data;
  }

  // ============ REPORTES ============
  
  async getReports(filters = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const empresaId = filters.empresaId || 1;
      return mockReports[empresaId] || mockReports[1];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.reports, { params: filters });
    return response.data;
  }

  async exportReports(filters, format) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, message: `Reporte exportado en ${format}` };
    }
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.soporte.reports}/export`,
      { filters, format },
      { responseType: 'blob' }
    );
    return response.data;
  }

  // ============ CONFIGURACIÓN - TABLONES ============
  
  async getTablenes(empresaId = null) {
    // Por ahora devolver datos mock - endpoint no implementado en backend
    await new Promise(resolve => setTimeout(resolve, 300));
    const tablones = [
      {
        id: 1,
        nombre: 'Soporte TI',
        descripcion: 'Tickets de soporte técnico e infraestructura',
        empresaId: 1,
        empresaNombre: 'Acme Corp',
        departamentoId: 1,
        departamentoNombre: 'TI',
        color: '#3b82f6',
        icono: '💻',
        activo: true,
      },
      {
        id: 2,
        nombre: 'RRHH',
        descripcion: 'Consultas y solicitudes de recursos humanos',
        empresaId: 1,
        empresaNombre: 'Acme Corp',
        departamentoId: 2,
        departamentoNombre: 'Recursos Humanos',
        color: '#10b981',
        icono: '👥',
        activo: true,
      },
      {
        id: 3,
        nombre: 'Finanzas',
        descripcion: 'Tickets relacionados con facturación y pagos',
        empresaId: 1,
        empresaNombre: 'Acme Corp',
        departamentoId: 3,
        departamentoNombre: 'Finanzas',
        color: '#f59e0b',
        icono: '💰',
        activo: true,
      },
    ];
    return tablones;
  }

  async createTablon(tablonData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { ...tablonData, id: Date.now() };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.soporte.tablones, tablonData);
    return response.data;
  }

  async updateTablon(id, tablonData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { ...tablonData, id };
    }
    const response = await axiosInstance.put(`${API_ENDPOINTS.soporte.tablones}/${id}`, tablonData);
    return response.data;
  }

  async deleteTablon(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.delete(`${API_ENDPOINTS.soporte.tablones}/${id}`);
    return response.data;
  }

  // ============ CONFIGURACIÓN - CATEGORÍAS ============
  
  async getCategorias() {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { id: 1, nombre: 'Hardware', descripcion: 'Problemas de hardware', color: '#3b82f6', icono: '🖥️' },
        { id: 2, nombre: 'Software', descripcion: 'Problemas de software', color: '#10b981', icono: '💾' },
        { id: 3, nombre: 'Red', descripcion: 'Problemas de red', color: '#f59e0b', icono: '🌐' },
        { id: 4, nombre: 'Seguridad', descripcion: 'Seguridad informática', color: '#ef4444', icono: '🔒' },
      ];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.categorias);
    return response.data;
  }

  async createCategoria(categoriaData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { ...categoriaData, id: Date.now() };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.soporte.categorias, categoriaData);
    return response.data;
  }

  async deleteCategoria(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.delete(`${API_ENDPOINTS.soporte.categorias}/${id}`);
    return response.data;
  }

  // ============ CONFIGURACIÓN - PRIORIDADES ============
  
  async getPrioridades() {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { id: 1, nombre: 'Crítica', nivel: 'critica', slaHoras: 2 },
        { id: 2, nombre: 'Alta', nivel: 'alta', slaHoras: 8 },
        { id: 3, nombre: 'Media', nivel: 'media', slaHoras: 24 },
        { id: 4, nombre: 'Baja', nivel: 'baja', slaHoras: 72 },
      ];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.prioridades);
    return response.data;
  }

  // ============ CONFIGURACIÓN - NOTIFICACIONES ============
  
  async getNotificaciones() {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        emailNuevoTicket: true,
        emailAsignacion: true,
        emailCambioEstado: true,
        emailComentario: true,
        emailEscalamiento: true,
        slaAlerta: true,
        slaVencimiento: true,
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.notificaciones);
    return response.data;
  }

  async updateNotificaciones(notificaciones) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.soporte.notificaciones, notificaciones);
    return response.data;
  }

  // ============ CONFIGURACIÓN DE EMPRESA ============
  
  async getEmpresaConfig(empresaId) {
    // Por ahora devolver configuración mock ya que el endpoint no está implementado
    // La info de la empresa viene del token JWT
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      tablones: await this.getTablenes(empresaId),
      categorias: await this.getCategorias(),
      prioridades: await this.getPrioridades(),
      estados: [
        { id: 1, nombre: 'Nuevo', color: '#3b82f6', orden: 1, tipo: 'inicial' },
        { id: 2, nombre: 'Asignado', color: '#8b5cf6', orden: 2, tipo: 'proceso' },
        { id: 3, nombre: 'En Proceso', color: '#f59e0b', orden: 3, tipo: 'proceso' },
        { id: 4, nombre: 'Resuelto', color: '#10b981', orden: 4, tipo: 'final' },
        { id: 5, nombre: 'Cerrado', color: '#6b7280', orden: 5, tipo: 'final' },
      ],
      campos: [],
      notificaciones: await this.getNotificaciones(),
      tema: {
        primary: '#3b82f6',
        secondary: '#10b981',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#0ea5e9',
      },
    };
  }
}

export default new SoporteService();
