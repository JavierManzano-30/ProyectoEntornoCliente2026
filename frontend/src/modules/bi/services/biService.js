import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';

class BIService {
  async getKPIs(params = {}) {
    const response = await axiosInstance.get(API_ENDPOINTS.bi.kpis, { params });
    return response.data || {};
  }

  async getDashboardData(params = {}) {
    const response = await axiosInstance.get(API_ENDPOINTS.bi.dashboard, { params });
    return response.data || {};
  }

  async getReports(params = {}) {
    const response = await axiosInstance.get(API_ENDPOINTS.bi.reports, { params });
    return Array.isArray(response.data) ? response.data : [];
  }

  async getReportById(id) {
    const response = await axiosInstance.get(API_ENDPOINTS.bi.reportById(id));
    return response.data || null;
  }

  async runReport(id) {
    const response = await axiosInstance.post(API_ENDPOINTS.bi.runReport(id));
    return response.data;
  }

  async exportReport() {
    throw new Error('Exportacion de reportes no implementada en backend');
  }

  async getDatasets() {
    const response = await axiosInstance.get(API_ENDPOINTS.bi.datasets);
    return Array.isArray(response.data) ? response.data : [];
  }

  async syncDataset() {
    throw new Error('Sincronizacion de datasets no implementada en backend');
  }

  async getAlerts() {
    const response = await axiosInstance.get(API_ENDPOINTS.bi.alerts);
    return Array.isArray(response.data) ? response.data : [];
  }

  async markAlertAsRead() {
    throw new Error('Marcado de alertas no implementado en backend');
  }

  async getMetric(metricId, params = {}) {
    const response = await axiosInstance.get(API_ENDPOINTS.bi.metricById(metricId), { params });
    return response.data || { id: metricId, data: [] };
  }
}

export default new BIService();
