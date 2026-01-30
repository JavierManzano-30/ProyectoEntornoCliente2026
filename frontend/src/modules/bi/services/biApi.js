// Servicios de API para el módulo BI
import axios from "../../lib/axios";

export const fetchKPIs = (params) => axios.get("/api/v1/bi/kpis", { params });
export const fetchMetrics = (metricId) =>
  axios.get(`/api/v1/bi/metrics/${metricId}`);
export const fetchDashboards = () => axios.get("/api/v1/bi/dashboards");
export const fetchDashboardById = (dashboardId) =>
  axios.get(`/api/v1/bi/dashboards/${dashboardId}`);
export const fetchReports = () => axios.get("/api/v1/reports");
export const fetchReportById = (reportId) =>
  axios.get(`/api/v1/reports/${reportId}`);
export const runReport = (reportId) =>
  axios.post(`/api/v1/reports/${reportId}/run`);
export const fetchDatasets = () => axios.get("/api/v1/bi/datasets");
export const fetchAlerts = () => axios.get("/api/v1/bi/alerts");
