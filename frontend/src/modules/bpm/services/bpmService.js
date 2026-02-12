/**
 * Servicio de comunicación con la API del módulo BPM
 */

import apiClient from '../../../lib/axios';

const BASE_URL = '/bpm';
const PROCESS_STATUS_FROM_API = {
  active: 'published',
  inactive: 'inactive',
  archived: 'archived',
  published: 'published',
  draft: 'draft'
};
const PROCESS_STATUS_TO_API = {
  published: 'active',
  draft: 'inactive',
  inactive: 'inactive',
  active: 'active',
  archived: 'archived'
};
const INSTANCE_STATUS_FROM_API = {
  started: 'active',
  in_progress: 'active',
  completed: 'completed',
  canceled: 'cancelled',
  cancelled: 'cancelled',
  error: 'error',
  active: 'active',
  pending: 'pending',
  paused: 'paused'
};
const INSTANCE_STATUS_TO_API = {
  active: 'active',
  pending: 'started',
  paused: 'paused',
  completed: 'completed',
  cancelled: 'canceled',
  canceled: 'canceled',
  error: 'error',
  started: 'started',
  in_progress: 'in_progress'
};
const TASK_STATUS_FROM_API = {
  pending: 'pending',
  in_progress: 'in_progress',
  completed: 'completed',
  rejected: 'cancelled',
  cancelled: 'cancelled',
  assigned: 'assigned'
};

const normalizeProcessStatus = (status) =>
  PROCESS_STATUS_FROM_API[status] || status || 'inactive';

const normalizeInstanceStatus = (status) =>
  INSTANCE_STATUS_FROM_API[status] || status || 'pending';

const normalizeTaskStatus = (status) =>
  TASK_STATUS_FROM_API[status] || status || 'pending';

const normalizeProcessFilters = (filters = {}) => {
  const normalized = { ...filters };
  if (normalized.busqueda !== undefined) {
    normalized.search = normalized.busqueda;
    delete normalized.busqueda;
  }
  if (normalized.estado !== undefined) {
    normalized.status = PROCESS_STATUS_TO_API[normalized.estado] || normalized.estado;
    delete normalized.estado;
  }
  if (normalized.status) {
    normalized.status = PROCESS_STATUS_TO_API[normalized.status] || normalized.status;
  }
  if (normalized.categoria !== undefined) {
    normalized.category = normalized.categoria;
    delete normalized.categoria;
  }
  return normalized;
};

const normalizeInstanceFilters = (filters = {}) => {
  const normalized = { ...filters };
  if (normalized.status) {
    normalized.status = INSTANCE_STATUS_TO_API[normalized.status] || normalized.status;
  }
  return normalized;
};

const unwrapResponse = (response) => {
  if (!response) return response;
  const payload = response.data;
  if (payload && payload.success === true && 'data' in payload) {
    return payload.data;
  }
  return payload;
};

const normalizeProcess = (process) => {
  if (!process) return process;
  return {
    ...process,
    nombre: process.nombre || process.name || 'Proceso',
    descripcion: process.descripcion || process.description || '',
    estado: normalizeProcessStatus(process.status || process.estado),
    codigo: process.codigo || process.code || process.id,
    version: process.version || 1,
    instancias_activas:
      process.instancias_activas ??
      process.activeInstances ??
      process.active_instances ??
      0,
    fecha_creacion: process.fecha_creacion || process.created_at || process.createdAt
  };
};

const normalizeInstance = (instance) => {
  if (!instance) return instance;
  const progressPercent =
    instance.progress_percent ?? instance.progressPercent ?? 0;
  const total = instance.progreso_total ?? 100;
  const completed =
    instance.tareas_completadas ??
    (total ? Math.round((progressPercent / 100) * total) : Math.round(progressPercent));

  return {
    ...instance,
    numero: instance.numero || instance.id,
    proceso_nombre:
      instance.proceso_nombre || instance.process_name || instance.processName || '',
    estado: normalizeInstanceStatus(instance.status || instance.estado),
    fecha_inicio: instance.fecha_inicio || instance.start_date || instance.startDate,
    fecha_fin: instance.fecha_fin || instance.end_date || instance.endDate,
    fecha_limite: instance.fecha_limite || instance.due_date || instance.dueDate,
    solicitante:
      instance.solicitante || instance.started_by || instance.startedBy || '',
    progreso_total: total || 0,
    tareas_completadas: completed || 0
  };
};

const normalizeTask = (task) => {
  if (!task) return task;
  return {
    ...task,
    nombre: task.nombre || task.title || task.name || 'Tarea',
    descripcion: task.descripcion || task.description || '',
    prioridad: task.prioridad || task.priority || 'normal',
    estado: normalizeTaskStatus(task.status || task.estado),
    proceso_nombre: task.proceso_nombre || task.process_name || task.processName || '',
    fecha_limite: task.fecha_limite || task.due_date || task.dueDate,
    fecha_inicio: task.fecha_inicio || task.start_date || task.startDate,
    fecha_fin: task.fecha_fin || task.completed_at || task.completedAt,
    asignado_a: task.asignado_a || task.assigned_to || task.assignedTo
  };
};

const normalizeMetrics = (metrics) => {
  if (!metrics) return metrics;
  if (metrics.procesos) return metrics;

  const procesosActivos = metrics.procesosActivos ?? 0;
  const instanciasActivas = metrics.instanciasActivas ?? 0;
  const tareasPendientes = metrics.tareasPendientes ?? 0;

  return {
    procesos: {
      total: procesosActivos,
      activos: procesosActivos,
      publicados: procesosActivos,
      borradores: 0
    },
    instancias: {
      total: instanciasActivas,
      activas: instanciasActivas,
      completadas: 0,
      canceladas: 0
    },
    tareas: {
      total: tareasPendientes,
      pendientes: tareasPendientes,
      enProgreso: 0,
      vencidas: 0
    },
    sla: {
      cumplimiento: 0,
      aTiempo: 0,
      enRiesgo: 0,
      vencidas: 0
    },
    tiempos: {
      promedioInstancia: 0,
      promedioTarea: 0,
      mayorDuracion: 0,
      menorDuracion: 0
    }
  };
};

const buildQueryString = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.append(key, value);
  });

  const query = params.toString();
  return query ? `?${query}` : '';
};

export const bpmService = {
  // ==================== PROCESOS ====================
  
  /**
   * Obtener todos los procesos
   */
  getAllProcesses: async (filters = {}) => {
    const response = await apiClient.get(
      `${BASE_URL}/procesos${buildQueryString(normalizeProcessFilters(filters))}`
    );
    const payload = unwrapResponse(response);
    const list = Array.isArray(payload) ? payload : payload?.data || [];
    return list.map(normalizeProcess);
  },

  /**
   * Obtener un proceso por ID
   */
  getProcessById: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/procesos/${id}`);
    const payload = unwrapResponse(response);
    return normalizeProcess(payload);
  },

  /**
   * Crear un nuevo proceso
   */
  createProcess: async (processData) => {
    const response = await apiClient.post(`${BASE_URL}/procesos`, processData);
    const payload = unwrapResponse(response);
    return normalizeProcess(payload);
  },

  /**
   * Actualizar un proceso
   */
  updateProcess: async (id, processData) => {
    const response = await apiClient.put(`${BASE_URL}/procesos/${id}`, processData);
    const payload = unwrapResponse(response);
    return normalizeProcess(payload);
  },

  /**
   * Publicar un proceso
   */
  publishProcess: async (id) => {
    const response = await apiClient.put(`${BASE_URL}/procesos/${id}`, { status: 'active' });
    const payload = unwrapResponse(response);
    return normalizeProcess(payload);
  },

  /**
   * Eliminar un proceso
   */
  deleteProcess: async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/procesos/${id}`);
    return unwrapResponse(response);
  },

  /**
   * Validar modelo de proceso
   */
  validateProcess: async (processData) => {
    const response = await apiClient.post(`${BASE_URL}/procesos/validar`, processData);
    return unwrapResponse(response);
  },

  // ==================== INSTANCIAS ====================

  /**
   * Obtener todas las instancias
   */
  getAllInstances: async (filters = {}) => {
    const response = await apiClient.get(
      `${BASE_URL}/instancias${buildQueryString(normalizeInstanceFilters(filters))}`
    );
    const payload = unwrapResponse(response);
    const list = Array.isArray(payload) ? payload : payload?.data || [];
    return list.map(normalizeInstance);
  },

  /**
   * Obtener una instancia por ID
   */
  getInstanceById: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/instancias/${id}`);
    const payload = unwrapResponse(response);
    return normalizeInstance(payload);
  },

  /**
   * Iniciar una nueva instancia
   */
  startInstance: async (processId, instanceData) => {
    const startedBy =
      instanceData?.startedBy || localStorage.getItem('userId') || null;
    const response = await apiClient.post(`${BASE_URL}/instancias`, {
      processId,
      startedBy,
      ...instanceData
    });
    const payload = unwrapResponse(response);
    return normalizeInstance(payload);
  },

  /**
   * Cancelar una instancia
   */
  cancelInstance: async (id, reason) => {
    const response = await apiClient.patch(`${BASE_URL}/instancias/${id}/cancel`, {
      reason
    });
    const payload = unwrapResponse(response);
    return normalizeInstance(payload);
  },

  /**
   * Pausar una instancia
   */
  pauseInstance: async (id) => {
    const response = await apiClient.put(`${BASE_URL}/instancias/${id}`, { status: 'in_progress' });
    return unwrapResponse(response);
  },

  /**
   * Reanudar una instancia
   */
  resumeInstance: async (id) => {
    const response = await apiClient.put(`${BASE_URL}/instancias/${id}`, { status: 'started' });
    return unwrapResponse(response);
  },

  /**
   * Obtener timeline de actividad de una instancia
   */
  getInstanceTimeline: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/instances/${id}/tasks`);
    const payload = unwrapResponse(response);
    const tasks = Array.isArray(payload) ? payload : payload?.data || [];

    return tasks.map((task) => ({
      id: task.id,
      tipo: 'tarea',
      estado: normalizeTaskStatus(task.status),
      fecha_inicio: task.startDate || task.createdAt || null,
      fecha: task.completedAt || task.startDate || task.createdAt || null,
      nombre: task.activityId || 'Actividad',
      descripcion: task.resultJson ? 'Actividad con resultado registrado' : 'Actividad en flujo',
      usuario: task.assignedTo || null
    }));
  },

  /**
   * Obtener variables de una instancia
   */
  getInstanceVariables: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/instancias/${id}`);
    const payload = unwrapResponse(response);
    const instance = payload?.data || payload;
    return instance?.variables || {};
  },

  // ==================== TAREAS ====================

  /**
   * Obtener bandeja de tareas del usuario actual
   */
  getTaskInbox: async (filters = {}) => {
    const response = await apiClient.get(`${BASE_URL}/tareas/bandeja${buildQueryString(filters)}`);
    const payload = unwrapResponse(response);
    const list = Array.isArray(payload) ? payload : payload?.data || [];
    return list.map(normalizeTask);
  },

  /**
   * Obtener una tarea por ID
   */
  getTaskById: async (id) => {
    const tasks = await bpmService.getTaskInbox();
    return tasks.find((task) => task.id === id) || null;
  },

  /**
   * Completar una tarea
   */
  completeTask: async (id, taskData) => {
    const response = await apiClient.patch(`${BASE_URL}/tasks/${id}`, {
      status: 'completed',
      resultJson: taskData || null
    });
    const payload = unwrapResponse(response);
    return normalizeTask(payload);
  },

  /**
   * Transferir una tarea
   */
  transferTask: async (id, userId, reason) => {
    const response = await apiClient.patch(`${BASE_URL}/tasks/${id}`, {
      assignedTo: userId,
      resultJson: reason ? { transferReason: reason } : null
    });
    const payload = unwrapResponse(response);
    return normalizeTask(payload);
  },

  /**
   * Guardar borrador de tarea
   */
  saveTaskDraft: async (id, draftData) => {
    const response = await apiClient.patch(`${BASE_URL}/tasks/${id}`, {
      resultJson: draftData || {}
    });
    const payload = unwrapResponse(response);
    return normalizeTask(payload);
  },

  /**
   * Solicitar información en una tarea
   */
  requestTaskInformation: async (id, message) => {
    const response = await apiClient.patch(`${BASE_URL}/tasks/${id}`, {
      status: 'pending',
      resultJson: { infoRequested: message }
    });
    const payload = unwrapResponse(response);
    return normalizeTask(payload);
  },

  // ==================== DOCUMENTOS ====================

  /**
   * Subir documento a una instancia
   */
  uploadDocument: async (instanceId, file, metadata = {}) => {
    const response = await apiClient.post(`${BASE_URL}/instances/${instanceId}/documents`, {
      fileName: metadata.fileName || file?.name || 'documento',
      documentType: metadata.documentType || metadata.type || null,
      size: metadata.size || file?.size || null,
      storageUrl: metadata.storageUrl || null,
      classification: metadata.classification || null
    });
    return unwrapResponse(response);
  },

  /**
   * Obtener documentos de una instancia
   */
  getInstanceDocuments: async (instanceId) => {
    const response = await apiClient.get(`${BASE_URL}/instances/${instanceId}/documents`);
    return unwrapResponse(response);
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
    return unwrapResponse(response);
  },

  // ==================== COMENTARIOS ====================

  /**
   * Añadir comentario a una instancia
   */
  addComment: async (instanceId, comment) => {
    const response = await apiClient.post(`${BASE_URL}/instances/${instanceId}/comments`, {
      content: comment
    });
    return unwrapResponse(response);
  },

  /**
   * Obtener comentarios de una instancia
   */
  getInstanceComments: async (instanceId) => {
    const response = await apiClient.get(`${BASE_URL}/instances/${instanceId}/comments`);
    return unwrapResponse(response);
  },

  // ==================== MÉTRICAS ====================

  /**
   * Obtener métricas del dashboard
   */
  getDashboardMetrics: async (filters = {}) => {
    const response = await apiClient.get(`${BASE_URL}/metricas${buildQueryString(filters)}`);
    const payload = unwrapResponse(response);
    return normalizeMetrics(payload);
  },

  /**
   * Obtener métricas de un proceso específico
   */
  getProcessMetrics: async (processId, filters = {}) => {
    const [instances, process] = await Promise.all([
      bpmService.getAllInstances({ processId, ...filters }),
      bpmService.getProcessById(processId)
    ]);

    return {
      processId,
      processName: process?.nombre || process?.name || processId,
      totalInstances: instances.length,
      activeInstances: instances.filter((instance) => instance.estado === 'active').length,
      completedInstances: instances.filter((instance) => instance.estado === 'completed').length,
      cancelledInstances: instances.filter((instance) => instance.estado === 'cancelled').length
    };
  }
};

export default bpmService;
