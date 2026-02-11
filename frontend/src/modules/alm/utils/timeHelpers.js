// Calcular horas totales por proyecto
export const calculateTotalHoursByProject = (timeEntries, projectId) => {
  return timeEntries
    .filter(entry => entry.proyectoId === projectId)
    .reduce((sum, entry) => sum + (entry.horas || 0), 0);
};

// Calcular horas totales por tarea
export const calculateTotalHoursByTask = (timeEntries, taskId) => {
  return timeEntries
    .filter(entry => entry.tareaId === taskId)
    .reduce((sum, entry) => sum + (entry.horas || 0), 0);
};

// Calcular horas totales por usuario
export const calculateTotalHoursByUser = (timeEntries, userId) => {
  return timeEntries
    .filter(entry => entry.usuarioId === userId)
    .reduce((sum, entry) => sum + (entry.horas || 0), 0);
};

// Agrupar registros por fecha
export const groupEntriesByDate = (timeEntries) => {
  const grouped = {};
  
  timeEntries.forEach(entry => {
    if (!grouped[entry.fecha]) {
      grouped[entry.fecha] = [];
    }
    grouped[entry.fecha].push(entry);
  });
  
  return grouped;
};

// Agrupar registros por proyecto
export const groupEntriesByProject = (timeEntries) => {
  const grouped = {};
  
  timeEntries.forEach(entry => {
    if (!grouped[entry.proyectoId]) {
      grouped[entry.proyectoId] = {
        proyectoNombre: entry.proyectoNombre,
        entries: [],
        totalHoras: 0
      };
    }
    grouped[entry.proyectoId].entries.push(entry);
    grouped[entry.proyectoId].totalHoras += entry.horas;
  });
  
  return grouped;
};

// Filtrar registros de tiempo
export const filterTimeEntries = (entries, filters) => {
  return entries.filter(entry => {
    if (filters.proyectoId && entry.proyectoId !== filters.proyectoId) return false;
    if (filters.tareaId && entry.tareaId !== filters.tareaId) return false;
    if (filters.usuarioId && entry.usuarioId !== filters.usuarioId) return false;
    if (filters.fechaDesde && entry.fecha < filters.fechaDesde) return false;
    if (filters.fechaHasta && entry.fecha > filters.fechaHasta) return false;
    return true;
  });
};

// Calcular estadísticas de tiempo
export const calculateTimeStats = (timeEntries) => {
  const totalHoras = timeEntries.reduce((sum, entry) => sum + entry.horas, 0);
  const promedioHorasDiarias = totalHoras / (timeEntries.length || 1);
  
  const registrosPorUsuario = {};
  timeEntries.forEach(entry => {
    if (!registrosPorUsuario[entry.usuarioId]) {
      registrosPorUsuario[entry.usuarioId] = {
        nombre: entry.usuarioNombre,
        horas: 0,
        registros: 0
      };
    }
    registrosPorUsuario[entry.usuarioId].horas += entry.horas;
    registrosPorUsuario[entry.usuarioId].registros += 1;
  });
  
  return {
    totalHoras,
    totalRegistros: timeEntries.length,
    promedioHorasDiarias,
    registrosPorUsuario
  };
};

// Formatear duración
export const formatDuration = (hours) => {
  if (!hours) return '0h 0min';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}min`;
};

// Formatear fecha para input
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};
