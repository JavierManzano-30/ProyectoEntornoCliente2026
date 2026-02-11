import { PROJECT_STATUS_LABELS } from '../constants/projectStatus';

// Calcular progreso del proyecto
export const calculateProgress = (tareasCompletadas, tareasTotales) => {
  if (!tareasTotales || tareasTotales === 0) return 0;
  return Math.round((tareasCompletadas / tareasTotales) * 100);
};

// Calcular días restantes
export const calculateDaysRemaining = (fechaFin) => {
  const today = new Date();
  const endDate = new Date(fechaFin);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Determinar si un proyecto está retrasado
export const isProjectDelayed = (fechaFin, progreso) => {
  const daysRemaining = calculateDaysRemaining(fechaFin);
  return daysRemaining < 0 && progreso < 100;
};

// Formatear fechas
export const formatDate = (fecha) => {
  if (!fecha) return '-';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Calcular eficiencia (horas trabajadas vs estimadas)
export const calculateEfficiency = (horasTrabajadas, horasEstimadas) => {
  if (!horasEstimadas || horasEstimadas === 0) return 100;
  return Math.round((horasEstimadas / horasTrabajadas) * 100);
};

// Filtrar proyectos
export const filterProjects = (projects, filters) => {
  return projects.filter(project => {
    if (filters.estado && project.estado !== filters.estado) return false;
    if (filters.responsableId && project.responsableId !== filters.responsableId) return false;
    if (filters.clienteId && project.clienteId !== filters.clienteId) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!project.nombre.toLowerCase().includes(searchLower) &&
          !project.descripcion?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });
};

// Ordenar proyectos
export const sortProjects = (projects, sortBy, sortOrder = 'asc') => {
  const sorted = [...projects].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'fechaInicio' || sortBy === 'fechaFin') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

// Calcular estadísticas de proyectos
export const calculateProjectStats = (projects) => {
  return {
    total: projects.length,
    activos: projects.filter(p => p.estado === 'en_curso').length,
    completados: projects.filter(p => p.estado === 'completado').length,
    enPlanificacion: projects.filter(p => p.estado === 'planificacion').length,
    pausados: projects.filter(p => p.estado === 'pausado').length,
    horasTotales: projects.reduce((sum, p) => sum + (p.horasTrabajadas || 0), 0),
    presupuestoTotal: projects.reduce((sum, p) => sum + (p.presupuesto || 0), 0)
  };
};

// Formatear presupuesto
export const formatBudget = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Obtener estado label
export const getProjectStatusLabel = (estado) => {
  return PROJECT_STATUS_LABELS[estado] || estado;
};
