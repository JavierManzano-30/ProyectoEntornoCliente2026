import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';
import { mockTickets, mockMessages, mockDashboardData, mockStats } from '../data/mockData';

// Modo de demostración (cambiar a false cuando el backend esté listo)
const DEMO_MODE = true;

class SoporteService {
  // ============ TICKETS ============
  
  async getTickets(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTickets;
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
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockDashboardData;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.dashboard);
    return response.data;
  }

  async getStats(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockStats;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.soporte.stats, { params });
    return response.data;
  }
}

export default new SoporteService();
