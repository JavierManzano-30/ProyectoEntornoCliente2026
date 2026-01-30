export const filterCustomers = (customers, filters) => {
  return customers.filter((customer) => {
    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        customer.nombre?.toLowerCase().includes(searchLower) ||
        customer.cif?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro por estado
    if (filters.estado && customer.estado !== filters.estado) {
      return false;
    }

    // Filtro por responsable
    if (filters.responsableId && customer.responsableId !== filters.responsableId) {
      return false;
    }

    return true;
  });
};

export const sortCustomers = (customers, sortBy, sortOrder = 'asc') => {
  const sorted = [...customers].sort((a, b) => {
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

export const calculateCustomerStats = (customers) => {
  const stats = {
    total: customers.length,
    activos: 0,
    inactivos: 0,
    valorTotal: 0,
  };

  customers.forEach((customer) => {
    if (customer.estado === 'activo') stats.activos++;
    if (customer.estado === 'inactivo') stats.inactivos++;
    stats.valorTotal += customer.valorTotal || 0;
  });

  return stats;
};
