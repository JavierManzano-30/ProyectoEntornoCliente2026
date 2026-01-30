/**
 * Formatea un monto en formato moneda
 */
export const formatCurrency = (amount, currency = 'EUR') => {
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
 * Formatea el período de una nómina
 */
export const formatPayrollPeriod = (payroll) => {
  if (!payroll || !payroll.month || !payroll.year) return '-';
  
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const monthIndex = parseInt(payroll.month) - 1;
  const monthName = monthNames[monthIndex] || '';
  
  return `${monthName} ${payroll.year}`;
};

/**
 * Calcula el neto de una nómina
 */
export const calculateNetAmount = (payroll) => {
  if (!payroll) return 0;
  
  const gross = payroll.grossAmount || 0;
  const deductions = payroll.deductions || 0;
  
  return gross - deductions;
};

/**
 * Calcula el porcentaje de deducción
 */
export const calculateDeductionPercentage = (payroll) => {
  if (!payroll || !payroll.grossAmount) return 0;
  
  const gross = payroll.grossAmount;
  const deductions = payroll.deductions || 0;
  
  return gross > 0 ? Math.round((deductions / gross) * 100) : 0;
};

/**
 * Filtra nóminas según criterios
 */
export const filterPayrolls = (payrolls, filters) => {
  if (!payrolls || !Array.isArray(payrolls)) return [];
  
  return payrolls.filter(payroll => {
    // Filtro por empleado
    if (filters.employeeId && payroll.employeeId !== filters.employeeId) {
      return false;
    }
    
    // Filtro por año
    if (filters.year && payroll.year !== parseInt(filters.year)) {
      return false;
    }
    
    // Filtro por mes
    if (filters.month && payroll.month !== parseInt(filters.month)) {
      return false;
    }
    
    // Filtro por búsqueda de empleado
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const employeeName = (payroll.employeeName || '').toLowerCase();
      const employeeNumber = (payroll.employeeNumber || '').toLowerCase();
      
      if (!employeeName.includes(searchLower) && !employeeNumber.includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Ordena nóminas por fecha (más recientes primero)
 */
export const sortPayrollsByDate = (payrolls, order = 'desc') => {
  if (!payrolls || !Array.isArray(payrolls)) return [];
  
  return [...payrolls].sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1);
    const dateB = new Date(b.year, b.month - 1);
    
    if (order === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });
};

/**
 * Agrupa nóminas por año
 */
export const groupPayrollsByYear = (payrolls) => {
  if (!payrolls || !Array.isArray(payrolls)) return {};
  
  const grouped = {};
  
  payrolls.forEach(payroll => {
    const year = payroll.year;
    
    if (!grouped[year]) {
      grouped[year] = [];
    }
    
    grouped[year].push(payroll);
  });
  
  // Ordenar cada grupo por mes
  Object.keys(grouped).forEach(year => {
    grouped[year].sort((a, b) => b.month - a.month);
  });
  
  return grouped;
};

/**
 * Calcula estadísticas de nóminas
 */
export const calculatePayrollStats = (payrolls) => {
  if (!payrolls || !Array.isArray(payrolls)) {
    return {
      total: 0,
      totalGross: 0,
      totalNet: 0,
      totalDeductions: 0,
      averageGross: 0,
      averageNet: 0,
      averageDeductions: 0,
      byYear: {},
    };
  }
  
  const stats = {
    total: payrolls.length,
    totalGross: 0,
    totalNet: 0,
    totalDeductions: 0,
    byYear: {},
  };
  
  payrolls.forEach(payroll => {
    const gross = payroll.grossAmount || 0;
    const deductions = payroll.deductions || 0;
    const net = calculateNetAmount(payroll);
    
    stats.totalGross += gross;
    stats.totalNet += net;
    stats.totalDeductions += deductions;
    
    // Por año
    const year = payroll.year;
    if (!stats.byYear[year]) {
      stats.byYear[year] = {
        count: 0,
        totalGross: 0,
        totalNet: 0,
      };
    }
    
    stats.byYear[year].count++;
    stats.byYear[year].totalGross += gross;
    stats.byYear[year].totalNet += net;
  });
  
  stats.averageGross = stats.total > 0 ? stats.totalGross / stats.total : 0;
  stats.averageNet = stats.total > 0 ? stats.totalNet / stats.total : 0;
  stats.averageDeductions = stats.total > 0 ? stats.totalDeductions / stats.total : 0;
  
  return stats;
};

/**
 * Genera el nombre del archivo PDF de una nómina
 */
export const generatePayrollFilename = (payroll) => {
  if (!payroll) return 'nomina.pdf';
  
  const period = formatPayrollPeriod(payroll).replace(/\s+/g, '_');
  const employeeName = (payroll.employeeName || 'empleado').replace(/\s+/g, '_');
  
  return `nomina_${employeeName}_${period}.pdf`;
};

/**
 * Valida el período de una nómina
 */
export const validatePayrollPeriod = (month, year) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  if (!month || month < 1 || month > 12) {
    return {
      isValid: false,
      error: 'El mes debe estar entre 1 y 12',
    };
  }
  
  if (!year || year < 2000 || year > currentYear + 1) {
    return {
      isValid: false,
      error: `El año debe estar entre 2000 y ${currentYear + 1}`,
    };
  }
  
  if (year === currentYear && month > currentMonth) {
    return {
      isValid: false,
      error: 'No se pueden crear nóminas de meses futuros',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
};

/**
 * Obtiene los años disponibles para filtrar
 */
export const getAvailableYears = (payrolls) => {
  if (!payrolls || !Array.isArray(payrolls)) return [];
  
  const years = new Set(payrolls.map(p => p.year));
  return Array.from(years).sort((a, b) => b - a);
};

/**
 * Obtiene el mes y año actual
 */
export const getCurrentPeriod = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
};
