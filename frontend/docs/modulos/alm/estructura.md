# 📦 Módulo ALM Frontend - Estructura y Código (React)

Este documento detalla la **estructura completa del módulo ALM** en el frontend de React, incluyendo componentes, hooks, servicios, contextos, tipos, constantes y rutas.

---

## 📂 Estructura de Carpetas

```
src/
└── modules/
    └── alm/
        ├── components/                      # Componentes específicos del módulo
        │   ├── projects/
        │   │   ├── ProjectCard.jsx
        │   │   ├── ProjectTable.jsx
        │   │   ├── ProjectFilters.jsx
        │   │   ├── ProjectStats.jsx
        │   │   ├── ProjectHeader.jsx
        │   │   ├── ProjectInfoTab.jsx
        │   │   ├── ProjectTimeline.jsx
        │   │   ├── ProjectForm.jsx
        │   │   └── ProjectStatusBadge.jsx
        │   │
        │   ├── tasks/
        │   │   ├── TaskCard.jsx
        │   │   ├── TaskTable.jsx
        │   │   ├── TaskBoard.jsx
        │   │   ├── TaskColumn.jsx
        │   │   ├── TaskForm.jsx
        │   │   ├── TaskFilters.jsx
        │   │   ├── TaskPriorityBadge.jsx
        │   │   ├── TaskStatusBadge.jsx
        │   │   ├── TaskAssignmentDropdown.jsx
        │   │   └── TaskComments.jsx
        │   │
        │   ├── timeTracking/
        │   │   ├── TimeEntryForm.jsx
        │   │   ├── TimeLogTable.jsx
        │   │   ├── TimeTimer.jsx
        │   │   ├── TimeSummary.jsx
        │   │   ├── TimeChart.jsx
        │   │   ├── TimeFilters.jsx
        │   │   └── TimeComparison.jsx
        │   │
        │   ├── sprints/
        │   │   ├── SprintCard.jsx
        │   │   ├── SprintForm.jsx
        │   │   ├── SprintBoard.jsx
        │   │   ├── SprintBacklog.jsx
        │   │   ├── SprintProgress. jsx
        │   │   └── SprintBurndown.jsx
        │   │
        │   └── shared/
        │       ├── ProgressBar.jsx
        │       ├── DateRangePicker.jsx
        │       ├── UserAssignmentPicker.jsx
        │       └── EstimationInput.jsx
        │
        ├── pages/                           # Páginas principales del módulo
        │   ├── ProjectList.jsx
        │   ├── ProjectDetail.jsx
        │   ├── ProjectForm.jsx
        │   ├── TaskManagement.jsx
        │   ├── TaskDetail.jsx
        │   ├── TimeTracking.jsx
        │   ├── SprintPlanning.jsx
        │   └── ALMDashboard.jsx
        │
        ├── hooks/                           # Custom hooks del módulo
        │   ├── useProjects.js
        │   ├── useProject.js
        │   ├── useTasks.js
        │   ├── useTask.js
        │   ├── useTimeTracking.js
        │   ├── useTimeEntry.js
        │   ├── useSprints.js
        │   ├── useProjectStats.js
        │   ├── useTaskFilters.js
        │   └── useDragAndDrop.js
        │
        ├── context/                         # Contexto específico del módulo
        │   ├── ALMContext.jsx
        │   └── ALMProvider.jsx
        │
        ├── services/                        # Servicios de comunicación con API
        │   └── almService.js
        │
        ├── utils/                           # Utilidades específicas del módulo
        │   ├── projectHelpers.js
        │   ├── taskHelpers.js
        │   ├── timeCalculations.js
        │   ├── progressCalculations.js
        │   ├── dateUtils.js
        │   ├── validators.js
        │   └── formatters.js
        │
        ├── constants/                       # Constantes del módulo
        │   ├── projectStatus.js
        │   ├── taskStatus.js
        │   ├── taskPriority.js
        │   ├── sprintStatus.js
        │   └── viewModes.js
        │
        ├── styles/                          # Estilos específicos del módulo
        │   ├── alm.module.css
        │   ├── projects.module.css
        │   ├── tasks.module.css
        │   ├── taskBoard.module.css
        │   └── timeTracking.module.css
        │
        └── __tests__/                       # Tests del módulo
            ├── pages/
            │   ├── ProjectList.test.jsx
            │   ├── ProjectDetail. test.jsx
            │   └── TaskManagement.test.jsx
            ├── components/
            │   ├── ProjectCard.test.jsx
            │   ├── TaskBoard.test.jsx
            │   └── TimeEntryForm.test.jsx
            ├── hooks/
            │   ├── useProjects. test.js
            │   ├── useTasks.test.js
            │   └── useTimeTracking.test. js
            └── services/
                └── almService.test. js
```

---

## 1.  Servicios API (services)

### projectService.js

```javascript
// services/projectService.js
import apiClient from '@/utils/apiClient';

const BASE_URL = '/alm/proyectos';

export const projectService = {
  /**
   * Obtener todos los proyectos
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}?${params}`);
    return response.data;
  },

  /**
   * Obtener un proyecto por ID
   */
  getById: async (id) => {
    const response = await apiClient. get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo proyecto
   */
  create: async (projectData) => {
    const response = await apiClient.post(BASE_URL, projectData);
    return response.data;
  },

  /**
   * Actualizar un proyecto existente
   */
  update:  async (id, projectData) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, projectData);
    return response.data;
  },

  /**
   * Eliminar un proyecto
   */
  delete: async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Obtener tareas de un proyecto
   */
  getTasks: async (projectId) => {
    const response = await apiClient.get(`${BASE_URL}/${projectId}/tareas`);
    return response.data;
  },

  /**
   * Obtener estadísticas del proyecto
   */
  getStats: async (projectId) => {
    const response = await apiClient.get(`${BASE_URL}/${projectId}/stats`);
    return response.data;
  }
};

export default projectService;
```

### taskService.js

```javascript
// services/taskService.js
import apiClient from '@/utils/apiClient';

const BASE_URL = '/alm/tareas';

export const taskService = {
  /**
   * Obtener todas las tareas
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}?${params}`);
    return response.data;
  },

  /**
   * Obtener una tarea por ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Crear una nueva tarea
   */
  create: async (taskData) => {
    const response = await apiClient.post(BASE_URL, taskData);
    return response.data;
  },

  /**
   * Actualizar una tarea existente
   */
  update: async (id, taskData) => {
    const response = await apiClient. put(`${BASE_URL}/${id}`, taskData);
    return response.data;
  },

  /**
   * Eliminar una tarea
   */
  delete: async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Cambiar estado de una tarea
   */
  updateStatus: async (id, newStatus) => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/status`, {
      estado: newStatus
    });
    return response.data;
  },

  /**
   * Asignar tarea a usuario
   */
  assignTask: async (id, userId) => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/assign`, {
      asignado_a: userId
    });
    return response.data;
  }
};

export default taskService;
```

### timeTrackingService.js

```javascript
// services/timeTrackingService. js
import apiClient from '@/utils/apiClient';

const BASE_URL = '/alm/tiempos';

export const timeTrackingService = {
  /**
   * Obtener registros de tiempo
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}?${params}`);
    return response.data;
  },

  /**
   * Registrar tiempo en una tarea
   */
  logTime: async (timeData) => {
    const response = await apiClient.post(BASE_URL, timeData);
    return response.data;
  },

  /**
   * Actualizar registro de tiempo
   */
  update: async (id, timeData) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, timeData);
    return response.data;
  },

  /**
   * Eliminar registro de tiempo
   */
  delete: async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Obtener resumen de tiempos por proyecto
   */
  getProjectSummary: async (projectId) => {
    const response = await apiClient.get(`${BASE_URL}/proyecto/${projectId}/resumen`);
    return response.data;
  },

  /**
   * Obtener tiempos por usuario
   */
  getUserTime: async (userId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`${BASE_URL}/usuario/${userId}?${params}`);
    return response.data;
  }
};

export default timeTrackingService;
```

---

## 2. Hooks Personalizados (hooks)

### useProjects.js

```javascript
// hooks/useProjects. js
import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { useNotification } from '@/hooks/useNotification';

export const useProjects = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getAll(filters);
      setProjects(data);
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar proyectos', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      showNotification('Proyecto creado exitosamente', 'success');
      return newProject;
    } catch (err) {
      showNotification('Error al crear proyecto', 'error');
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const updated = await projectService.update(id, projectData);
      setProjects(prev => 
        prev.map(p => p.id === id ? updated : p)
      );
      showNotification('Proyecto actualizado exitosamente', 'success');
      return updated;
    } catch (err) {
      showNotification('Error al actualizar proyecto', 'error');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      showNotification('Proyecto eliminado exitosamente', 'success');
    } catch (err) {
      showNotification('Error al eliminar proyecto', 'error');
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
};
```

### useTasks.js

```javascript
// hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useNotification } from '@/hooks/useNotification';

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll(filters);
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
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService. create(taskData);
      setTasks(prev => [...prev, newTask]);
      showNotification('Tarea creada exitosamente', 'success');
      return newTask;
    } catch (err) {
      showNotification('Error al crear tarea', 'error');
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updated = await taskService.update(id, taskData);
      setTasks(prev => 
        prev.map(t => t.id === id ? updated : t)
      );
      showNotification('Tarea actualizada exitosamente', 'success');
      return updated;
    } catch (err) {
      showNotification('Error al actualizar tarea', 'error');
      throw err;
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const updated = await taskService.updateStatus(id, newStatus);
      setTasks(prev => 
        prev.map(t => t.id === id ? updated : t)
      );
      showNotification('Estado actualizado exitosamente', 'success');
      return updated;
    } catch (err) {
      showNotification('Error al actualizar estado', 'error');
      throw err;
    }
  };

  const assignTask = async (id, userId) => {
    try {
      const updated = await taskService.assignTask(id, userId);
      setTasks(prev => 
        prev.map(t => t.id === id ? updated : t)
      );
      showNotification('Tarea asignada exitosamente', 'success');
      return updated;
    } catch (err) {
      showNotification('Error al asignar tarea', 'error');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      showNotification('Tarea eliminada exitosamente', 'success');
    } catch (err) {
      showNotification('Error al eliminar tarea', 'error');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    assignTask,
    deleteTask
  };
};
```

### useTimeTracking.js

```javascript
// hooks/useTimeTracking.js
import { useState, useEffect, useCallback } from 'react';
import { timeTrackingService } from '../services/timeTrackingService';
import { useNotification } from '@/hooks/useNotification';

export const useTimeTracking = (filters = {}) => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const fetchTimeEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await timeTrackingService.getAll(filters);
      setTimeEntries(data);
    } catch (err) {
      setError(err. message);
      showNotification('Error al cargar registros de tiempo', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    fetchTimeEntries();
  }, [fetchTimeEntries]);

  const logTime = async (timeData) => {
    try {
      const newEntry = await timeTrackingService.logTime(timeData);
      setTimeEntries(prev => [...prev, newEntry]);
      showNotification('Tiempo registrado exitosamente', 'success');
      return newEntry;
    } catch (err) {
      showNotification('Error al registrar tiempo', 'error');
      throw err;
    }
  };

  const updateTimeEntry = async (id, timeData) => {
    try {
      const updated = await timeTrackingService.update(id, timeData);
      setTimeEntries(prev => 
        prev.map(e => e.id === id ? updated : e)
      );
      showNotification('Registro actualizado exitosamente', 'success');
      return updated;
    } catch (err) {
      showNotification('Error al actualizar registro', 'error');
      throw err;
    }
  };

  const deleteTimeEntry = async (id) => {
    try {
      await timeTrackingService.delete(id);
      setTimeEntries(prev => prev.filter(e => e.id !== id));
      showNotification('Registro eliminado exitosamente', 'success');
    } catch (err) {
      showNotification('Error al eliminar registro', 'error');
      throw err;
    }
  };

  return {
    timeEntries,
    loading,
    error,
    fetchTimeEntries,
    logTime,
    updateTimeEntry,
    deleteTimeEntry
  };
};
```

---

## 3. Context y Provider

### ALMContext.jsx

```javascript
// context/ALMContext.jsx
import { createContext, useContext } from 'react';

export const ALMContext = createContext(null);

export const useALMContext = () => {
  const context = useContext(ALMContext);
  if (!context) {
    throw new Error('useALMContext debe usarse dentro de ALMProvider');
  }
  return context;
};
```

### ALMProvider.jsx

```javascript
// context/ALMProvider.jsx
import React, { useState, useMemo } from 'react';
import { ALMContext } from './ALMContext';

export const ALMProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board' | 'calendar'
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo:  '',
    search: ''
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status:  '',
      priority: '',
      assignedTo: '',
      search: ''
    });
  };

  const contextValue = useMemo(() => ({
    selectedProject,
    setSelectedProject,
    selectedTask,
    setSelectedTask,
    viewMode,
    setViewMode,
    filters,
    updateFilter,
    clearFilters
  }), [selectedProject, selectedTask, viewMode, filters]);

  return (
    <ALMContext.Provider value={contextValue}>
      {children}
    </ALMContext.Provider>
  );
};
```

---

## 4. Componentes de Proyectos

### ProjectCard.jsx

```jsx
// components/projects/ProjectCard.jsx
import React from 'react';
import { Card, Badge, Progress, Avatar } from '@/components/ui';
import { Link } from 'react-router-dom';
import { PROJECT_STATUS_CONFIG } from '../../constants/alm.constants';

export const ProjectCard = ({ project }) => {
  const statusConfig = PROJECT_STATUS_CONFIG[project.estado];
  
  const progress = project.total_tareas > 0 
    ? (project.tareas_completadas / project.total_tareas) * 100 
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link to={`/alm/proyectos/${project.id}`}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {project.nombre}
            </h3>
            <Badge color={statusConfig.color}>
              {statusConfig.label}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {project.descripcion}
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progreso</span>
              <span>{project.tareas_completadas}/{project.total_tareas} tareas</span>
            </div>
            <Progress value={progress} color={statusConfig.color} />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar 
                src={project.responsable?. avatar_url} 
                alt={project.responsable?.nombre}
                size="sm"
              />
              <span className="text-sm text-gray-700">
                {project.responsable?.nombre}
              </span>
            </div>
            
            {project.cliente && (
              <span className="text-xs text-gray-500">
                {project. cliente.nombre}
              </span>
            )}
          </div>

          {project.fecha_fin && (
            <div className="mt-3 text-xs text-gray-500">
              Fecha fin: {new Date(project.fecha_fin).toLocaleDateString()}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};
```

### ProjectForm.jsx

```jsx
// components/projects/ProjectForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, Select, Textarea, Button, DatePicker } from '@/components/ui';
import { PROJECT_STATUS } from '../../constants/alm. constants';

const projectSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  descripcion: yup.string(),
  estado: yup.string().required('El estado es obligatorio'),
  responsable_id: yup.number().required('El responsable es obligatorio'),
  cliente_id: yup.number().nullable(),
  fecha_inicio: yup.date().required('La fecha de inicio es obligatoria'),
  fecha_fin: yup.date().nullable(),
  presupuesto: yup.number().nullable()
});

export const ProjectForm = ({ project, users, clients, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: project || {
      estado: PROJECT_STATUS.PLANIFICACION
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre del Proyecto"
        {...register('nombre')}
        error={errors.nombre?.message}
        required
      />

      <Textarea
        label="Descripción"
        {...register('descripcion')}
        error={errors.descripcion?.message}
        rows={4}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Estado"
          {...register('estado')}
          error={errors.estado?.message}
          required
        >
          <option value={PROJECT_STATUS.PLANIFICACION}>Planificación</option>
          <option value={PROJECT_STATUS.EN_CURSO}>En Curso</option>
          <option value={PROJECT_STATUS.PAUSADO}>Pausado</option>
          <option value={PROJECT_STATUS.COMPLETADO}>Completado</option>
        </Select>

        <Select
          label="Responsable"
          {...register('responsable_id')}
          error={errors.responsable_id?.message}
          required
        >
          <option value="">Seleccionar responsable</option>
          {users?.map(user => (
            <option key={user.id} value={user.id}>
              {user.nombre} {user.apellidos}
            </option>
          ))}
        </Select>
      </div>

      <Select
        label="Cliente (opcional)"
        {...register('cliente_id')}
        error={errors.cliente_id?.message}
      >
        <option value="">Sin cliente asignado</option>
        {clients?.map(client => (
          <option key={client.id} value={client.id}>
            {client.nombre}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          label="Fecha de Inicio"
          {... register('fecha_inicio')}
          error={errors.fecha_inicio?.message}
          required
        />

        <DatePicker
          label="Fecha de Fin"
          {...register('fecha_fin')}
          error={errors.fecha_fin?. message}
        />
      </div>

      <Input
        label="Presupuesto"
        type="number"
        step="0.01"
        {... register('presupuesto')}
        error={errors.presupuesto?.message}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : project ?  'Actualizar' : 'Crear Proyecto'}
        </Button>
      </div>
    </form>
  );
};
```

---

## 5. Componentes de Tareas

### TaskCard.jsx

```jsx
// components/tasks/TaskCard.jsx
import React from 'react';
import { Card, Badge, Avatar } from '@/components/ui';
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '../../constants/alm. constants';

export const TaskCard = ({ task, onDragStart, onClick }) => {
  const statusConfig = TASK_STATUS_CONFIG[task.estado];
  const priorityConfig = TASK_PRIORITY_CONFIG[task.prioridad];

  return (
    <Card
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => onDragStart? .(e, task)}
      onClick={() => onClick?.(task)}
    >
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-800">{task.titulo}</h4>
          <Badge color={priorityConfig.color} size="sm">
            {priorityConfig.label}
          </Badge>
        </div>

        {task.descripcion && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.descripcion}
          </p>
        )}

        <div className="flex justify-between items-center">
          {task.asignado && (
            <div className="flex items-center gap-2">
              <Avatar 
                src={task.asignado.avatar_url}
                alt={task.asignado.nombre}
                size="xs"
              />
              <span className="text-xs text-gray-700">
                {task.asignado.nombre}
              </span>
            </div>
          )}

          <Badge color={statusConfig.color} size="sm">
            {statusConfig.label}
          </Badge>
        </div>

        {task.fecha_limite && (
          <div className="mt-2 text-xs text-gray-500">
            Vence:  {new Date(task.fecha_limite).toLocaleDateString()}
          </div>
        )}
      </div>
    </Card>
  );
};
```

### TaskBoard.jsx

```jsx
// components/tasks/TaskBoard.jsx
import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { TASK_STATUS } from '../../constants/alm. constants';

export const TaskBoard = ({ tasks, onTaskMove, onTaskClick }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { status:  TASK_STATUS.PENDIENTE, title: 'Pendiente', color: 'bg-gray-100' },
    { status:  TASK_STATUS.EN_PROGRESO, title: 'En Progreso', color: 'bg-blue-100' },
    { status: TASK_STATUS. COMPLETADA, title: 'Completada', color: 'bg-green-100' }
  ];

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.estado !== newStatus) {
      onTaskMove(draggedTask.id, newStatus);
    }
    setDraggedTask(null);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.estado === status);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map(column => (
        <div key={column.status} className="flex flex-col">
          <div className={`${column.color} p-3 rounded-t-lg`}>
            <h3 className="font-semibold text-gray-800">
              {column.title}
              <span className="ml-2 text-sm text-gray-600">
                ({getTasksByStatus(column.status).length})
              </span>
            </h3>
          </div>
          
          <div
            className="bg-gray-50 p-3 rounded-b-lg min-h-[500px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column. status)}
          >
            {getTasksByStatus(column.status).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onClick={onTaskClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### TaskForm.jsx

```jsx
// components/tasks/TaskForm. jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, Select, Textarea, Button, DatePicker } from '@/components/ui';
import { TASK_STATUS, TASK_PRIORITY } from '../../constants/alm.constants';

const taskSchema = yup. object({
  titulo: yup.string().required('El título es obligatorio'),
  descripcion: yup.string(),
  proyecto_id: yup.number().required('El proyecto es obligatorio'),
  asignado_a: yup.number().nullable(),
  estado: yup.string().required('El estado es obligatorio'),
  prioridad: yup.string().required('La prioridad es obligatoria'),
  fecha_limite: yup.date().nullable(),
  horas_estimadas: yup.number().nullable()
});

export const TaskForm = ({ task, projects, users, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState:  { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: task || {
      estado: TASK_STATUS.PENDIENTE,
      prioridad: TASK_PRIORITY.MEDIA
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título de la Tarea"
        {... register('titulo')}
        error={errors.titulo?.message}
        required
      />

      <Textarea
        label="Descripción"
        {...register('descripcion')}
        error={errors.descripcion?.message}
        rows={4}
      />

      <Select
        label="Proyecto"
        {...register('proyecto_id')}
        error={errors.proyecto_id?.message}
        required
      >
        <option value="">Seleccionar proyecto</option>
        {projects?.map(project => (
          <option key={project.id} value={project.id}>
            {project. nombre}
          </option>
        ))}
      </Select>

      <Select
        label="Asignado a"
        {... register('asignado_a')}
        error={errors.asignado_a?.message}
      >
        <option value="">Sin asignar</option>
        {users?.map(user => (
          <option key={user.id} value={user.id}>
            {user.nombre} {user. apellidos}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Estado"
          {...register('estado')}
          error={errors.estado?.message}
          required
        >
          <option value={TASK_STATUS.PENDIENTE}>Pendiente</option>
          <option value={TASK_STATUS.EN_PROGRESO}>En Progreso</option>
          <option value={TASK_STATUS.COMPLETADA}>Completada</option>
        </Select>

        <Select
          label="Prioridad"
          {...register('prioridad')}
          error={errors.prioridad?.message}
          required
        >
          <option value={TASK_PRIORITY.BAJA}>Baja</option>
          <option value={TASK_PRIORITY.MEDIA}>Media</option>
          <option value={TASK_PRIORITY. ALTA}>Alta</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          label="Fecha Límite"
          {...register('fecha_limite')}
          error={errors.fecha_limite?.message}
        />

        <Input
          label="Horas Estimadas"
          type="number"
          step="0.5"
          {...register('horas_estimadas')}
          error={errors.horas_estimadas?.message}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : task ? 'Actualizar' :  'Crear Tarea'}
        </Button>
      </div>
    </form>
  );
};
```

---

## 6. Páginas Principales

### ProjectList.jsx

```jsx
// pages/ProjectList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Select, Spinner } from '@/components/ui';
import { ProjectCard } from '../components/projects/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import { PROJECT_STATUS } from '../constants/alm. constants';

export const ProjectList = () => {
  const [filters, setFilters] = useState({ search: '', status: '' });
  const { projects, loading } = useProjects(filters);

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <Link to="/alm/proyectos/nuevo">
          <Button>Nuevo Proyecto</Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Buscar proyectos..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e. target.value })}
          className="flex-1"
        />
        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos los estados</option>
          <option value={PROJECT_STATUS.PLANIFICACION}>Planificación</option>
          <option value={PROJECT_STATUS.EN_CURSO}>En Curso</option>
          <option value={PROJECT_STATUS.PAUSADO}>Pausado</option>
          <option value={PROJECT_STATUS.COMPLETADO}>Completado</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md: grid-cols-2 lg: grid-cols-3 gap-4">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron proyectos
        </div>
      )}
    </div>
  );
};
```

### TaskManagement.jsx

```jsx
// pages/TaskManagement.jsx
import React, { useState } from 'react';
import { Button, Modal } from '@/components/ui';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { useALMContext } from '../context/ALMContext';

export const TaskManagement = () => {
  const { viewMode, setViewMode } = useALMContext();
  const { tasks, updateTaskStatus, createTask } = useTasks();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskMove = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
    setShowTaskModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Tareas</h1>
        
        <div className="flex gap-3">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('list')}
            >
              Lista
            </Button>
            <Button
              variant={viewMode === 'board' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('board')}
            >
              Tablero
            </Button>
          </div>
          
          <Button onClick={() => setShowTaskModal(true)}>
            Nueva Tarea
          </Button>
        </div>
      </div>

      {viewMode === 'board' ?  (
        <TaskBoard
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onTaskClick={handleTaskClick}
        />
      )}

      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title={selectedTask ? 'Editar Tarea' : 'Nueva Tarea'}
      >
        <TaskForm
          task={selectedTask}
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskModal(false)}
        />
      </Modal>
    </div>
  );
};
```

---

## 7. Tipos TypeScript (opcional)

### alm.types.js

```javascript
// types/alm.types.js

/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {number} empresa_id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {'planificacion'|'en_curso'|'pausado'|'completado'} estado
 * @property {number} responsable_id
 * @property {number|null} cliente_id
 * @property {string} fecha_inicio
 * @property {string|null} fecha_fin
 * @property {number|null} presupuesto
 * @property {number} total_tareas
 * @property {number} tareas_completadas
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {number} empresa_id
 * @property {number} proyecto_id
 * @property {string} titulo
 * @property {string} descripcion
 * @property {'pendiente'|'en_progreso'|'completada'} estado
 * @property {'baja'|'media'|'alta'} prioridad
 * @property {number|null} asignado_a
 * @property {string|null} fecha_limite
 * @property {number|null} horas_estimadas
 * @property {number|null} horas_reales
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} TimeEntry
 * @property {number} id
 * @property {number} empresa_id
 * @property {number} tarea_id
 * @property {number} usuario_id
 * @property {number} horas
 * @property {string} fecha
 * @property {string|null} descripcion
 * @property {string} created_at
 */

export const ProjectType = {};
export const TaskType = {};
export const TimeEntryType = {};
```

---

## 8. Constantes del Módulo

### alm.constants. js

```javascript
// constants/alm.constants.js

export const PROJECT_STATUS = {
  PLANIFICACION: 'planificacion',
  EN_CURSO: 'en_curso',
  PAUSADO: 'pausado',
  COMPLETADO: 'completado'
};

export const PROJECT_STATUS_CONFIG = {
  [PROJECT_STATUS.PLANIFICACION]: {
    label: 'Planificación',
    color: 'gray'
  },
  [PROJECT_STATUS.EN_CURSO]: {
    label: 'En Curso',
    color: 'blue'
  },
  [PROJECT_STATUS.PAUSADO]:  {
    label: 'Pausado',
    color: 'yellow'
  },
  [PROJECT_STATUS.COMPLETADO]: {
    label: 'Completado',
    color: 'green'
  }
};

export const TASK_STATUS = {
  PENDIENTE: 'pendiente',
  EN_PROGRESO: 'en_progreso',
  COMPLETADA:  'completada'
};

export const TASK_STATUS_CONFIG = {
  [TASK_STATUS.PENDIENTE]:  {
    label: 'Pendiente',
    color: 'gray'
  },
  [TASK_STATUS.EN_PROGRESO]: {
    label: 'En Progreso',
    color: 'blue'
  },
  [TASK_STATUS.COMPLETADA]: {
    label: 'Completada',
    color: 'green'
  }
};

export const TASK_PRIORITY = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta'
};

export const TASK_PRIORITY_CONFIG = {
  [TASK_PRIORITY.BAJA]: {
    label: 'Baja',
    color: 'gray'
  },
  [TASK_PRIORITY.MEDIA]: {
    label: 'Media',
    color: 'yellow'
  },
  [TASK_PRIORITY.ALTA]:  {
    label: 'Alta',
    color: 'red'
  }
};
```

---

## 9. Rutas del Módulo

### almRoutes.jsx

```jsx
// routes/almRoutes.jsx
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ALMProvider } from '../modules/alm/context/ALMProvider';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Lazy loading
const ProjectList = lazy(() => import('../modules/alm/pages/ProjectList'));
const ProjectDetail = lazy(() => import('../modules/alm/pages/ProjectDetail'));
const ProjectForm = lazy(() => import('../modules/alm/pages/ProjectForm'));
const TaskManagement = lazy(() => import('../modules/alm/pages/TaskManagement'));
const TimeTracking = lazy(() => import('../modules/alm/pages/TimeTracking'));

const almRoutes = (
  <Route
    path="/alm"
    element={
      <ALMProvider>
        <ProtectedRoute requiredPermission="alm.view" />
      </ALMProvider>
    }
  >
    <Route index element={<ProjectList />} />
    <Route path="proyectos" element={<ProjectList />} />
    <Route path="proyectos/nuevo" element={<ProjectForm />} />
    <Route path="proyectos/:id" element={<ProjectDetail />} />
    <Route path="proyectos/:id/editar" element={<ProjectForm />} />
    <Route path="tareas" element={<TaskManagement />} />
    <Route 
      path="tiempos" 
      element={
        <ProtectedRoute requiredPermission="alm.track_time">
          <TimeTracking />
        </ProtectedRoute>
      } 
    />
  </Route>
);

export default almRoutes;
```

---

## 📦 Dependencias Específicas del Módulo

```json
{
  "dependencies":  {
    "react-beautiful-dnd": "^13.1.1",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.3",
    "yup": "^1.3.3",
    "date-fns": "^3.0.0"
  }
}
```

---

Este archivo contiene todos los ejemplos de código necesarios para implementar el módulo ALM en React. 