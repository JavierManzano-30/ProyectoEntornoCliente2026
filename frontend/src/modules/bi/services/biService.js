import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/api';

const ALERTS_READ_KEY = 'bi_alerts_read';
const ALERT_METRIC_LABELS = {
  sales_total: 'Ventas totales',
  pipeline_value: 'Valor del pipeline',
  headcount: 'Headcount'
};
const REPORT_TYPE_MAP = {
  erp: 'Ventas',
  crm: 'Marketing',
  hr: 'Operaciones',
  rrhh: 'Operaciones',
  support: 'Operaciones',
  soporte: 'Operaciones',
  finance: 'Finanzas',
  finanzas: 'Finanzas'
};
const REPORT_STATUS_MAP = {
  success: 'completado',
  completed: 'completado',
  running: 'pendiente',
  failed: 'error'
};
const DATASET_SOURCE_MAP = {
  erp: 'ERP',
  crm: 'CRM',
  hr: 'RRHH',
  rrhh: 'RRHH',
  soporte: 'Soporte',
  support: 'Soporte',
  bpm: 'Proyectos',
  projects: 'Proyectos',
  proyecto: 'Proyectos',
  proyectos: 'Proyectos'
};

const getMetricLabel = (metricKey) => {
  if (!metricKey) return 'KPI';
  const normalized = String(metricKey).trim();
  if (!normalized) return 'KPI';
  if (ALERT_METRIC_LABELS[normalized]) return ALERT_METRIC_LABELS[normalized];

  return normalized
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatThreshold = (value) => {
  if (value === null || value === undefined || value === '') return 'N/D';
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isFinite(numeric)) {
    return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(numeric);
  }
  return String(value);
};

const formatDateTime = (value, fallback = 'Sin fecha') => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const normalizeText = (value) => (value ? String(value).trim() : '');

const inferDatasetSource = (value) => {
  const text = normalizeText(value).toLowerCase();
  if (!text) return null;
  const match = Object.keys(DATASET_SOURCE_MAP).find((key) => text.includes(key));
  return match ? DATASET_SOURCE_MAP[match] : null;
};

const getDatasetSource = (dataset) => {
  const rawSource = normalizeText(dataset.source ?? dataset.fuente);
  if (rawSource && rawSource.toLowerCase() !== 'db') {
    const mapped = DATASET_SOURCE_MAP[rawSource.toLowerCase()];
    return mapped || rawSource.toUpperCase();
  }

  const inferred = inferDatasetSource(dataset.name) || inferDatasetSource(dataset.query_sql);
  if (inferred) return inferred;
  if (rawSource) return rawSource.toUpperCase() === 'DB' ? 'BD' : rawSource.toUpperCase();
  return 'BD';
};

const getReportType = (module) => {
  const normalized = normalizeText(module).toLowerCase();
  if (!normalized) return 'Operaciones';
  return REPORT_TYPE_MAP[normalized] || module;
};

const getReportStatus = (status) => {
  const normalized = normalizeText(status).toLowerCase();
  if (!normalized) return 'pendiente';
  return REPORT_STATUS_MAP[normalized] || 'pendiente';
};

const getReportFormat = (report, lastRun) => {
  if (report?.formato) return report.formato;
  const outputPath = lastRun?.output_path || report?.output_path || '';
  if (outputPath) {
    const extension = outputPath.split('.').pop().toLowerCase();
    if (extension === 'xlsx' || extension === 'xls') return 'Excel';
    if (extension === 'csv') return 'CSV';
    if (extension === 'pdf') return 'PDF';
  }
  return 'CSV';
};

const readAlertIds = (companyId) => {
  if (typeof window === 'undefined') return new Set();
  const key = `${ALERTS_READ_KEY}:${companyId || 'default'}`;
  const raw = localStorage.getItem(key);
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    return new Set();
  }
};

const writeAlertIds = (companyId, ids) => {
  if (typeof window === 'undefined') return;
  const key = `${ALERTS_READ_KEY}:${companyId || 'default'}`;
  localStorage.setItem(key, JSON.stringify(Array.from(ids)));
};

const normalizeAlert = (alert, readIds) => {
  const metricKey = alert.metric_key ?? alert.metricKey;
  const condition = alert.condition ?? alert.operator ?? '';
  const threshold = formatThreshold(alert.threshold ?? alert.threshold_value);
  const label = getMetricLabel(metricKey);
  const mensaje = condition
    ? `Umbral: ${label} ${condition} ${threshold}`
    : `Umbral configurado para ${label} (${threshold})`;
  const fecha = formatDateTime(alert.last_triggered || alert.created_at);
  const leida = readIds.has(alert.id);

  return {
    ...alert,
    titulo: label,
    mensaje,
    tipo: alert.tipo || (alert.last_triggered ? 'warning' : 'info'),
    leida,
    fecha
  };
};

const normalizeDataset = (dataset) => {
  const ultimaActualizacion = formatDateTime(dataset.last_refresh, 'Sin refresco');
  const estado = dataset.estado || (dataset.last_refresh ? 'Activo' : 'Inactivo');
  const registros = dataset.registros ?? dataset.records ?? null;

  return {
    ...dataset,
    nombre: dataset.nombre || dataset.name || 'Dataset',
    fuente: dataset.fuente || getDatasetSource(dataset),
    estado,
    ultimaActualizacion: dataset.ultimaActualizacion || ultimaActualizacion,
    refresco: dataset.refresco || 'Manual',
    registros
  };
};

const normalizeReport = (report) => {
  const lastRun = report.last_run || report.lastRun || null;
  const estado = report.estado || getReportStatus(lastRun?.status);
  const ultimaEjecucion = report.ultimaEjecucion
    || formatDateTime(lastRun?.finished_at || lastRun?.started_at, 'Sin ejecuciones');

  return {
    ...report,
    nombre: report.nombre || report.name || 'Informe',
    descripcion: report.descripcion || report.description || 'Sin descripción',
    tipo: report.tipo || getReportType(report.module),
    formato: getReportFormat(report, lastRun),
    estado,
    ultimaEjecucion
  };
};

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
    const rawReports = Array.isArray(response.data) ? response.data : [];
    return rawReports.map((report) => normalizeReport(report));
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
    const rawDatasets = Array.isArray(response.data) ? response.data : [];
    return rawDatasets.map((dataset) => normalizeDataset(dataset));
  }

  async syncDataset() {
    throw new Error('Sincronizacion de datasets no implementada en backend');
  }

  async getAlerts() {
    const response = await axiosInstance.get(API_ENDPOINTS.bi.alerts);
    const rawAlerts = Array.isArray(response.data) ? response.data : [];
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') : null;
    const readIds = readAlertIds(companyId);
    return rawAlerts.map((alert) => normalizeAlert(alert, readIds));
  }

  async markAlertAsRead(alertId) {
    if (!alertId) return null;
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') : null;
    const readIds = readAlertIds(companyId);
    readIds.add(alertId);
    writeAlertIds(companyId, readIds);
    return { id: alertId, leida: true };
  }

  async getMetric(metricId, params = {}) {
    const response = await axiosInstance.get(API_ENDPOINTS.bi.metricById(metricId), { params });
    return response.data || { id: metricId, data: [] };
  }
}

export default new BIService();
