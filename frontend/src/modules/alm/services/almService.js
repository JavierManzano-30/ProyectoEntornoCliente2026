import api from '../../../lib/axios';

const mapProject = (row = {}) => ({
  id: row.id,
  nombre: row.name,
  descripcion: row.description,
  estado: row.status,
  fechaInicio: row.start_date,
  fechaFin: row.end_date,
  presupuesto: Number(row.budget || 0),
  responsableId: row.responsible_id,
  clienteId: row.client_id,
  progreso: Number(row.progress || 0),
  horasEstimadas: Number(row.estimated_hours || 0),
  horasTrabajadas: Number(row.spent_hours || 0),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapTask = (row = {}) => ({
  id: row.id,
  proyectoId: row.project_id,
  nombre: row.title || row.name,
  descripcion: row.description,
  estado: row.status,
  prioridad: row.priority,
  asignadoA: row.assignee_id,
  fechaInicio: row.start_date,
  fechaFin: row.due_date,
  horasEstimadas: Number(row.estimated_hours || 0),
  horasTrabajadas: Number(row.spent_hours || 0),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapTime = (row = {}) => ({
  id: row.id,
  proyectoId: row.project_id,
  tareaId: row.task_id,
  usuarioId: row.user_id,
  fecha: row.date,
  horas: Number(row.hours || 0),
  descripcion: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getProjects = async (filters = {}) => {
  const response = await api.get('/alm/projects', { params: filters });
  return { data: (response.data || []).map(mapProject) };
};

export const getProject = async (id) => {
  const response = await api.get(`/alm/projects/${id}`);
  return { data: mapProject(response.data) };
};

export const createProject = async (projectData) => {
  const payload = {
    name: projectData.nombre,
    description: projectData.descripcion,
    status: projectData.estado,
    start_date: projectData.fechaInicio,
    end_date: projectData.fechaFin,
    budget: projectData.presupuesto,
    responsible_id: projectData.responsableId,
    client_id: projectData.clienteId,
  };
  const response = await api.post('/alm/projects', payload);
  return { data: mapProject(response.data) };
};

export const updateProject = async (id, projectData) => {
  const payload = {
    name: projectData.nombre,
    description: projectData.descripcion,
    status: projectData.estado,
    start_date: projectData.fechaInicio,
    end_date: projectData.fechaFin,
    budget: projectData.presupuesto,
    responsible_id: projectData.responsableId,
    client_id: projectData.clienteId,
  };
  const response = await api.put(`/alm/projects/${id}`, payload);
  return { data: mapProject(response.data) };
};

export const deleteProject = async (id) => {
  await api.delete(`/alm/projects/${id}`);
  return { data: { success: true } };
};

export const getTasks = async (filters = {}) => {
  const response = await api.get('/alm/tasks', { params: filters });
  return { data: (response.data || []).map(mapTask) };
};

export const getTask = async (id) => {
  const response = await api.get(`/alm/tasks/${id}`);
  return { data: mapTask(response.data) };
};

export const createTask = async (taskData) => {
  const payload = {
    project_id: taskData.proyectoId,
    title: taskData.nombre,
    description: taskData.descripcion,
    status: taskData.estado,
    priority: taskData.prioridad,
    assignee_id: taskData.asignadoA,
    due_date: taskData.fechaFin,
    estimated_hours: taskData.horasEstimadas,
  };
  const response = await api.post('/alm/tasks', payload);
  return { data: mapTask(response.data) };
};

export const updateTask = async (id, taskData) => {
  const payload = {
    title: taskData.nombre,
    description: taskData.descripcion,
    status: taskData.estado,
    priority: taskData.prioridad,
    assignee_id: taskData.asignadoA,
    due_date: taskData.fechaFin,
    estimated_hours: taskData.horasEstimadas,
  };
  const response = await api.put(`/alm/tasks/${id}`, payload);
  return { data: mapTask(response.data) };
};

export const deleteTask = async (id) => {
  await api.delete(`/alm/tasks/${id}`);
  return { data: { success: true } };
};

export const updateTaskStatus = async (id, estado) => {
  const response = await api.patch(`/alm/tasks/${id}/status`, { status: estado });
  return { data: mapTask(response.data) };
};

export const getTimeEntries = async (filters = {}) => {
  const response = await api.get('/alm/times', { params: filters });
  return { data: (response.data || []).map(mapTime) };
};

export const createTimeEntry = async (timeData) => {
  const payload = {
    project_id: timeData.proyectoId,
    task_id: timeData.tareaId,
    date: timeData.fecha,
    hours: timeData.horas,
    description: timeData.descripcion,
  };
  const response = await api.post('/alm/times', payload);
  return { data: mapTime(response.data) };
};

export const updateTimeEntry = async (id, timeData) => {
  const payload = {
    project_id: timeData.proyectoId,
    task_id: timeData.tareaId,
    date: timeData.fecha,
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
  const projects = (await getProjects()).data;
  const tasks = (await getTasks()).data;

  return {
    data: {
      totalProyectos: projects.length,
      proyectosActivos: projects.filter((p) => p.estado === 'active' || p.estado === 'en_curso').length,
      totalTareas: tasks.length,
      tareasCompletadas: tasks.filter((t) => t.estado === 'completed' || t.estado === 'completada').length,
    },
  };
};

export const getProjectStats = async (projectId) => {
  const response = await api.get(`/alm/projects/${projectId}/stats`);
  return { data: response.data };
};
