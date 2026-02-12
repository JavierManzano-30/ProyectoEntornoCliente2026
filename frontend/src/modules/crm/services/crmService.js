import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';

const STAGE_FALLBACK_BY_SORT = ['prospecto', 'calificacion', 'propuesta', 'negociacion', 'ganada', 'perdida'];

let stageMapCache = null;

const normalizeNumber = (value) => Number(value || 0);
const ACTIVITY_TYPE_BACKEND_TO_UI = {
  call: 'llamada',
  email: 'email',
  meeting: 'reunion',
  note: 'nota',
  task: 'tarea',
  appointment: 'cita',
};

const ACTIVITY_TYPE_UI_TO_BACKEND = {
  llamada: 'call',
  email: 'email',
  reunion: 'meeting',
  nota: 'note',
  tarea: 'task',
  cita: 'appointment',
};

const resolveStageById = (stageId) => {
  if (!stageMapCache || !stageId) return 'prospecto';
  return stageMapCache.get(stageId) || 'prospecto';
};

const mapCustomer = (item = {}) => ({
  id: item.id,
  nombre: item.name,
  cif: item.taxId || '',
  estado: item.type === 'customer' ? 'activo' : 'inactivo',
  responsableId: item.responsibleId,
  responsable: item.responsibleId ? { id: item.responsibleId, nombre: 'Responsable' } : null,
  valorTotal: normalizeNumber(item.valorTotal ?? item.totalPipelineValue),
  email: item.email,
  telefono: item.phone,
  tipo: item.type,
  fechaCreacion: item.createdAt,
  fechaActualizacion: item.updatedAt,
  ciudad: item.city,
  direccion: item.address,
  notas: item.notes,
});

const mapLeadFromCustomer = (item = {}) => ({
  id: item.id,
  nombre: item.name,
  cif: item.taxId || '',
  fuente: 'sitio_web',
  estado: item.type === 'lead' ? 'nuevo' : 'calificado',
  responsableId: item.responsibleId,
  responsable: item.responsibleId ? { id: item.responsibleId, nombre: 'Responsable' } : null,
  valorEstimado: normalizeNumber(item.valorEstimado ?? item.totalPipelineValue),
  email: item.email,
  telefono: item.phone,
  descripcion: item.notes || '',
  fechaCreacion: item.createdAt,
  fechaActualizacion: item.updatedAt,
});

const mapOpportunity = (item = {}) => ({
  id: item.id,
  nombre: item.title,
  descripcion: item.description,
  fase: resolveStageById(item.stageId),
  clienteId: item.clientId,
  cliente: item.clientId ? { id: item.clientId, nombre: 'Cliente' } : null,
  valor: normalizeNumber(item.estimatedValue),
  probabilidad: normalizeNumber(item.probability),
  fechaCierreEstimada: item.expectedCloseDate,
  responsableId: item.responsibleId,
  responsable: item.responsibleId ? { id: item.responsibleId, nombre: 'Responsable' } : null,
  prioridad: 'media',
  pipelineId: item.pipelineId,
  stageId: item.stageId,
  sortOrder: item.sortOrder,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const mapActivity = (item = {}) => ({
  id: item.id,
  titulo: item.title || item.subject || '',
  descripcion: item.description,
  tipo: ACTIVITY_TYPE_BACKEND_TO_UI[item.type] || item.type || 'nota',
  estado: item.isCompleted || item.completed ? 'completada' : 'pendiente',
  responsableId: item.responsibleId || item.userId,
  responsable: item.responsibleId || item.userId ? { id: item.responsibleId || item.userId, nombre: 'Responsable' } : null,
  fechaProgramada: item.scheduledAt || item.activityAt,
  fechaCompletado: item.completedAt || null,
  clienteId: item.clientId,
  oportunidadId: item.opportunityId,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

async function ensureStageMap() {
  if (stageMapCache) return;

  stageMapCache = new Map();

  try {
    const response = await axiosInstance.get(API_ENDPOINTS.crm.pipelines);
    const pipelines = Array.isArray(response.data) ? response.data : [];
    pipelines.forEach((pipeline) => {
      (pipeline.stages || []).forEach((stage, index) => {
        const rawName = (stage.name || '').toLowerCase();
        let normalized = STAGE_FALLBACK_BY_SORT[index] || 'prospecto';

        if (rawName.includes('calif')) normalized = 'calificacion';
        if (rawName.includes('propu')) normalized = 'propuesta';
        if (rawName.includes('negoc')) normalized = 'negociacion';
        if (rawName.includes('won') || rawName.includes('ganad')) normalized = 'ganada';
        if (rawName.includes('lost') || rawName.includes('perdid')) normalized = 'perdida';

        stageMapCache.set(stage.id, normalized);
      });
    });
  } catch {
    // Fallback sin bloquear la UI.
  }
}

class CRMService {
  async getCustomers(params = {}) {
    const [customersResponse, opportunitiesResponse] = await Promise.all([
      axiosInstance.get(API_ENDPOINTS.crm.customers, { params }),
      axiosInstance.get(API_ENDPOINTS.crm.opportunities),
    ]);

    const items = Array.isArray(customersResponse.data) ? customersResponse.data : [];
    const opportunities = Array.isArray(opportunitiesResponse.data) ? opportunitiesResponse.data : [];

    const valueByClientId = opportunities.reduce((acc, opportunity) => {
      const clientId = opportunity.clientId;
      if (!clientId) return acc;
      const currentValue = acc.get(String(clientId)) || 0;
      acc.set(String(clientId), currentValue + normalizeNumber(opportunity.estimatedValue));
      return acc;
    }, new Map());

    return items.map((item) => mapCustomer({
      ...item,
      valorTotal: valueByClientId.get(String(item.id)) || 0,
    }));
  }

  async getCustomerById(id) {
    const response = await axiosInstance.get(API_ENDPOINTS.crm.customerById(id));
    return mapCustomer(response.data);
  }

  async createCustomer(customerData) {
    const payload = {
      name: customerData.nombre,
      taxId: customerData.cif,
      email: customerData.email,
      phone: customerData.telefono,
      address: customerData.direccion,
      city: customerData.ciudad,
      responsibleId: customerData.responsableId,
      type: customerData.tipo === 'lead' ? 'lead' : 'customer',
      notes: customerData.notas,
    };
    const response = await axiosInstance.post(API_ENDPOINTS.crm.customers, payload);
    return mapCustomer(response.data);
  }

  async updateCustomer(id, customerData) {
    const payload = {
      name: customerData.nombre,
      taxId: customerData.cif,
      email: customerData.email,
      phone: customerData.telefono,
      address: customerData.direccion,
      city: customerData.ciudad,
      responsibleId: customerData.responsableId,
      type: customerData.tipo === 'lead' ? 'lead' : 'customer',
      notes: customerData.notas,
    };
    const response = await axiosInstance.put(API_ENDPOINTS.crm.customerById(id), payload);
    return mapCustomer(response.data);
  }

  async deleteCustomer(id) {
    await axiosInstance.delete(API_ENDPOINTS.crm.customerById(id));
    return { success: true };
  }

  async getLeads(params = {}) {
    const [leadsResponse, opportunitiesResponse] = await Promise.all([
      axiosInstance.get(API_ENDPOINTS.crm.customers, { params: { ...params, type: 'lead' } }),
      axiosInstance.get(API_ENDPOINTS.crm.opportunities),
    ]);

    const items = Array.isArray(leadsResponse.data) ? leadsResponse.data : [];
    const opportunities = Array.isArray(opportunitiesResponse.data) ? opportunitiesResponse.data : [];

    const valueByClientId = opportunities.reduce((acc, opportunity) => {
      const clientId = opportunity.clientId;
      if (!clientId) return acc;
      const currentValue = acc.get(String(clientId)) || 0;
      acc.set(String(clientId), currentValue + normalizeNumber(opportunity.estimatedValue));
      return acc;
    }, new Map());

    return items.map((item) => mapLeadFromCustomer({
      ...item,
      valorEstimado: valueByClientId.get(String(item.id)) || 0,
    }));
  }

  async getLeadById(id) {
    const response = await axiosInstance.get(API_ENDPOINTS.crm.customerById(id));
    return mapLeadFromCustomer(response.data);
  }

  async createLead(leadData) {
    const payload = {
      name: leadData.nombre,
      taxId: leadData.cif,
      email: leadData.email,
      phone: leadData.telefono,
      responsibleId: leadData.responsableId,
      type: 'lead',
      notes: leadData.descripcion,
    };
    const response = await axiosInstance.post(API_ENDPOINTS.crm.customers, payload);
    return mapLeadFromCustomer(response.data);
  }

  async updateLead(id, leadData) {
    const payload = {
      name: leadData.nombre,
      taxId: leadData.cif,
      email: leadData.email,
      phone: leadData.telefono,
      responsibleId: leadData.responsableId,
      type: 'lead',
      notes: leadData.descripcion,
    };
    const response = await axiosInstance.put(API_ENDPOINTS.crm.customerById(id), payload);
    return mapLeadFromCustomer(response.data);
  }

  async deleteLead(id) {
    await axiosInstance.delete(API_ENDPOINTS.crm.customerById(id));
    return { success: true };
  }

  async convertLead(id) {
    const response = await axiosInstance.post(`${API_ENDPOINTS.crm.customerById(id)}/convert`);
    return response.data;
  }

  async getOpportunities(params = {}) {
    await ensureStageMap();
    const response = await axiosInstance.get(API_ENDPOINTS.crm.opportunities, { params });
    const items = Array.isArray(response.data) ? response.data : [];
    return items.map(mapOpportunity);
  }

  async getOpportunityById(id) {
    await ensureStageMap();
    const response = await axiosInstance.get(API_ENDPOINTS.crm.opportunityById(id));
    return mapOpportunity(response.data);
  }

  async createOpportunity(opportunityData) {
    const payload = {
      clientId: opportunityData.clienteId,
      pipelineId: opportunityData.pipelineId,
      stageId: opportunityData.stageId,
      title: opportunityData.nombre,
      description: opportunityData.descripcion,
      estimatedValue: opportunityData.valor,
      probability: opportunityData.probabilidad,
      expectedCloseDate: opportunityData.fechaCierreEstimada,
      responsibleId: opportunityData.responsableId,
      sortOrder: opportunityData.sortOrder,
      currency: 'EUR',
    };
    const response = await axiosInstance.post(API_ENDPOINTS.crm.opportunities, payload);
    return mapOpportunity(response.data);
  }

  async updateOpportunity(id, opportunityData) {
    const payload = {
      clientId: opportunityData.clienteId,
      pipelineId: opportunityData.pipelineId,
      stageId: opportunityData.stageId,
      title: opportunityData.nombre,
      description: opportunityData.descripcion,
      estimatedValue: opportunityData.valor,
      probability: opportunityData.probabilidad,
      expectedCloseDate: opportunityData.fechaCierreEstimada,
      responsibleId: opportunityData.responsableId,
      sortOrder: opportunityData.sortOrder,
      currency: 'EUR',
    };
    const response = await axiosInstance.put(API_ENDPOINTS.crm.opportunityById(id), payload);
    return mapOpportunity(response.data);
  }

  async deleteOpportunity(id) {
    await axiosInstance.delete(API_ENDPOINTS.crm.opportunityById(id));
    return { success: true };
  }

  async updateOpportunityStage(id, stageId) {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.crm.opportunityById(id)}/stage`, { stageId });
    return mapOpportunity(response.data);
  }

  async getActivities(params = {}) {
    const response = await axiosInstance.get(API_ENDPOINTS.crm.activities, { params });
    const items = Array.isArray(response.data) ? response.data : [];
    const [customers, opportunities] = await Promise.all([
      this.getCustomers(),
      this.getOpportunities(),
    ]);

    const customerMap = new Map(customers.map((customer) => [String(customer.id), customer]));
    const opportunityMap = new Map(opportunities.map((opportunity) => [String(opportunity.id), opportunity]));

    return items.map((item) => {
      const mapped = mapActivity(item);
      const customer = mapped.clienteId ? customerMap.get(String(mapped.clienteId)) : null;
      const opportunity = mapped.oportunidadId ? opportunityMap.get(String(mapped.oportunidadId)) : null;

      return {
        ...mapped,
        cliente: customer ? { id: customer.id, nombre: customer.nombre } : null,
        oportunidad: opportunity ? { id: opportunity.id, nombre: opportunity.nombre } : null,
      };
    });
  }

  async getActivityById(id) {
    const response = await axiosInstance.get(API_ENDPOINTS.crm.activityById(id));
    return mapActivity(response.data);
  }

  async createActivity(activityData) {
    const payload = {
      type: ACTIVITY_TYPE_UI_TO_BACKEND[activityData.tipo] || activityData.tipo,
      subject: activityData.titulo,
      description: activityData.descripcion,
      activityAt: activityData.fechaProgramada,
      userId: activityData.responsableId,
      clientId: activityData.clienteId || null,
      opportunityId: activityData.oportunidadId || null,
      completed: activityData.estado === 'completada',
    };
    const response = await axiosInstance.post(API_ENDPOINTS.crm.activities, payload);
    return mapActivity(response.data);
  }

  async updateActivity(id, activityData) {
    const payload = {
      type: ACTIVITY_TYPE_UI_TO_BACKEND[activityData.tipo] || activityData.tipo,
      subject: activityData.titulo,
      description: activityData.descripcion,
      activityAt: activityData.fechaProgramada,
      userId: activityData.responsableId,
      clientId: activityData.clienteId || null,
      opportunityId: activityData.oportunidadId || null,
      completed: activityData.estado === 'completada',
    };
    const response = await axiosInstance.put(API_ENDPOINTS.crm.activityById(id), payload);
    return mapActivity(response.data);
  }

  async deleteActivity(id) {
    await axiosInstance.delete(API_ENDPOINTS.crm.activityById(id));
    return { success: true };
  }

  async completeActivity(id) {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.crm.activityById(id)}/complete`);
    return mapActivity(response.data);
  }

  async getDashboardData(params = {}) {
    const [customers, leads, opportunities, activities] = await Promise.all([
      this.getCustomers(params),
      this.getLeads(params),
      this.getOpportunities(params),
      this.getActivities(params),
    ]);

    const valorPipeline = opportunities.reduce((acc, opp) => {
      if (opp.fase !== 'ganada' && opp.fase !== 'perdida') return acc + normalizeNumber(opp.valor);
      return acc;
    }, 0);

    const ganadas = opportunities.filter((opp) => opp.fase === 'ganada').length;
    const tasaConversion = opportunities.length ? Math.round((ganadas / opportunities.length) * 100) : 0;

    const pipelineMap = new Map();
    opportunities.forEach((opp) => {
      const prev = pipelineMap.get(opp.fase) || { fase: opp.fase, cantidad: 0, valor: 0 };
      prev.cantidad += 1;
      prev.valor += normalizeNumber(opp.valor);
      pipelineMap.set(opp.fase, prev);
    });

    const pipelinePorFase = Array.from(pipelineMap.values());
    const topOportunidades = [...opportunities]
      .sort((a, b) => normalizeNumber(b.valor) - normalizeNumber(a.valor))
      .slice(0, 3);
    const actividadesRecientes = [...activities]
      .sort((a, b) => new Date(b.fechaProgramada || 0) - new Date(a.fechaProgramada || 0))
      .slice(0, 5);

    return {
      resumen: {
        totalClientes: customers.length,
        totalLeads: leads.length,
        totalOportunidades: opportunities.length,
        valorPipeline,
        tasaConversion,
      },
      pipelinePorFase,
      actividadesRecientes,
      topOportunidades,
    };
  }

  async getStats(params = {}) {
    const dashboard = await this.getDashboardData(params);
    return {
      totalCustomers: dashboard.resumen.totalClientes,
      totalLeads: dashboard.resumen.totalLeads,
      totalOpportunities: dashboard.resumen.totalOportunidades,
      totalActivities: dashboard.actividadesRecientes.length,
    };
  }
}

export default new CRMService();
