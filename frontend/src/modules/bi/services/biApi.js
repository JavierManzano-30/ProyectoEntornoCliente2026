import axios from '../../../lib/axios';

export const fetchKPIs = (params) => axios.get('/bi/kpis', { params });
export const fetchMetrics = (metricId) => axios.get(`/bi/metrics/${metricId}`);
export const fetchDashboards = () => axios.get('/bi/dashboard');
export const fetchDashboardById = () => axios.get('/bi/dashboard');
export const fetchReports = () => axios.get('/bi/reports');
export const fetchReportById = (reportId) => axios.get(`/bi/reports/${reportId}`);
export const runReport = (reportId) => axios.post(`/bi/reports/${reportId}/run`);
export const fetchDatasets = () => axios.get('/bi/datasets');
export const fetchAlerts = () => axios.get('/bi/alertas');
