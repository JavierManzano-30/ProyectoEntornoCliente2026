/**
 * Servicio de comunicación con la API del módulo BPM
 */

import apiClient from '../../../lib/axios';

const BASE_URL = '/bpm';

export const bpmService = {
  // ==================== PROCESOS ====================
  
  /**
   * Obtener todos los procesos
   */
  getAllProcesses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/procesos?${params}`);
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
    const response = await apiClient.post(`${BASE_URL}/procesos/${id}/publicar`);
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
  getAllInstances: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/instancias?${params}`);
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
      ...instanceData
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
    return response.data;
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
    const response = await apiClient.get(`${BASE_URL}/metricas?${params}`);
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
