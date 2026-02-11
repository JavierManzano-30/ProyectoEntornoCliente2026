import api from '../../../lib/axios';
import { mockProjects, mockTasks, mockTimeEntries, mockALMStats } from '../data/mockData';

// Modo mock para desarrollo sin backend
const USE_MOCK_DATA = true;

// === PROYECTOS ===

export const getProjects = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    return { data: mockProjects };
  }
  const response = await api.get('/alm/proyectos', { params: filters });
  return response.data;
};

export const getProject = async (id) => {
  if (USE_MOCK_DATA) {
    const project = mockProjects.find(p => p.id === parseInt(id));
    return { data: project };
  }
  const response = await api.get(`/alm/proyectos/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  if (USE_MOCK_DATA) {
    const newProject = { id: mockProjects.length + 1, ...projectData };
    return { data: newProject };
  }
  const response = await api.post('/alm/proyectos', projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  if (USE_MOCK_DATA) {
    return { data: { id, ...projectData } };
  }
  const response = await api.put(`/alm/proyectos/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  if (USE_MOCK_DATA) {
    return { data: { success: true } };
  }
  const response = await api.delete(`/alm/proyectos/${id}`);
  return response.data;
};

// === TAREAS ===

export const getTasks = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    let tasks = [...mockTasks];
    if (filters.proyectoId) {
      tasks = tasks.filter(t => t.proyectoId === parseInt(filters.proyectoId));
    }
    return { data: tasks };
  }
  const response = await api.get('/alm/tareas', { params: filters });
  return response.data;
};

export const getTask = async (id) => {
  if (USE_MOCK_DATA) {
    const task = mockTasks.find(t => t.id === parseInt(id));
    return { data: task };
  }
  const response = await api.get(`/alm/tareas/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  if (USE_MOCK_DATA) {
    const newTask = { id: mockTasks.length + 1, ...taskData };
    return { data: newTask };
  }
  const response = await api.post('/alm/tareas', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  if (USE_MOCK_DATA) {
    return { data: { id, ...taskData } };
  }
  const response = await api.put(`/alm/tareas/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  if (USE_MOCK_DATA) {
    return { data: { success: true } };
  }
  const response = await api.delete(`/alm/tareas/${id}`);
  return response.data;
};

export const updateTaskStatus = async (id, estado) => {
  if (USE_MOCK_DATA) {
    return { data: { id, estado } };
  }
  const response = await api.patch(`/alm/tareas/${id}/estado`, { estado });
  return response.data;
};

// === REGISTRO DE TIEMPOS ===

export const getTimeEntries = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    let entries = [...mockTimeEntries];
    if (filters.proyectoId) {
      entries = entries.filter(e => e.proyectoId === parseInt(filters.proyectoId));
    }
    if (filters.tareaId) {
      entries = entries.filter(e => e.tareaId === parseInt(filters.tareaId));
    }
    return { data: entries };
  }
  const response = await api.get('/alm/tiempos', { params: filters });
  return response.data;
};

export const createTimeEntry = async (timeData) => {
  if (USE_MOCK_DATA) {
    const newEntry = { id: mockTimeEntries.length + 1, ...timeData };
    return { data: newEntry };
  }
  const response = await api.post('/alm/tiempos', timeData);
  return response.data;
};

export const updateTimeEntry = async (id, timeData) => {
  if (USE_MOCK_DATA) {
    return { data: { id, ...timeData } };
  }
  const response = await api.put(`/alm/tiempos/${id}`, timeData);
  return response.data;
};

export const deleteTimeEntry = async (id) => {
  if (USE_MOCK_DATA) {
    return { data: { success: true } };
  }
  const response = await api.delete(`/alm/tiempos/${id}`);
  return response.data;
};

// === ESTADÍSTICAS ===

export const getALMStats = async () => {
  if (USE_MOCK_DATA) {
    return { data: mockALMStats };
  }
  const response = await api.get('/alm/estadisticas');
  return response.data;
};

export const getProjectStats = async (projectId) => {
  if (USE_MOCK_DATA) {
    const project = mockProjects.find(p => p.id === parseInt(projectId));
    const tasks = mockTasks.filter(t => t.proyectoId === parseInt(projectId));
    const timeEntries = mockTimeEntries.filter(e => e.proyectoId === parseInt(projectId));
    
    return {
      data: {
        proyecto: project,
        totalTareas: tasks.length,
        tareasCompletadas: tasks.filter(t => t.estado === 'completada').length,
        horasTrabajadas: timeEntries.reduce((sum, e) => sum + e.horas, 0),
        tareas: tasks,
        registrosTiempo: timeEntries
      }
    };
  }
  const response = await api.get(`/alm/proyectos/${projectId}/estadisticas`);
  return response.data;
};
