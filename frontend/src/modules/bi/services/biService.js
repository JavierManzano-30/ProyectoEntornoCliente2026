import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';
import { mockKPIs, mockDashboardData, mockReports, mockDatasets, mockAlerts } from '../data/mockData';

// Modo de demostración
const DEMO_MODE = true;

class BIService {
  // ============ KPIs ============
  
  async getKPIs(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const empresaId = params.empresaId || 1;
      return mockKPIs[empresaId] || mockKPIs[1];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.bi.kpis, { params });
    return response.data;
  }

  // ============ DASHBOARD ============
  
  async getDashboardData(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const empresaId = params.empresaId || 1;
      return mockDashboardData[empresaId] || mockDashboardData[1];
    }
    const response = await axiosInstance.get(API_ENDPOINTS.bi.dashboard, { params });
    return response.data;
  }

  // ============ REPORTES ============
  
  async getReports(params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const empresaId = params.empresaId;
      // Filtrar reportes: mostrar compartidos (empresaId: null) y específicos de la empresa
      return mockReports.filter(r => r.empresaId === null || r.empresaId === empresaId);
    }
    const response = await axiosInstance.get(API_ENDPOINTS.bi.reports, { params });
    return response.data;
  }

  async getReportById(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockReports.find(r => r.id === id);
    }
    const response = await axiosInstance.get(API_ENDPOINTS.bi.reportById(id));
    return response.data;
  }

  async runReport(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, message: 'Reporte ejecutado correctamente' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.bi.runReport(id));
    return response.data;
  }

  async exportReport(id, format) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, message: `Reporte exportado en ${format}` };
    }
    const response = await axiosInstance.post(
      API_ENDPOINTS.bi.runReport(id),
      { format },
      { responseType: 'blob' }
    );
    return response.data;
  }

  // ============ DATASETS ============
  
  async getDatasets(empresaId = null) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 350));
      return mockDatasets[empresaId] || mockDatasets[1];
    }
    const params = empresaId ? { empresaId } : {};
    const response = await axiosInstance.get(API_ENDPOINTS.bi.datasets, { params });
    return response.data;
  }

  async syncDataset(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, message: 'Dataset sincronizado correctamente' };
    }
    const response = await axiosInstance.post(API_ENDPOINTS.bi.datasetById(id) + '/sync');
    return response.data;
  }

  // ============ ALERTAS ============
  
  async getAlerts(empresaId = null) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return mockAlerts[empresaId] || mockAlerts[1];
    }
    const params = empresaId ? { empresaId } : {};
    const response = await axiosInstance.get(API_ENDPOINTS.bi.alerts, { params });
    return response.data;
  }

  async markAlertAsRead(id) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { success: true };
    }
    const response = await axiosInstance.put(API_ENDPOINTS.bi.alerts + `/${id}/read`);
    return response.data;
  }

  // ============ MÉTRICAS ============
  
  async getMetric(metricId, params = {}) {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { id: metricId, data: [] };
    }
    const response = await axiosInstance.get(API_ENDPOINTS.bi.metricById(metricId), { params });
    return response.data;
  }
}

export default new BIService();
