# 📦 Módulo BI – Estructura Frontend

Este documento detalla la **estructura completa del módulo BI** en el frontend de React, incluyendo componentes, hooks, servicios, contextos, tipos, constantes y rutas.

---

## 📂 Estructura de Carpetas

```
src/
└── modules/
    └── bi/
        ├── components/                      # Componentes específicos del módulo
        │   ├── dashboards/
        │   │   ├── DashboardGrid.jsx
        │   │   ├── KPICard.jsx
        │   │   ├── TrendIndicator.jsx
        │   │   ├── ModuleDashboard.jsx
        │   │   ├── DashboardFilters.jsx
        │   │   └── WidgetContainer.jsx
        │   │
        │   ├── charts/
        │   │   ├── LineChart.jsx
        │   │   ├── BarChart. jsx
        │   │   ├── PieChart.jsx
        │   │   ├── DonutChart.jsx
        │   │   ├── AreaChart.jsx
        │   │   ├── GaugeChart.jsx
        │   │   ├── FunnelChart.jsx
        │   │   ├── HeatmapChart.jsx
        │   │   ├── ScatterPlot.jsx
        │   │   └── ChartContainer.jsx
        │   │
        │   ├── reports/
        │   │   ├── ReportCard.jsx
        │   │   ├── ReportTable.jsx
        │   │   ├── ReportFilters.jsx
        │   │   ├── ReportVisualization.jsx
        │   │   ├── ReportExportButton.jsx
        │   │   ├── ReportScheduler.jsx
        │   │   ├── ReportHistory.jsx
        │   │   └── ReportShareModal.jsx
        │   │
        │   ├── builder/
        │   │   ├── ReportBuilderWizard.jsx
        │   │   ├── DataSourceSelector.jsx
        │   │   ├── FieldConfigurator.jsx
        │   │   ├── FilterBuilder.jsx
        │   │   ├── ChartConfigurator.jsx
        │   │   └── VisualizationPreview.jsx
        │   │
        │   ├── datasets/
        │   │   ├── DatasetCard.jsx
        │   │   ├── DatasetTable.jsx
        │   │   ├── DatasetStatusBadge.jsx
        │   │   ├── DatasetEditor.jsx
        │   │   ├── DatasetRefreshButton.jsx
        │   │   ├── DatasetLogs.jsx
        │   │   └── DatasetPreview.jsx
        │   │
        │   ├── alerts/
        │   │   ├── AlertCard.jsx
        │   │   ├── AlertTable.jsx
        │   │   ├── AlertPriorityBadge.jsx
        │   │   ├── AlertForm.jsx
        │   │   ├── AlertHistory.jsx
        │   │   └── ActiveAlertsPanel.jsx
        │   │
        │   └── shared/
        │       ├── DataTable.jsx
        │       ├── FilterPanel.jsx
        │       ├── DateRangePicker.jsx
        │       ├── ExportButton.jsx
        │       ├── PeriodSelector.jsx
        │       ├── CompanySelector.jsx
        │       └── LoadingSkeleton.jsx
        │
        ├── pages/                           # Páginas principales del módulo
        │   ├── DashboardView.jsx
        │   ├── ModuleDashboard.jsx
        │   ├── ReportList.jsx
        │   ├── ReportViewer.jsx
        │   ├── ReportBuilder.jsx
        │   ├── DatasetManager.jsx
        │   ├── DatasetEditor.jsx
        │   ├── AlertManager.jsx
        │   ├── AlertConfig.jsx
        │   └── BIDashboard.jsx
        │
        ├── hooks/                           # Custom hooks del módulo
        │   ├── useDashboard.js
        │   ├── useReports.js
        │   ├── useReport.js
        │   ├── useDatasets.js
        │   ├── useDataset.js
        │   ├── useAlerts.js
        │   ├── useKPIs.js
        │   ├── useChartData.js
        │   ├── useExport.js
        │   └── useBIMetrics.js
        │
        ├── context/                         # Contexto específico del módulo
        │   ├── BIContext.jsx
        │   └── BIProvider.jsx
        │
        ├── services/                        # Servicios de comunicación con API
        │   └── biService.js
        │
        ├── utils/                           # Utilidades específicas del módulo
        │   ├── chartHelpers.js
        │   ├── dataTransformers.js
        │   ├── exportHelpers.js
        │   ├── kpiCalculations.js
        │   ├── dateUtils.js
        │   ├── formatters.js
        │   └── validators.js
        │
        ├── constants/                       # Constantes del módulo
        │   ├── chartTypes.js
        │   ├── reportTypes.js
        │   ├── datasetStatus.js
        │   ├── alertPriority.js
        │   ├── exportFormats.js
        │   ├── periods.js
        │   └── colorPalettes.js
        │
        ├── styles/                          # Estilos específicos del módulo
        │   ├── bi.module.css
        │   ├── dashboards.module.css
        │   ├── charts.module.css
        │   ├── reports.module.css
        │   └── datasets.module.css
        │
        └── __tests__/                       # Tests del módulo
            ├── pages/
            │   ├── DashboardView.test.jsx
            │   ├── ReportList.test.jsx
            │   └── DatasetManager.test.jsx
            ├── components/
            │   ├── KPICard.test.jsx
            │   ├── LineChart.test.jsx
            │   └── ReportCard.test.jsx
            ├── hooks/
            │   ├── useDashboard.test.js
            │   ├── useReports.test.js
            │   └── useKPIs.test. js
            └── services/
                └── biService.test.js
```

---

## 1. 🔌 Servicios API (services)

### biService.js

```javascript
// services/biService.js
import apiClient from '@/utils/apiClient';

const BASE_URL = '/bi';

export const biService = {
  // ==================== DASHBOARDS ====================
  
  /**
   * Obtener dashboard global
   */
  getGlobalDashboard: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/dashboards/global? ${params}`);
    return response.data;
  },

  /**
   * Obtener dashboard por módulo
   */
  getModuleDashboard: async (module, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/dashboards/${module}?${params}`);
    return response.data;
  },

  /**
   * Obtener KPIs principales
   */
  getKPIs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/kpis?${params}`);
    return response.data;
  },

  /**
   * Obtener métricas por módulo
   */
  getModuleMetrics: async (module, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/metricas/${module}?${params}`);
    return response.data;
  },

  // ==================== INFORMES ====================

  /**
   * Obtener todos los informes
   */
  getAllReports: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/informes?${params}`);
    return response.data;
  },

  /**
   * Obtener un informe por ID
   */
  getReportById: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/informes/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo informe
   */
  createReport: async (reportData) => {
    const response = await apiClient.post(`${BASE_URL}/informes`, reportData);
    return response. data;
  },

  /**
   * Actualizar un informe
   */
  updateReport: async (id, reportData) => {
    const response = await apiClient.put(`${BASE_URL}/informes/${id}`, reportData);
    return response. data;
  },

  /**
   * Eliminar un informe
   */
  deleteReport: async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/informes/${id}`);
    return response.data;
  },

  /**
   * Ejecutar un informe
   */
  executeReport: async (id, parameters = {}) => {
    const response = await apiClient.post(`${BASE_URL}/informes/${id}/ejecutar`, parameters);
    return response.data;
  },

  /**
   * Exportar un informe
   */
  exportReport: async (id, format, parameters = {}) => {
    const response = await apiClient.post(
      `${BASE_URL}/informes/${id}/exportar`,
      { formato: format, ...parameters },
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Programar un informe
   */
  scheduleReport: async (id, scheduleData) => {
    const response = await apiClient.post(`${BASE_URL}/informes/${id}/programar`, scheduleData);
    return response.data;
  },

  /**
   * Obtener historial de ejecuciones
   */
  getReportHistory: async (id, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/informes/${id}/historial?${params}`);
    return response.data;
  },

  /**
   * Compartir informe
   */
  shareReport: async (id, shareData) => {
    const response = await apiClient.post(`${BASE_URL}/informes/${id}/compartir`, shareData);
    return response.data;
  },

  // ==================== DATASETS ====================

  /**
   * Obtener todos los datasets
   */
  getAllDatasets: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/datasets?${params}`);
    return response.data;
  },

  /**
   * Obtener un dataset por ID
   */
  getDatasetById: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/datasets/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo dataset
   */
  createDataset: async (datasetData) => {
    const response = await apiClient.post(`${BASE_URL}/datasets`, datasetData);
    return response. data;
  },

  /**
   * Actualizar un dataset
   */
  updateDataset: async (id, datasetData) => {
    const response = await apiClient.put(`${BASE_URL}/datasets/${id}`, datasetData);
    return response.data;
  },

  /**
   * Eliminar un dataset
   */
  deleteDataset: async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/datasets/${id}`);
    return response.data;
  },

  /**
   * Refrescar un dataset
   */
  refreshDataset: async (id) => {
    const response = await apiClient.post(`${BASE_URL}/datasets/${id}/refrescar`);
    return response.data;
  },

  /**
   * Obtener logs de un dataset
   */
  getDatasetLogs: async (id, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/datasets/${id}/logs?${params}`);
    return response.data;
  },

  /**
   * Vista previa de dataset
   */
  previewDataset: async (id, limit = 100) => {
    const response = await apiClient.get(`${BASE_URL}/datasets/${id}/preview?limit=${limit}`);
    return response.data;
  },

  // ==================== ALERTAS ====================

  /**
   * Obtener todas las alertas
   */
  getAllAlerts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/alertas?${params}`);
    return response.data;
  },

  /**
   * Obtener una alerta por ID
   */
  getAlertById: async (id) => {
    const response = await apiClient. get(`${BASE_URL}/alertas/${id}`);
    return response.data;
  },

  /**
   * Crear una nueva alerta
   */
  createAlert: async (alertData) => {
    const response = await apiClient.post(`${BASE_URL}/alertas`, alertData);
    return response.data;
  },

  /**
   * Actualizar una alerta
   */
  updateAlert: async (id, alertData) => {
    const response = await apiClient.put(`${BASE_URL}/alertas/${id}`, alertData);
    return response.data;
  },

  /**
   * Eliminar una alerta
   */
  deleteAlert: async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/alertas/${id}`);
    return response.data;
  },

  /**
   * Pausar/Reanudar alerta
   */
  toggleAlert: async (id, active) => {
    const response = await apiClient.patch(`${BASE_URL}/alertas/${id}/toggle`, { activa: active });
    return response. data;
  },

  /**
   * Obtener historial de activaciones
   */
  getAlertHistory: async (id, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/alertas/${id}/historial? ${params}`);
    return response.data;
  },

  /**
   * Obtener alertas activas
   */
  getActiveAlerts: async () => {
    const response = await apiClient.get(`${BASE_URL}/alertas/activas`);
    return response.data;
  },

  /**
   * Silenciar alerta
   */
  snoozeAlert: async (id, hours) => {
    const response = await apiClient.post(`${BASE_URL}/alertas/${id}/silenciar`, { horas: hours });
    return response.data;
  },

  // ==================== EXPORTACIÓN ====================

  /**
   * Exportar dashboard
   */
  exportDashboard: async (dashboardType, format, filters = {}) => {
    const response = await apiClient.post(
      `${BASE_URL}/export/dashboard`,
      { tipo: dashboardType, formato: format, ...filters },
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Exportar datos de gráfico
   */
  exportChartData: async (chartConfig, format) => {
    const response = await apiClient.post(
      `${BASE_URL}/export/chart`,
      { ...chartConfig, formato: format },
      { responseType: 'blob' }
    );
    return response.data;
  }
};

export default biService;
```

---

## 2. 🪝 Hooks Personalizados (hooks)

### useDashboard.js

```javascript
// hooks/useDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { biService } from '../services/biService';
import { useNotification } from '@/hooks/useNotification';

export const useDashboard = (dashboardType = 'global', initialFilters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showNotification } = useNotification();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = dashboardType === 'global'
        ? await biService.getGlobalDashboard(filters)
        : await biService.getModuleDashboard(dashboardType, filters);
      
      setData(dashboardData);
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }, [dashboardType, filters, showNotification]);

  useEffect(() => {
    fetchDashboard();
    
    // Auto-refresh cada 60 segundos
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshDashboard = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refreshDashboard
  };
};
```

### useReports.js

```javascript
// hooks/useReports.js
import { useState, useEffect, useCallback } from 'react';
import { biService } from '../services/biService';
import { useNotification } from '@/hooks/useNotification';

export const useReports = (initialFilters = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showNotification } = useNotification();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await biService.getAllReports(filters);
      setReports(data);
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar informes', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const createReport = async (reportData) => {
    try {
      const newReport = await biService.createReport(reportData);
      setReports(prev => [newReport, ...prev]);
      showNotification('Informe creado exitosamente', 'success');
      return newReport;
    } catch (err) {
      showNotification('Error al crear informe', 'error');
      throw err;
    }
  };

  const updateReport = async (id, reportData) => {
    try {
      const updated = await biService.updateReport(id, reportData);
      setReports(prev => prev.map(r => r.id === id ? updated : r));
      showNotification('Informe actualizado exitosamente', 'success');
      return updated;
    } catch (err) {
      showNotification('Error al actualizar informe', 'error');
      throw err;
    }
  };

  const deleteReport = async (id) => {
    try {
      await biService.deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
      showNotification('Informe eliminado exitosamente', 'success');
    } catch (err) {
      showNotification('Error al eliminar informe', 'error');
      throw err;
    }
  };

  return {
    reports,
    loading,
    error,
    filters,
    setFilters,
    fetchReports,
    createReport,
    updateReport,
    deleteReport
  };
};
```

### useKPIs.js

```javascript
// hooks/useKPIs.js
import { useState, useEffect, useCallback } from 'react';
import { biService } from '../services/biService';
import { useNotification } from '@/hooks/useNotification';

export const useKPIs = (filters = {}) => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const fetchKPIs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await biService.getKPIs(filters);
      setKpis(data);
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar KPIs', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  return {
    kpis,
    loading,
    error,
    fetchKPIs
  };
};
```

### useDatasets.js

```javascript
// hooks/useDatasets.js
import { useState, useEffect, useCallback } from 'react';
import { biService } from '../services/biService';
import { useNotification } from '@/hooks/useNotification';

export const useDatasets = (initialFilters = {}) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showNotification } = useNotification();

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await biService.getAllDatasets(filters);
      setDatasets(data);
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar datasets', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  const createDataset = async (datasetData) => {
    try {
      const newDataset = await biService.createDataset(datasetData);
      setDatasets(prev => [newDataset, ... prev]);
      showNotification('Dataset creado exitosamente', 'success');
      return newDataset;
    } catch (err) {
      showNotification('Error al crear dataset', 'error');
      throw err;
    }
  };

  const refreshDataset = async (id) => {
    try {
      await biService.refreshDataset(id);
      showNotification('Dataset actualizado', 'success');
      fetchDatasets(); // Refrescar lista
    } catch (err) {
      showNotification('Error al refrescar dataset', 'error');
      throw err;
    }
  };

  const deleteDataset = async (id) => {
    try {
      await biService.deleteDataset(id);
      setDatasets(prev => prev.filter(d => d.id !== id));
      showNotification('Dataset eliminado exitosamente', 'success');
    } catch (err) {
      showNotification('Error al eliminar dataset', 'error');
      throw err;
    }
  };

  return {
    datasets,
    loading,
    error,
    filters,
    setFilters,
    fetchDatasets,
    createDataset,
    refreshDataset,
    deleteDataset
  };
};
```

### useAlerts.js

```javascript
// hooks/useAlerts. js
import { useState, useEffect, useCallback } from 'react';
import { biService } from '../services/biService';
import { useNotification } from '@/hooks/useNotification';

export const useAlerts = (initialFilters = {}) => {
  const [alerts, setAlerts] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showNotification } = useNotification();

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allAlerts, active] = await Promise.all([
        biService.getAllAlerts(filters),
        biService.getActiveAlerts()
      ]);
      setAlerts(allAlerts);
      setActiveAlerts(active);
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar alertas', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = async (alertData) => {
    try {
      const newAlert = await biService.createAlert(alertData);
      setAlerts(prev => [newAlert, ...prev]);
      showNotification('Alerta creada exitosamente', 'success');
      return newAlert;
    } catch (err) {
      showNotification('Error al crear alerta', 'error');
      throw err;
    }
  };

  const toggleAlert = async (id, active) => {
    try {
      await biService.toggleAlert(id, active);
      setAlerts(prev => prev.map(a => a.id === id ?  { ...a, activa: active } : a));
      showNotification(`Alerta ${active ? 'activada' : 'pausada'}`, 'success');
    } catch (err) {
      showNotification('Error al cambiar estado de alerta', 'error');
      throw err;
    }
  };

  const snoozeAlert = async (id, hours) => {
    try {
      await biService.snoozeAlert(id, hours);
      showNotification(`Alerta silenciada por ${hours} horas`, 'success');
      fetchAlerts(); // Refrescar
    } catch (err) {
      showNotification('Error al silenciar alerta', 'error');
      throw err;
    }
  };

  const deleteAlert = async (id) => {
    try {
      await biService.deleteAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      showNotification('Alerta eliminada exitosamente', 'success');
    } catch (err) {
      showNotification('Error al eliminar alerta', 'error');
      throw err;
    }
  };

  return {
    alerts,
    activeAlerts,
    loading,
    error,
    filters,
    setFilters,
    fetchAlerts,
    createAlert,
    toggleAlert,
    snoozeAlert,
    deleteAlert
  };
};
```

---

## 3. 🔄 Context y Provider

### BIContext.jsx

```javascript
// context/BIContext.jsx
import { createContext, useContext } from 'react';

export const BIContext = createContext(null);

export const useBIContext = () => {
  const context = useContext(BIContext);
  if (!context) {
    throw new Error('useBIContext debe usarse dentro de BIProvider');
  }
  return context;
};
```

### BIProvider.jsx

```javascript
// context/BIProvider.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { BIContext } from './BIContext';
import { PERIODS } from '../constants/periods';

export const BIProvider = ({ children }) => {
  // Estado global del módulo
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS.THIS_MONTH);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [compareWith, setCompareWith] = useState(null); // Para comparaciones
  
  // Filtros globales de dashboard
  const [globalFilters, setGlobalFilters] = useState({
    period:  PERIODS.THIS_MONTH,
    company: null,
    compareWith: null,
    dateRange: null
  });

  // Filtros de informes
  const [reportFilters, setReportFilters] = useState({
    search: '',
    module: '',
    type: '',
    author: '',
    favorite: false
  });

  // Funciones de utilidad
  const updateGlobalFilter = useCallback((key, value) => {
    setGlobalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearGlobalFilters = useCallback(() => {
    setGlobalFilters({
      period: PERIODS.THIS_MONTH,
      company: null,
      compareWith: null,
      dateRange: null
    });
  }, []);

  const updateReportFilter = useCallback((key, value) => {
    setReportFilters(prev => ({ ...prev, [key]:  value }));
  }, []);

  const clearReportFilters = useCallback(() => {
    setReportFilters({
      search: '',
      module: '',
      type: '',
      author: '',
      favorite: false
    });
  }, []);

  const contextValue = useMemo(() => ({
    // Estado
    selectedPeriod,
    selectedCompany,
    compareWith,
    globalFilters,
    reportFilters,
    
    // Setters
    setSelectedPeriod,
    setSelectedCompany,
    setCompareWith,
    
    // Funciones de filtros
    updateGlobalFilter,
    clearGlobalFilters,
    updateReportFilter,
    clearReportFilters
  }), [
    selectedPeriod,
    selectedCompany,
    compareWith,
    globalFilters,
    reportFilters,
    updateGlobalFilter,
    clearGlobalFilters,
    updateReportFilter,
    clearReportFilters
  ]);

  return (
    <BIContext.Provider value={contextValue}>
      {children}
    </BIContext.Provider>
  );
};
```

---

## 4. 📊 Constantes del Módulo

### periods.js

```javascript
// constants/periods.js

export const PERIODS = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_QUARTER: 'this_quarter',
  THIS_YEAR: 'this_year',
  CUSTOM: 'custom'
};

export const PERIOD_LABELS = {
  [PERIODS.TODAY]: 'Hoy',
  [PERIODS.THIS_WEEK]: 'Esta semana',
  [PERIODS.THIS_MONTH]: 'Este mes',
  [PERIODS.THIS_QUARTER]: 'Este trimestre',
  [PERIODS.THIS_YEAR]:  'Este año',
  [PERIODS.CUSTOM]: 'Personalizado'
};

export const COMPARISON_OPTIONS = {
  NONE: 'none',
  PREVIOUS_PERIOD: 'previous_period',
  SAME_PERIOD_LAST_YEAR: 'same_period_last_year'
};

export const COMPARISON_LABELS = {
  [COMPARISON_OPTIONS.NONE]:  'Sin comparar',
  [COMPARISON_OPTIONS.PREVIOUS_PERIOD]: 'Periodo anterior',
  [COMPARISON_OPTIONS.SAME_PERIOD_LAST_YEAR]: 'Mismo periodo año anterior'
};
```

### chartTypes.js

```javascript
// constants/chartTypes.js

export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  DONUT: 'donut',
  AREA: 'area',
  GAUGE: 'gauge',
  FUNNEL: 'funnel',
  HEATMAP: 'heatmap',
  SCATTER: 'scatter'
};

export const CHART_TYPE_LABELS = {
  [CHART_TYPES.LINE]:  'Gráfico de Líneas',
  [CHART_TYPES.BAR]: 'Gráfico de Barras',
  [CHART_TYPES.PIE]: 'Gráfico Circular',
  [CHART_TYPES.DONUT]: 'Gráfico de Dona',
  [CHART_TYPES.AREA]: 'Gráfico de Área',
  [CHART_TYPES. GAUGE]: 'Medidor',
  [CHART_TYPES.FUNNEL]: 'Embudo',
  [CHART_TYPES.HEATMAP]:  'Mapa de Calor',
  [CHART_TYPES. SCATTER]: 'Dispersión'
};
```

### exportFormats.js

```javascript
// constants/exportFormats.js

export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json',
  PNG: 'png',
  SVG: 'svg'
};

export const EXPORT_FORMAT_LABELS = {
  [EXPORT_FORMATS.PDF]: 'PDF',
  [EXPORT_FORMATS.EXCEL]: 'Excel',
  [EXPORT_FORMATS.CSV]: 'CSV',
  [EXPORT_FORMATS.JSON]: 'JSON',
  [EXPORT_FORMATS.PNG]: 'Imagen PNG',
  [EXPORT_FORMATS.SVG]: 'Imagen SVG'
};

export const EXPORT_FORMAT_ICONS = {
  [EXPORT_FORMATS.PDF]: '📄',
  [EXPORT_FORMATS.EXCEL]: '📊',
  [EXPORT_FORMATS.CSV]: '📋',
  [EXPORT_FORMATS.JSON]: '{ }',
  [EXPORT_FORMATS.PNG]: '🖼️',
  [EXPORT_FORMATS.SVG]: '🎨'
};
```

### datasetStatus.js

```javascript
// constants/datasetStatus.js

export const DATASET_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  ERROR: 'error',
  REFRESHING: 'refreshing'
};

export const DATASET_STATUS_CONFIG = {
  [DATASET_STATUS.ACTIVE]: {
    label: 'Activo',
    color: 'green'
  },
  [DATASET_STATUS.PAUSED]:  {
    label: 'Pausado',
    color: 'gray'
  },
  [DATASET_STATUS.ERROR]: {
    label: 'Error',
    color: 'red'
  },
  [DATASET_STATUS.REFRESHING]: {
    label: 'Actualizando',
    color: 'blue'
  }
};
```

### alertPriority.js

```javascript
// constants/alertPriority.js

export const ALERT_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const ALERT_PRIORITY_CONFIG = {
  [ALERT_PRIORITY.HIGH]: {
    label: 'Alta',
    color: 'red',
    icon: '🔴'
  },
  [ALERT_PRIORITY.MEDIUM]: {
    label: 'Media',
    color: 'yellow',
    icon: '🟡'
  },
  [ALERT_PRIORITY.LOW]: {
    label: 'Baja',
    color:  'gray',
    icon: '⚪'
  }
};
```

### colorPalettes.js

```javascript
// constants/colorPalettes.js

export const COLOR_PALETTES = {
  DEFAULT: [
    '#5A76DB',  // Azul principal
    '#5AC8DB',  // Azul claro
    '#5ADBC4',  // Verde agua
    '#675ADB',  // Violeta
    '#5A9FDB',  // Azul medio
    '#7CB1DF'   // Azul pastel
  ],
  STATUS: {
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6',
    NEUTRAL: '#6b7280'
  },
  GRADIENTS: {
    BLUE:  ['#5A76DB', '#7CB1DF'],
    GREEN: ['#10b981', '#5ADBC4'],
    PURPLE: ['#675ADB', '#5A76DB']
  }
};
```

---

## 5. 🛣️ Rutas del Módulo

### biRoutes.jsx

```jsx
// routes/biRoutes. jsx
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { BIProvider } from '../modules/bi/context/BIProvider';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Lazy loading
const DashboardView = lazy(() => import('../modules/bi/pages/DashboardView'));
const ModuleDashboard = lazy(() => import('../modules/bi/pages/ModuleDashboard'));
const ReportList = lazy(() => import('../modules/bi/pages/ReportList'));
const ReportViewer = lazy(() => import('../modules/bi/pages/ReportViewer'));
const ReportBuilder = lazy(() => import('../modules/bi/pages/ReportBuilder'));
const DatasetManager = lazy(() => import('../modules/bi/pages/DatasetManager'));
const DatasetEditor = lazy(() => import('../modules/bi/pages/DatasetEditor'));
const AlertManager = lazy(() => import('../modules/bi/pages/AlertManager'));
const AlertConfig = lazy(() => import('../modules/bi/pages/AlertConfig'));
const BIDashboard = lazy(() => import('../modules/bi/pages/BIDashboard'));

const biRoutes = (
  <Route
    path="/bi"
    element={
      <BIProvider>
        <ProtectedRoute requiredPermission="bi.view_dashboard" />
      </BIProvider>
    }
  >
    <Route index element={<DashboardView />} />
    <Route path="dashboard" element={<DashboardView />} />
    <Route path="dashboard/: modulo" element={<ModuleDashboard />} />
    
    <Route path="informes" element={<ReportList />} />
    <Route path="informes/:id" element={<ReportViewer />} />
    <Route 
      path="informes/nuevo" 
      element={
        <ProtectedRoute requiredPermission="bi.create_reports">
          <ReportBuilder />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="informes/:id/editar" 
      element={
        <ProtectedRoute requiredPermission="bi.edit_reports">
          <ReportBuilder />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="datasets" 
      element={
        <ProtectedRoute requiredPermission="bi.view_datasets">
          <DatasetManager />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="datasets/:id" 
      element={
        <ProtectedRoute requiredPermission="bi.view_datasets">
          <DatasetEditor />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="alertas" 
      element={
        <ProtectedRoute requiredPermission="bi.view_alerts">
          <AlertManager />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="alertas/nueva" 
      element={
        <ProtectedRoute requiredPermission="bi.create_alerts">
          <AlertConfig />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="alertas/:id/editar" 
      element={
        <ProtectedRoute requiredPermission="bi.create_alerts">
          <AlertConfig />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="admin" 
      element={
        <ProtectedRoute requiredPermission="bi.admin">
          <BIDashboard />
        </ProtectedRoute>
      } 
    />
  </Route>
);

export default biRoutes;
```

---

## 📦 Dependencias Específicas del Módulo

```json
{
  "dependencies": {
    "recharts": "^2.10.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "d3": "^7.8.5",
    "react-d3-tree": "^3.6.1",
    "jspdf": "^2.5.1",
    "xlsx":  "^0.18.5",
    "date-fns": "^3.0.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.3",
    "yup": "^1.3.3"
  }
}
```

---

Este archivo contiene todos los ejemplos de código necesarios para implementar el módulo BI en React. 