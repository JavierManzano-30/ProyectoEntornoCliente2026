# 📦 Módulo BPM – Estructura Frontend

Este documento detalla la **estructura completa del módulo BPM** en el frontend de React, incluyendo componentes, hooks, servicios, contextos, tipos, constantes y rutas.

---

## 📂 Estructura de Carpetas

```
src/
└── modules/
    └── bpm/
        ├── components/                      # Componentes específicos del módulo
        │   ├── processes/
        │   │   ├── ProcessCard.jsx
        │   │   ├── ProcessTable.jsx
        │   │   ├── ProcessFilters.jsx
        │   │   ├── ProcessStats.jsx
        │   │   ├── ProcessHeader.jsx
        │   │   ├── ProcessVersionBadge.jsx
        │   │   └── ProcessStatusBadge.jsx
        │   │
        │   ├── designer/
        │   │   ├── BPMNCanvas.jsx
        │   │   ├── ToolboxPanel.jsx
        │   │   ├── PropertiesPanel.jsx
        │   │   ├── ElementToolbox.jsx
        │   │   ├── ValidationPanel.jsx
        │   │   └── BPMNViewer.jsx
        │   │
        │   ├── instances/
        │   │   ├── InstanceCard.jsx
        │   │   ├── InstanceTable.jsx
        │   │   ├── InstanceFilters.jsx
        │   │   ├── InstanceStatusBadge.jsx
        │   │   ├── InstanceDiagram.jsx
        │   │   ├── InstanceTimeline. jsx
        │   │   └── InstanceActions.jsx
        │   │
        │   ├── tasks/
        │   │   ├── TaskCard.jsx
        │   │   ├── TaskTable.jsx
        │   │   ├── TaskInboxTabs.jsx
        │   │   ├── TaskFilters.jsx
        │   │   ├── TaskPriorityBadge.jsx
        │   │   ├── TaskForm.jsx
        │   │   ├── TaskActions.jsx
        │   │   └── TaskComments.jsx
        │   │
        │   ├── forms/
        │   │   ├── DynamicFormBuilder.jsx
        │   │   ├── FormField.jsx
        │   │   ├── FormValidation.jsx
        │   │   └── ProcessStartForm.jsx
        │   │
        │   ├── documents/
        │   │   ├── DocumentUploader.jsx
        │   │   ├── DocumentList.jsx
        │   │   ├── DocumentViewer.jsx
        │   │   └── DocumentCard.jsx
        │   │
        │   └── shared/
        │       ├── SLAProgressBar.jsx
        │       ├── ActivityTimeline.jsx
        │       ├── UserPicker.jsx
        │       ├── CommentThread.jsx
        │       └── DateRangePicker.jsx
        │
        ├── pages/                           # Páginas principales del módulo
        │   ├── ProcessList.jsx
        │   ├── ProcessDesigner.jsx
        │   ├── TaskInbox.jsx
        │   ├── TaskDetail.jsx
        │   ├── InstanceMonitor.jsx
        │   ├── InstanceDetail.jsx
        │   ├── ProcessStartForm.jsx
        │   └── BPMDashboard.jsx
        │
        ├── hooks/                           # Custom hooks del módulo
        │   ├── useProcesses.js
        │   ├── useProcess.js
        │   ├── useInstances.js
        │   ├── useInstance.js
        │   ├── useTasks.js
        │   ├── useTask.js
        │   ├── useTaskInbox.js
        │   ├── useBPMNEditor.js
        │   ├── useDocuments.js
        │   └── useBPMMetrics.js
        │
        ├── context/                         # Contexto específico del módulo
        │   ├── BPMContext.jsx
        │   └── BPMProvider.jsx
        │
        ├── services/                        # Servicios de comunicación con API
        │   └── bpmService.js
        │
        ├── utils/                           # Utilidades específicas del módulo
        │   ├── processHelpers.js
        │   ├── instanceHelpers.js
        │   ├── taskHelpers.js
        │   ├── slaCalculations.js
        │   ├── bpmnParser.js
        │   ├── formBuilder.js
        │   ├── dateUtils.js
        │   └── validators.js
        │
        ├── constants/                       # Constantes del módulo
        │   ├── processStatus.js
        │   ├── instanceStatus.js
        │   ├── taskStatus.js
        │   ├── taskPriority.js
        │   ├── slaThresholds.js
        │   └── bpmnElements.js
        │
        ├── styles/                          # Estilos específicos del módulo
        │   ├── bpm.module.css
        │   ├── processes.module.css
        │   ├── tasks.module.css
        │   ├── designer.module.css
        │   └── instances.module.css
        │
        └── __tests__/                       # Tests del módulo
            ├── pages/
            │   ├── ProcessList.test.jsx
            │   ├── TaskInbox.test.jsx
            │   └── InstanceMonitor.test. jsx
            ├── components/
            │   ├── ProcessCard.test.jsx
            │   ├── TaskForm.test.jsx
            │   └── BPMNCanvas.test.jsx
            ├── hooks/
            │   ├── useProcesses.test. js
            │   ├── useTasks.test.js
            │   └── useInstances.test.js
            └── services/
                └── bpmService.test.js
```

---

## Ejemplos de Código

### 1. 🔌 Servicios API (services)

#### bpmService.js

```javascript
// services/bpmService.js
import apiClient from '@/utils/apiClient';

const BASE_URL = '/bpm';

export const bpmService = {
  // ==================== PROCESOS ====================
  
  /**
   * Obtener todos los procesos
   */
  getAllProcesses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/procesos? ${params}`);
    return response.data;
  },

  /**
   * Obtener un proceso por ID
   */
  getProcessById: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/procesos/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo proceso
   */
  createProcess: async (processData) => {
    const response = await apiClient.post(`${BASE_URL}/procesos`, processData);
    return response.data;
  },

  /**
   * Actualizar un proceso
   */
  updateProcess: async (id, processData) => {
    const response = await apiClient.put(`${BASE_URL}/procesos/${id}`, processData);
    return response.data;
  },

  /**
   * Publicar un proceso
   */
  publishProcess: async (id) => {
    const response = await apiClient. post(`${BASE_URL}/procesos/${id}/publicar`);
    return response.data;
  },

  /**
   * Eliminar un proceso
   */
  deleteProcess: async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/procesos/${id}`);
    return response.data;
  },

  /**
   * Validar modelo de proceso
   */
  validateProcess: async (processData) => {
    const response = await apiClient.post(`${BASE_URL}/procesos/validar`, processData);
    return response.data;
  },

  // ==================== INSTANCIAS ====================

  /**
   * Obtener todas las instancias
   */
  getAllInstances:  async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/instancias? ${params}`);
    return response.data;
  },

  /**
   * Obtener una instancia por ID
   */
  getInstanceById: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/instancias/${id}`);
    return response.data;
  },

  /**
   * Iniciar una nueva instancia
   */
  startInstance: async (processId, instanceData) => {
    const response = await apiClient.post(`${BASE_URL}/instancias`, {
      proceso_id: processId,
      ... instanceData
    });
    return response.data;
  },

  /**
   * Cancelar una instancia
   */
  cancelInstance: async (id, reason) => {
    const response = await apiClient.post(`${BASE_URL}/instancias/${id}/cancelar`, { motivo: reason });
    return response.data;
  },

  /**
   * Pausar una instancia
   */
  pauseInstance: async (id) => {
    const response = await apiClient.post(`${BASE_URL}/instancias/${id}/pausar`);
    return response.data;
  },

  /**
   * Reanudar una instancia
   */
  resumeInstance: async (id) => {
    const response = await apiClient.post(`${BASE_URL}/instancias/${id}/reanudar`);
    return response.data;
  },

  /**
   * Obtener timeline de actividad de una instancia
   */
  getInstanceTimeline: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/instancias/${id}/timeline`);
    return response.data;
  },

  /**
   * Obtener variables de una instancia
   */
  getInstanceVariables: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/instancias/${id}/variables`);
    return response.data;
  },

  // ==================== TAREAS ====================

  /**
   * Obtener bandeja de tareas del usuario actual
   */
  getTaskInbox: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/tareas/bandeja?${params}`);
    return response.data;
  },

  /**
   * Obtener una tarea por ID
   */
  getTaskById: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/tareas/${id}`);
    return response.data;
  },

  /**
   * Completar una tarea
   */
  completeTask: async (id, taskData) => {
    const response = await apiClient.post(`${BASE_URL}/tareas/${id}/completar`, taskData);
    return response.data;
  },

  /**
   * Transferir una tarea
   */
  transferTask: async (id, userId, reason) => {
    const response = await apiClient.post(`${BASE_URL}/tareas/${id}/transferir`, {
      usuario_id: userId,
      motivo: reason
    });
    return response.data;
  },

  /**
   * Guardar borrador de tarea
   */
  saveTaskDraft: async (id, draftData) => {
    const response = await apiClient.post(`${BASE_URL}/tareas/${id}/borrador`, draftData);
    return response.data;
  },

  /**
   * Solicitar información en una tarea
   */
  requestTaskInformation: async (id, message) => {
    const response = await apiClient.post(`${BASE_URL}/tareas/${id}/solicitar-info`, {
      mensaje: message
    });
    return response. data;
  },

  // ==================== DOCUMENTOS ====================

  /**
   * Subir documento a una instancia
   */
  uploadDocument: async (instanceId, file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    const response = await apiClient.post(
      `${BASE_URL}/instancias/${instanceId}/documentos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  /**
   * Obtener documentos de una instancia
   */
  getInstanceDocuments: async (instanceId) => {
    const response = await apiClient.get(`${BASE_URL}/instancias/${instanceId}/documentos`);
    return response.data;
  },

  /**
   * Descargar documento
   */
  downloadDocument: async (documentId) => {
    const response = await apiClient.get(`${BASE_URL}/documentos/${documentId}/descargar`, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Eliminar documento
   */
  deleteDocument: async (documentId) => {
    const response = await apiClient.delete(`${BASE_URL}/documentos/${documentId}`);
    return response.data;
  },

  // ==================== COMENTARIOS ====================

  /**
   * Añadir comentario a una instancia
   */
  addComment: async (instanceId, comment) => {
    const response = await apiClient.post(`${BASE_URL}/instancias/${instanceId}/comentarios`, {
      comentario: comment
    });
    return response.data;
  },

  /**
   * Obtener comentarios de una instancia
   */
  getInstanceComments: async (instanceId) => {
    const response = await apiClient.get(`${BASE_URL}/instancias/${instanceId}/comentarios`);
    return response.data;
  },

  // ==================== MÉTRICAS ====================

  /**
   * Obtener métricas del dashboard
   */
  getDashboardMetrics: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient. get(`${BASE_URL}/metricas?${params}`);
    return response.data;
  },

  /**
   * Obtener métricas de un proceso específico
   */
  getProcessMetrics: async (processId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/procesos/${processId}/metricas?${params}`);
    return response.data;
  }
};

export default bpmService;
```

---

### 2. 🪝 Hooks Personalizados (hooks)

#### useProcesses.js

```javascript
// hooks/useProcesses.js
import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';
import { useNotification } from '@/hooks/useNotification';

export const useProcesses = (initialFilters = {}) => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showNotification } = useNotification();

  const fetchProcesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getAllProcesses(filters);
      setProcesses(data);
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar procesos', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  const createProcess = async (processData) => {
    try {
      const newProcess = await bpmService.createProcess(processData);
      setProcesses(prev => [...prev, newProcess]);
      showNotification('Proceso creado exitosamente', 'success');
      return newProcess;
    } catch (err) {
      showNotification('Error al crear proceso', 'error');
      throw err;
    }
  };

  const updateProcess = async (id, processData) => {
    try {
      const updated = await bpmService.updateProcess(id, processData);
      setProcesses(prev => prev. map(p => p.id === id ? updated : p));
      showNotification('Proceso actualizado exitosamente', 'success');
      return updated;
    } catch (err) {
      showNotification('Error al actualizar proceso', 'error');
      throw err;
    }
  };

  const publishProcess = async (id) => {
    try {
      const published = await bpmService.publishProcess(id);
      setProcesses(prev => prev.map(p => p.id === id ?  published : p));
      showNotification('Proceso publicado exitosamente', 'success');
      return published;
    } catch (err) {
      showNotification('Error al publicar proceso', 'error');
      throw err;
    }
  };

  const deleteProcess = async (id) => {
    try {
      await bpmService.deleteProcess(id);
      setProcesses(prev => prev.filter(p => p. id !== id));
      showNotification('Proceso eliminado exitosamente', 'success');
    } catch (err) {
      showNotification('Error al eliminar proceso', 'error');
      throw err;
    }
  };

  return {
    processes,
    loading,
    error,
    filters,
    setFilters,
    fetchProcesses,
    createProcess,
    updateProcess,
    publishProcess,
    deleteProcess
  };
};
```

#### useTaskInbox.js

```javascript
// hooks/useTaskInbox.js
import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';
import { useNotification } from '@/hooks/useNotification';

export const useTaskInbox = (initialFilters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showNotification } = useNotification();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getTaskInbox(filters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar tareas', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    fetchTasks();
    
    // Polling cada 30 segundos
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const completeTask = async (id, taskData) => {
    try {
      await bpmService.completeTask(id, taskData);
      setTasks(prev => prev.filter(t => t.id !== id));
      showNotification('Tarea completada exitosamente', 'success');
    } catch (err) {
      showNotification('Error al completar tarea', 'error');
      throw err;
    }
  };

  const transferTask = async (id, userId, reason) => {
    try {
      await bpmService.transferTask(id, userId, reason);
      setTasks(prev => prev.filter(t => t.id !== id));
      showNotification('Tarea transferida exitosamente', 'success');
    } catch (err) {
      showNotification('Error al transferir tarea', 'error');
      throw err;
    }
  };

  const saveTaskDraft = async (id, draftData) => {
    try {
      await bpmService.saveTaskDraft(id, draftData);
      showNotification('Borrador guardado', 'success');
    } catch (err) {
      showNotification('Error al guardar borrador', 'error');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    fetchTasks,
    completeTask,
    transferTask,
    saveTaskDraft
  };
};
```

#### useInstances.js

```javascript
// hooks/useInstances.js
import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';
import { useNotification } from '@/hooks/useNotification';

export const useInstances = (initialFilters = {}) => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showNotification } = useNotification();

  const fetchInstances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getAllInstances(filters);
      setInstances(data);
    } catch (err) {
      setError(err. message);
      showNotification('Error al cargar instancias', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  const startInstance = async (processId, instanceData) => {
    try {
      const newInstance = await bpmService.startInstance(processId, instanceData);
      setInstances(prev => [newInstance, ...prev]);
      showNotification('Instancia iniciada exitosamente', 'success');
      return newInstance;
    } catch (err) {
      showNotification('Error al iniciar instancia', 'error');
      throw err;
    }
  };

  const cancelInstance = async (id, reason) => {
    try {
      await bpmService.cancelInstance(id, reason);
      setInstances(prev => prev.map(i => i.id === id ? { ...i, estado: 'cancelada' } : i));
      showNotification('Instancia cancelada exitosamente', 'success');
    } catch (err) {
      showNotification('Error al cancelar instancia', 'error');
      throw err;
    }
  };

  const pauseInstance = async (id) => {
    try {
      await bpmService.pauseInstance(id);
      setInstances(prev => prev.map(i => i.id === id ? { ... i, estado: 'pausada' } : i));
      showNotification('Instancia pausada', 'success');
    } catch (err) {
      showNotification('Error al pausar instancia', 'error');
      throw err;
    }
  };

  const resumeInstance = async (id) => {
    try {
      await bpmService. resumeInstance(id);
      setInstances(prev => prev. map(i => i.id === id ? { ...i, estado: 'activa' } : i));
      showNotification('Instancia reanudada', 'success');
    } catch (err) {
      showNotification('Error al reanudar instancia', 'error');
      throw err;
    }
  };

  return {
    instances,
    loading,
    error,
    filters,
    setFilters,
    fetchInstances,
    startInstance,
    cancelInstance,
    pauseInstance,
    resumeInstance
  };
};
```

---

### 3. 🔄 Context y Provider

#### BPMContext.jsx

```javascript
// context/BPMContext.jsx
import { createContext, useContext } from 'react';

export const BPMContext = createContext(null);

export const useBPMContext = () => {
  const context = useContext(BPMContext);
  if (!context) {
    throw new Error('useBPMContext debe usarse dentro de BPMProvider');
  }
  return context;
};
```

#### BPMProvider.jsx

```javascript
// context/BPMProvider. jsx
import React, { useState, useMemo, useCallback } from 'react';
import { BPMContext } from './BPMContext';

export const BPMProvider = ({ children }) => {
  // Estado global del módulo
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Filtros globales
  const [processFilters, setProcessFilters] = useState({
    search: '',
    status: '',
    category: ''
  });

  const [instanceFilters, setInstanceFilters] = useState({
    search: '',
    status: '',
    process: '',
    assignee: '',
    dateRange: null
  });

  const [taskFilters, setTaskFilters] = useState({
    priority: '',
    status: '',
    process: '',
    dueDate: ''
  });

  // Funciones de utilidad
  const updateProcessFilter = useCallback((key, value) => {
    setProcessFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearProcessFilters = useCallback(() => {
    setProcessFilters({
      search: '',
      status: '',
      category: ''
    });
  }, []);

  const updateInstanceFilter = useCallback((key, value) => {
    setInstanceFilters(prev => ({ ... prev, [key]: value }));
  }, []);

  const clearInstanceFilters = useCallback(() => {
    setInstanceFilters({
      search: '',
      status: '',
      process: '',
      assignee: '',
      dateRange: null
    });
  }, []);

  const updateTaskFilter = useCallback((key, value) => {
    setTaskFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearTaskFilters = useCallback(() => {
    setTaskFilters({
      priority: '',
      status: '',
      process: '',
      dueDate: ''
    });
  }, []);

  const contextValue = useMemo(() => ({
    // Estado
    selectedProcess,
    selectedInstance,
    selectedTask,
    processFilters,
    instanceFilters,
    taskFilters,
    
    // Setters
    setSelectedProcess,
    setSelectedInstance,
    setSelectedTask,
    
    // Funciones de filtros
    updateProcessFilter,
    clearProcessFilters,
    updateInstanceFilter,
    clearInstanceFilters,
    updateTaskFilter,
    clearTaskFilters
  }), [
    selectedProcess,
    selectedInstance,
    selectedTask,
    processFilters,
    instanceFilters,
    task