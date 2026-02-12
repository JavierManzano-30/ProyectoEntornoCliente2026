export const filterActivities = (activities, filters) => {
  const typeFilter = filters.tipo || filters.type || '';
  const statusFilter = filters.estado || filters.status || '';
  const clientFilter = filters.clienteId || filters.clientId || '';
  const opportunityFilter = filters.oportunidadId || filters.opportunityId || '';
  const ownerFilter = filters.responsableId || filters.userId || '';

  return activities.filter((activity) => {
    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        activity.titulo?.toLowerCase().includes(searchLower) ||
        activity.descripcion?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro por tipo
    if (typeFilter && activity.tipo !== typeFilter) {
      return false;
    }

    // Filtro por estado
    if (statusFilter && activity.estado !== statusFilter) {
      return false;
    }

    // Filtro por cliente
    if (clientFilter && activity.clienteId !== clientFilter) {
      return false;
    }

    // Filtro por oportunidad
    if (opportunityFilter && activity.oportunidadId !== opportunityFilter) {
      return false;
    }

    // Filtro por responsable
    if (ownerFilter && activity.responsableId !== ownerFilter) {
      return false;
    }

    return true;
  });
};

export const sortActivities = (activities, sortBy, sortOrder = 'asc') => {
  const sorted = [...activities].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Manejo de valores null/undefined
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    // Ordenamiento de strings
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

export const calculateActivityStats = (activities) => {
  const stats = {
    total: activities.length,
    pendientes: 0,
    completadas: 0,
    enProgreso: 0,
    porTipo: {},
  };

  activities.forEach((activity) => {
    if (activity.estado === 'pendiente') stats.pendientes++;
    if (activity.estado === 'completada') stats.completadas++;
    if (activity.estado === 'en_progreso') stats.enProgreso++;

    // Contar por tipo
    const tipo = activity.tipo || 'otro';
    stats.porTipo[tipo] = (stats.porTipo[tipo] || 0) + 1;
  });

  return stats;
};

export const getUpcomingActivities = (activities, days = 7) => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return activities.filter((activity) => {
    if (activity.estado === 'completada' || activity.estado === 'cancelada') {
      return false;
    }

    const activityDate = new Date(activity.fechaProgramada);
    return activityDate >= now && activityDate <= futureDate;
  });
};

export const getOverdueActivities = (activities) => {
  const now = new Date();

  return activities.filter((activity) => {
    if (activity.estado === 'completada' || activity.estado === 'cancelada') {
      return false;
    }

    const activityDate = new Date(activity.fechaProgramada);
    return activityDate < now;
  });
};
