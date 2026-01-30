/**
 * Formatea el número de empleados
 */
export const formatEmployeeCount = (count) => {
  if (!count) return '0 empleados';
  if (count === 1) return '1 empleado';
  return `${count} empleados`;
};

/**
 * Obtiene las iniciales de la empresa para el logo
 */
export const getCompanyInitials = (company) => {
  if (!company || !company.nombre) return '??';
  
  const words = company.nombre.split(' ');
  if (words.length === 1) {
    return company.nombre.substring(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[1][0]).toUpperCase();
};

/**
 * Formatea la dirección completa
 */
export const formatAddress = (company) => {
  if (!company) return '';
  
  const parts = [
    company.direccion,
    company.ciudad,
    company.codigoPostal,
    company.pais,
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Filtra empresas según criterios
 */
export const filterCompanies = (companies, filters) => {
  return companies.filter(company => {
    // Filtro por búsqueda (nombre, CIF)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const nombre = company.nombre.toLowerCase();
      const cif = company.cif.toLowerCase();
      if (!nombre.includes(search) && !cif.includes(search)) {
        return false;
      }
    }
    
    // Filtro por estado
    if (filters.estado && company.estado !== filters.estado) {
      return false;
    }
    
    // Filtro por sector
    if (filters.sector && company.sector !== filters.sector) {
      return false;
    }
    
    // Filtro por ciudad
    if (filters.ciudad && company.ciudad !== filters.ciudad) {
      return false;
    }
    
    return true;
  });
};

/**
 * Ordena empresas según campo y dirección
 */
export const sortCompanies = (companies, sortBy, sortOrder = 'asc') => {
  return [...companies].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'nombre':
        aValue = a.nombre.toLowerCase();
        bValue = b.nombre.toLowerCase();
        break;
      case 'cif':
        aValue = a.cif;
        bValue = b.cif;
        break;
      case 'ciudad':
        aValue = a.ciudad || '';
        bValue = b.ciudad || '';
        break;
      case 'numeroEmpleados':
        aValue = a.numeroEmpleados || 0;
        bValue = b.numeroEmpleados || 0;
        break;
      case 'fechaCreacion':
        aValue = new Date(a.fechaCreacion);
        bValue = new Date(b.fechaCreacion);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Calcula estadísticas de empresas
 */
export const calculateCompanyStats = (companies) => {
  const total = companies.length;
  const active = companies.filter(c => c.estado === 'activa').length;
  
  const totalEmployees = companies.reduce((sum, c) => sum + (c.numeroEmpleados || 0), 0);
  const avgEmployees = total > 0 ? Math.round(totalEmployees / total) : 0;
  
  const bySector = companies.reduce((acc, company) => {
    const sector = company.sector || 'Sin sector';
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {});
  
  return {
    total,
    active,
    totalEmployees,
    avgEmployees,
    bySector,
  };
};

/**
 * Valida CIF español
 */
export const isValidCIF = (cif) => {
  if (!cif) return false;
  const regex = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/;
  return regex.test(cif.toUpperCase());
};

/**
 * Formatea fecha de creación
 */
export const formatCreationDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
