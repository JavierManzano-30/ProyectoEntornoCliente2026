import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';
import { mockCustomers, mockLeads, mockOpportunities, mockActivities, mockDashboardData } from '../data/mockData';

// Modo de demostración (cambiar a false cuando el backend esté listo)
const DEMO_MODE = true;

class CRMService {
  // ============ CLIENTES ============
  
  async getCustomers(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCustomers.filter(c => c.tipo === 'cliente');
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.customers, { params });
    return response.data;
  }

  async getCustomerById(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const customer = mockCustomers.find(c => c.id === parseInt(id));
      if (!customer) throw new Error('Cliente no encontrado');
      return customer;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.customerById(id));
    return response.data;
  }

  async createCustomer(customerData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...customerData, id: mockCustomers.length + 1 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.crm.customers, customerData);
    return response.data;
  }

  async updateCustomer(id, customerData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const customer = mockCustomers.find(c => c.id === parseInt(id));
      return { ...customer, ...customerData };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.crm.customerById(id), customerData);
    return response.data;
  }

  async deleteCustomer(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.delete(API_ENDPOINTS.crm.customerById(id));
    return response.data;
  }

  // ============ LEADS ============
  
  async getLeads(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockLeads;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.leads, { params });
    return response.data;
  }

  async getLeadById(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const lead = mockLeads.find(l => l.id === parseInt(id));
      if (!lead) throw new Error('Lead no encontrado');
      return lead;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.leadById(id));
    return response.data;
  }

  async createLead(leadData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...leadData, id: mockLeads.length + 1 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.crm.leads, leadData);
    return response.data;
  }

  async updateLead(id, leadData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const lead = mockLeads.find(l => l.id === parseInt(id));
      return { ...lead, ...leadData };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.crm.leadById(id), leadData);
    return response.data;
  }

  async deleteLead(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.delete(API_ENDPOINTS.crm.leadById(id));
    return response.data;
  }

  async convertLead(id, conversionData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        success: true, 
        customerId: Math.floor(Math.random() * 1000),
        opportunityId: Math.floor(Math.random() * 1000),
      };
    }
    const response = await axiosInstance.post(`${API_ENDPOINTS.crm.leadById(id)}/convertir`, conversionData);
    return response.data;
  }

  // ============ OPORTUNIDADES ============
  
  async getOpportunities(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockOpportunities;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.opportunities, { params });
    return response.data;
  }

  async getOpportunityById(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const opportunity = mockOpportunities.find(o => o.id === parseInt(id));
      if (!opportunity) throw new Error('Oportunidad no encontrada');
      return opportunity;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.opportunityById(id));
    return response.data;
  }

  async createOpportunity(opportunityData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...opportunityData, id: mockOpportunities.length + 1 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.crm.opportunities, opportunityData);
    return response.data;
  }

  async updateOpportunity(id, opportunityData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const opportunity = mockOpportunities.find(o => o.id === parseInt(id));
      return { ...opportunity, ...opportunityData };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.crm.opportunityById(id), opportunityData);
    return response.data;
  }

  async deleteOpportunity(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.delete(API_ENDPOINTS.crm.opportunityById(id));
    return response.data;
  }

  async updateOpportunityStage(id, stage) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const opportunity = mockOpportunities.find(o => o.id === parseInt(id));
      return { ...opportunity, fase: stage, fechaActualizacion: new Date().toISOString() };
    }
    const response = await axiosInstance.patch(`${API_ENDPOINTS.crm.opportunityById(id)}/fase`, { fase: stage });
    return response.data;
  }

  // ============ ACTIVIDADES ============
  
  async getActivities(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockActivities;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.activities, { params });
    return response.data;
  }

  async getActivityById(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const activity = mockActivities.find(a => a.id === parseInt(id));
      if (!activity) throw new Error('Actividad no encontrada');
      return activity;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.activityById(id));
    return response.data;
  }

  async createActivity(activityData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...activityData, id: mockActivities.length + 1 };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.crm.activities, activityData);
    return response.data;
  }

  async updateActivity(id, activityData) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const activity = mockActivities.find(a => a.id === parseInt(id));
      return { ...activity, ...activityData };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.crm.activityById(id), activityData);
    return response.data;
  }

  async deleteActivity(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await axiosInstance.delete(API_ENDPOINTS.crm.activityById(id));
    return response.data;
  }

  async completeActivity(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const activity = mockActivities.find(a => a.id === parseInt(id));
      return { ...activity, estado: 'completada', fechaCompletado: new Date().toISOString() };
    }
    const response = await axiosInstance.patch(`${API_ENDPOINTS.crm.activityById(id)}/completar`);
    return response.data;
  }

  // ============ DASHBOARD ============
  
  async getDashboardData(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDashboardData;
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.dashboard, { params });
    return response.data;
  }

  async getStats(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        totalCustomers: mockCustomers.length,
        totalLeads: mockLeads.length,
        totalOpportunities: mockOpportunities.length,
        totalActivities: mockActivities.length,
      };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.crm.stats, { params });
    return response.data;
  }
}

export default new CRMService();
