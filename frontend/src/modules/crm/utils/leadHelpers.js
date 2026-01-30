export const filterLeads = (leads, filters) => {
  return leads.filter((lead) => {
    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        lead.nombre?.toLowerCase().includes(searchLower) ||
        lead.cif?.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro por estado
    if (filters.estado && lead.estado !== filters.estado) {
      return false;
    }

    // Filtro por fuente
    if (filters.fuente && lead.fuente !== filters.fuente) {
      return false;
    }

    // Filtro por responsable
    if (filters.responsableId && lead.responsableId !== filters.responsableId) {
      return false;
    }

    return true;
  });
};

export const sortLeads = (leads, sortBy, sortOrder = 'asc') => {
  const sorted = [...leads].sort((a, b) => {
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

export const calculateLeadStats = (leads) => {
  const stats = {
    total: leads.length,
    nuevos: 0,
    contactados: 0,
    calificados: 0,
    valorEstimado: 0,
  };

  leads.forEach((lead) => {
    if (lead.estado === 'nuevo') stats.nuevos++;
    if (lead.estado === 'contactado') stats.contactados++;
    if (lead.estado === 'calificado') stats.calificados++;
    stats.valorEstimado += lead.valorEstimado || 0;
  });

  return stats;
};
