import api from '../../../lib/axios';

const PROJECT_STATUS_API_TO_UI = {
  planned: 'planificacion',
  in_progress: 'en_curso',
  paused: 'pausado',
  completed: 'completado',
  cancelled: 'cancelado',
};

const PROJECT_STATUS_UI_TO_API = {
  planificacion: 'planned',
  en_curso: 'in_progress',
  pausado: 'paused',
  completado: 'completed',
  cancelado: 'cancelled',
};

const TASK_STATUS_API_TO_UI = {
  pending: 'pendiente',
  in_progress: 'en_progreso',
  completed: 'completada',
  cancelled: 'cancelada',
};

const TASK_STATUS_UI_TO_API = {
  pendiente: 'pending',
  en_progreso: 'in_progress',
  completada: 'completed',
  cancelada: 'cancelled',
};

const TASK_PRIORITY_API_TO_UI = {
  low: 'baja',
  medium: 'media',
  high: 'alta',
  critical: 'critica',
};

const TASK_PRIORITY_UI_TO_API = {
  baja: 'low',
  media: 'medium',
  alta: 'high',
  critica: 'critical',
};

const parseNumber = (value) => Number(value || 0);

const normalizeProjectStatusToUI = (value) => PROJECT_STATUS_API_TO_UI[value] || value || 'planificacion';
const normalizeProjectStatusToAPI = (value) => PROJECT_STATUS_UI_TO_API[value] || value || 'planned';
const normalizeTaskStatusToUI = (value) => TASK_STATUS_API_TO_UI[value] || value || 'pendiente';
const normalizeTaskStatusToAPI = (value) => TASK_STATUS_UI_TO_API[value] || value || 'pending';
const normalizeTaskPriorityToUI = (value) => TASK_PRIORITY_API_TO_UI[value] || value || 'media';
const normalizeTaskPriorityToAPI = (value) => TASK_PRIORITY_UI_TO_API[value] || value || 'medium';

const mapProject = (row = {}) => ({
  id: row.id,
  nombre: row.name || row.nombre || '',
  descripcion: row.description,
  estado: normalizeProjectStatusToUI(row.status || row.estado),
  fechaInicio: row.startDate || row.start_date || null,
  fechaFin: row.endDate || row.end_date || null,
  presupuesto: parseNumber(row.budget || row.presupuesto),
  responsableId: row.responsibleId || row.responsible_id || null,
  responsableNombre: row.responsableNombre || row.responsibleName || '-',
  clienteId: row.clientId || row.client_id || null,
  progreso: parseNumber(row.progreso),
  tareasTotales: parseNumber(row.tareasTotales),
  tareasCompletadas: parseNumber(row.tareasCompletadas),
  horasEstimadas: parseNumber(row.horasEstimadas),
  horasTrabajadas: parseNumber(row.horasTrabajadas),
  createdAt: row.createdAt || row.created_at,
  updatedAt: row.updatedAt || row.updated_at,
});

const mapTask = (row = {}) => ({
  id: row.id,
  proyectoId: row.projectId || row.project_id,
  nombre: row.title || row.name || row.nombre || '',
  titulo: row.title || row.name || row.nombre || '',
  descripcion: row.description,
  estado: normalizeTaskStatusToUI(row.status || row.estado),
  prioridad: normalizeTaskPriorityToUI(row.priority || row.prioridad),
  asignadoA: row.assignedTo || row.assignee_id || row.assigned_to || '-',
  fechaInicio: row.startDate || row.start_date || null,
  fechaFin: row.dueDate || row.due_date || null,
  fechaVencimiento: row.dueDate || row.due_date || null,
  horasEstimadas: parseNumber(row.estimatedTime || row.estimated_time || row.estimated_hours),
  horasTrabajadas: parseNumber(row.horasTrabajadas),
  fechaCreacion: row.createdAt || row.created_at,
  createdAt: row.createdAt || row.created_at,
  updatedAt: row.updatedAt || row.updated_at,
});

const mapTime = (row = {}, taskProjectMap = new Map()) => ({
  id: row.id,
  proyectoId: row.projectId || row.project_id || taskProjectMap.get(row.taskId || row.task_id) || '',
  tareaId: row.taskId || row.task_id || '',
  usuarioId: row.userId || row.user_id || '',
  fecha: row.entryDate || row.entry_date || row.date || null,
  horas: parseNumber(row.hours || row.horas),
  descripcion: row.description,
  createdAt: row.createdAt || row.created_at,
  updatedAt: row.updatedAt || row.updated_at,
});

export const getProjects = async (filters = {}) => {
  const [projectsResponse, tasksResponse, timesResponse] = await Promise.all([
    api.get('/alm/projects', { params: filters }),
    api.get('/alm/tasks'),
    api.get('/alm/times'),
  ]);

  const projects = (projectsResponse.data || []).map(mapProject);
  const tasks = (tasksResponse.data || []).map(mapTask);
  const taskProjectMap = new Map(tasks.map((task) => [task.id, task.proyectoId]));
  const timeEntries = (timesResponse.data || []).map((row) => mapTime(row, taskProjectMap));

  const hoursByTaskId = timeEntries.reduce((acc, entry) => {
    acc.set(entry.tareaId, (acc.get(entry.tareaId) || 0) + parseNumber(entry.horas));
    return acc;
  }, new Map());

  const tasksByProjectId = tasks.reduce((acc, task) => {
    const key = task.proyectoId;
    if (!acc.has(key)) acc.set(key, []);
    const workedHours = hoursByTaskId.get(task.id) || 0;
    acc.get(key).push({
      ...task,
      horasTrabajadas: workedHours,
    });
    return acc;
  }, new Map());

  const enrichedProjects = projects.map((project) => {
    const projectTasks = tasksByProjectId.get(project.id) || [];
    const tareasTotales = projectTasks.length;
    const tareasCompletadas = projectTasks.filter((task) => task.estado === 'completada').length;
    const horasEstimadas = projectTasks.reduce((sum, task) => sum + parseNumber(task.horasEstimadas), 0);
    const horasTrabajadas = projectTasks.reduce((sum, task) => sum + parseNumber(task.horasTrabajadas), 0);
    const progreso = tareasTotales > 0 ? Math.round((tareasCompletadas / tareasTotales) * 100) : 0;

    return {
      ...project,
      tareasTotales,
      tareasCompletadas,
      horasEstimadas,
      horasTrabajadas,
      progreso,
    };
  });

  return { data: enrichedProjects };
};

export const getProject = async (id) => {
  const [projectResponse, statsResponse] = await Promise.all([
    api.get(`/alm/projects/${id}`),
    api.get(`/alm/projects/${id}/stats`),
  ]);

  const project = mapProject(projectResponse.data);
  const stats = statsResponse.data || {};

  return {
    data: {
      ...project,
      tareasTotales: parseNumber(stats.totalTasks),
      tareasCompletadas: parseNumber(stats.completed),
      horasEstimadas: parseNumber(stats.estimatedHours),
      horasTrabajadas: parseNumber(stats.realHours),
      progreso: parseNumber(stats.completionPercent),
    },
  };
};

export const createProject = async (projectData) => {
  const payload = {
    name: projectData.nombre || projectData.name,
    description: projectData.descripcion,
    status: normalizeProjectStatusToAPI(projectData.estado),
    startDate: projectData.fechaInicio || projectData.startDate,
    endDate: projectData.fechaFin || projectData.endDate,
    budget: projectData.presupuesto,
    responsibleId: projectData.responsableId,
    clientId: projectData.clienteId,
  };
  const response = await api.post('/alm/projects', payload);
  return { data: mapProject(response.data) };
};

export const updateProject = async (id, projectData) => {
  const payload = {
    name: projectData.nombre || projectData.name,
    description: projectData.descripcion,
    status: normalizeProjectStatusToAPI(projectData.estado),
    startDate: projectData.fechaInicio || projectData.startDate,
    endDate: projectData.fechaFin || projectData.endDate,
    budget: projectData.presupuesto,
    responsibleId: projectData.responsableId,
    clientId: projectData.clienteId,
  };
  const response = await api.put(`/alm/projects/${id}`, payload);
  return { data: mapProject(response.data) };
};

export const deleteProject = async (id) => {
  await api.delete(`/alm/projects/${id}`);
  return { data: { success: true } };
};

export const getTasks = async (filters = {}) => {
  const params = {
    ...filters,
    projectId: filters.projectId || filters.proyectoId,
  };
  delete params.proyectoId;
  const response = await api.get('/alm/tasks', { params });
  return { data: (response.data || []).map(mapTask) };
};

export const getTask = async (id) => {
  const response = await api.get(`/alm/tasks/${id}`);
  return { data: mapTask(response.data) };
};

export const createTask = async (taskData) => {
  const payload = {
    projectId: taskData.proyectoId || taskData.projectId,
    title: taskData.nombre || taskData.title,
    description: taskData.descripcion,
    status: normalizeTaskStatusToAPI(taskData.estado),
    priority: normalizeTaskPriorityToAPI(taskData.prioridad),
    assignedTo: taskData.asignadoA,
    dueDate: taskData.fechaFin || taskData.fechaVencimiento,
    estimatedTime: taskData.horasEstimadas,
  };
  const response = await api.post('/alm/tasks', payload);
  return { data: mapTask(response.data) };
};

export const updateTask = async (id, taskData) => {
  const payload = {
    projectId: taskData.proyectoId || taskData.projectId,
    title: taskData.nombre || taskData.title,
    description: taskData.descripcion,
    status: normalizeTaskStatusToAPI(taskData.estado),
    priority: normalizeTaskPriorityToAPI(taskData.prioridad),
    assignedTo: taskData.asignadoA,
    dueDate: taskData.fechaFin || taskData.fechaVencimiento,
    estimatedTime: taskData.horasEstimadas,
  };
  const response = await api.put(`/alm/tasks/${id}`, payload);
  return { data: mapTask(response.data) };
};

export const deleteTask = async (id) => {
  await api.delete(`/alm/tasks/${id}`);
  return { data: { success: true } };
};

export const updateTaskStatus = async (id, estado) => {
  const response = await api.patch(`/alm/tasks/${id}/status`, { status: normalizeTaskStatusToAPI(estado) });
  return { data: mapTask(response.data) };
};

export const getTimeEntries = async (filters = {}) => {
  const [timesResponse, tasksResponse] = await Promise.all([
    api.get('/alm/times', { params: filters }),
    api.get('/alm/tasks'),
  ]);

  const tasks = (tasksResponse.data || []).map(mapTask);
  const taskProjectMap = new Map(tasks.map((task) => [task.id, task.proyectoId]));

  return {
    data: (timesResponse.data || []).map((row) => mapTime(row, taskProjectMap)),
  };
};

export const createTimeEntry = async (timeData) => {
  const userId = timeData.usuarioId || localStorage.getItem('userId') || '';
  const payload = {
    taskId: timeData.tareaId,
    userId,
    entryDate: timeData.fecha,
    hours: timeData.horas,
    description: timeData.descripcion,
  };
  const response = await api.post('/alm/times', payload);
  return { data: mapTime(response.data) };
};

export const updateTimeEntry = async (id, timeData) => {
  const userId = timeData.usuarioId || localStorage.getItem('userId') || '';
  const payload = {
    taskId: timeData.tareaId,
    userId,
    entryDate: timeData.fecha,
    hours: timeData.horas,
    description: timeData.descripcion,
  };
  const response = await api.put(`/alm/times/${id}`, payload);
  return { data: mapTime(response.data) };
};

export const deleteTimeEntry = async (id) => {
  await api.delete(`/alm/times/${id}`);
  return { data: { success: true } };
};

export const getALMStats = async () => {
  const [projectsResponse, tasksResponse] = await Promise.all([getProjects(), getTasks()]);
  const projects = projectsResponse.data || [];
  const tasks = tasksResponse.data || [];

  return {
    data: {
      totalProyectos: projects.length,
      proyectosActivos: projects.filter((p) => p.estado === 'en_curso').length,
      totalTareas: tasks.length,
      tareasCompletadas: tasks.filter((t) => t.estado === 'completada').length,
    },
  };
};

export const getProjectStats = async (projectId) => {
  const response = await api.get(`/alm/projects/${projectId}/stats`);
  return { data: response.data };
};
