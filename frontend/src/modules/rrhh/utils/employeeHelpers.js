import { EMPLOYEE_STATUS, EMPLOYEE_STATUS_LABELS } from '../constants/employeeStatus';

/**
 * Formatea el nombre completo de un empleado
 */
export const getFullName = (employee) => {
  if (!employee) return '';
  const { firstName, lastName } = employee;
  return `${firstName || ''} ${lastName || ''}`.trim();
};

/**
 * Obtiene las iniciales de un empleado
 */
export const getInitials = (employee) => {
  if (!employee) return '';
  const { firstName, lastName } = employee;
  const firstInitial = firstName?.charAt(0) || '';
  const lastInitial = lastName?.charAt(0) || '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

/**
 * Verifica si un empleado está activo
 */
export const isActiveEmployee = (employee) => {
  return employee?.status === EMPLOYEE_STATUS.ACTIVE;
};

/**
 * Obtiene la antigüedad de un empleado en años
 */
export const getYearsOfService = (hireDate) => {
  if (!hireDate) return 0;
  const today = new Date();
  const hire = new Date(hireDate);
  const years = today.getFullYear() - hire.getFullYear();
  const monthDiff = today.getMonth() - hire.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hire.getDate())) {
    return years - 1;
  }
  return years;
};

/**
 * Formatea el salario con el símbolo de moneda
 */
export const formatSalary = (amount, currency = 'EUR') => {
  if (!amount && amount !== 0) return '-';
  
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

/**
 * Obtiene el texto del estado del empleado
 */
export const getStatusLabel = (status) => {
  return EMPLOYEE_STATUS_LABELS[status] || status;
};

/**
 * Filtra empleados según criterios de búsqueda
 */
export const filterEmployees = (employees, filters) => {
  if (!employees || !Array.isArray(employees)) return [];
  
  return employees.filter(employee => {
    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const fullName = getFullName(employee).toLowerCase();
      const email = (employee.email || '').toLowerCase();
      const employeeNumber = (employee.employeeNumber || '').toLowerCase();
      
      if (!fullName.includes(searchLower) && 
          !email.includes(searchLower) && 
          !employeeNumber.includes(searchLower)) {
        return false;
      }
    }
    
    // Filtro por departamento (acepta id o nombre para alinearse con los selects)
    if (
      filters.department &&
      employee.departmentId !== filters.department &&
      employee.departmentName !== filters.department
    ) {
      return false;
    }
    
    // Filtro por estado
    if (filters.status && employee.status !== filters.status) {
      return false;
    }
    
    // Filtro por puesto
    if (filters.position) {
      const positionLower = filters.position.toLowerCase();
      const employeePosition = (employee.position || '').toLowerCase();
      if (!employeePosition.includes(positionLower)) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Ordena empleados según un criterio
 */
export const sortEmployees = (employees, sortBy, sortOrder = 'asc') => {
  if (!employees || !Array.isArray(employees)) return [];
  
  return [...employees].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'name':
        valueA = getFullName(a).toLowerCase();
        valueB = getFullName(b).toLowerCase();
        break;
      case 'hireDate':
        valueA = new Date(a.hireDate || 0);
        valueB = new Date(b.hireDate || 0);
        break;
      case 'salary':
        valueA = a.salary || 0;
        valueB = b.salary || 0;
        break;
      case 'department':
        valueA = (a.departmentName || '').toLowerCase();
        valueB = (b.departmentName || '').toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Calcula estadísticas de empleados
 */
export const calculateEmployeeStats = (employees) => {
  if (!employees || !Array.isArray(employees)) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0,
      averageSalary: 0,
      byDepartment: {},
    };
  }
  
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const stats = {
    total: employees.length,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
    totalSalary: 0,
    byDepartment: {},
  };
  
  employees.forEach(employee => {
    // Estado
    if (employee.status === EMPLOYEE_STATUS.ACTIVE) {
      stats.active++;
    } else {
      stats.inactive++;
    }
    
    // Nuevos del mes
    const hireDate = new Date(employee.hireDate);
    if (hireDate >= thisMonthStart) {
      stats.newThisMonth++;
    }
    
    // Salario
    if (employee.salary) {
      stats.totalSalary += employee.salary;
    }
    
    // Por departamento
    const dept = employee.departmentName || 'Sin departamento';
    stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
  });
  
  stats.averageSalary = stats.total > 0 ? stats.totalSalary / stats.total : 0;
  
  return stats;
};

/**
 * Valida datos de empleado
 */
export const validateEmployeeData = (data) => {
  const errors = {};
  
  if (!data.firstName || data.firstName.trim() === '') {
    errors.firstName = 'El nombre es obligatorio';
  }
  
  if (!data.lastName || data.lastName.trim() === '') {
    errors.lastName = 'Los apellidos son obligatorios';
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'El email no es válido';
  }
  
  if (!data.employeeNumber || data.employeeNumber.trim() === '') {
    errors.employeeNumber = 'El número de empleado es obligatorio';
  }
  
  if (!data.hireDate) {
    errors.hireDate = 'La fecha de incorporación es obligatoria';
  }
  
  if (!data.position || data.position.trim() === '') {
    errors.position = 'El puesto es obligatorio';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
