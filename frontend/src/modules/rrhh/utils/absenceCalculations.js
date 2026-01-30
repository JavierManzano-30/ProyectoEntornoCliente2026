import { ABSENCE_TYPES, ABSENCE_TYPE_LABELS } from '../constants/absenceTypes';

/**
 * Calcula el número de días entre dos fechas
 */
export const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Incluye ambos días
};

/**
 * Calcula días laborables entre dos fechas (excluyendo fines de semana)
 */
export const calculateWorkDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Domingo, 6 = Sábado
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

/**
 * Verifica si dos períodos de ausencia se solapan
 */
export const doAbsencesOverlap = (absence1, absence2) => {
  const start1 = new Date(absence1.startDate);
  const end1 = new Date(absence1.endDate);
  const start2 = new Date(absence2.startDate);
  const end2 = new Date(absence2.endDate);
  
  return start1 <= end2 && start2 <= end1;
};

/**
 * Calcula el balance de días de ausencia
 */
export const calculateAbsenceBalance = (absences, allowedDays) => {
  if (!absences || !Array.isArray(absences)) {
    return {
      allowed: allowedDays || 0,
      used: 0,
      remaining: allowedDays || 0,
      percentage: 0,
    };
  }
  
  const approvedAbsences = absences.filter(a => a.status === 'approved');
  const usedDays = approvedAbsences.reduce((total, absence) => {
    return total + calculateWorkDays(absence.startDate, absence.endDate);
  }, 0);
  
  const allowed = allowedDays || 0;
  const remaining = Math.max(0, allowed - usedDays);
  const percentage = allowed > 0 ? Math.round((usedDays / allowed) * 100) : 0;
  
  return {
    allowed,
    used: usedDays,
    remaining,
    percentage,
  };
};

/**
 * Obtiene el color para un tipo de ausencia
 */
export const getAbsenceTypeColor = (type) => {
  const colors = {
    [ABSENCE_TYPES.VACATION]: '#3b82f6',
    [ABSENCE_TYPES.SICK_LEAVE]: '#ef4444',
    [ABSENCE_TYPES.PERSONAL]: '#f59e0b',
    [ABSENCE_TYPES.MATERNITY]: '#ec4899',
    [ABSENCE_TYPES.PATERNITY]: '#8b5cf6',
    [ABSENCE_TYPES.UNPAID]: '#6b7280',
    [ABSENCE_TYPES.TRAINING]: '#10b981',
    [ABSENCE_TYPES.OTHER]: '#64748b',
  };
  
  return colors[type] || '#64748b';
};

/**
 * Obtiene la etiqueta de un tipo de ausencia
 */
export const getAbsenceTypeLabel = (type) => {
  return ABSENCE_TYPE_LABELS[type] || type;
};

/**
 * Filtra ausencias según criterios
 */
export const filterAbsences = (absences, filters) => {
  if (!absences || !Array.isArray(absences)) return [];
  
  return absences.filter(absence => {
    // Filtro por empleado
    if (filters.employeeId && absence.employeeId !== filters.employeeId) {
      return false;
    }
    
    // Filtro por tipo
    if (filters.type && absence.type !== filters.type) {
      return false;
    }
    
    // Filtro por estado
    if (filters.status && absence.status !== filters.status) {
      return false;
    }
    
    // Filtro por rango de fechas
    if (filters.startDate) {
      const filterStart = new Date(filters.startDate);
      const absenceEnd = new Date(absence.endDate);
      if (absenceEnd < filterStart) {
        return false;
      }
    }
    
    if (filters.endDate) {
      const filterEnd = new Date(filters.endDate);
      const absenceStart = new Date(absence.startDate);
      if (absenceStart > filterEnd) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Agrupa ausencias por mes
 */
export const groupAbsencesByMonth = (absences) => {
  if (!absences || !Array.isArray(absences)) return {};
  
  const grouped = {};
  
  absences.forEach(absence => {
    const date = new Date(absence.startDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(absence);
  });
  
  return grouped;
};

/**
 * Convierte ausencias a eventos de calendario
 */
export const absencesToCalendarEvents = (absences) => {
  if (!absences || !Array.isArray(absences)) return [];
  
  return absences.map(absence => ({
    id: absence.id,
    title: `${getAbsenceTypeLabel(absence.type)} - ${absence.employeeName || ''}`,
    start: absence.startDate,
    end: absence.endDate,
    color: getAbsenceTypeColor(absence.type),
    extendedProps: {
      ...absence,
    },
  }));
};

/**
 * Valida datos de ausencia
 */
export const validateAbsenceData = (data) => {
  const errors = {};
  
  if (!data.employeeId) {
    errors.employeeId = 'Debe seleccionar un empleado';
  }
  
  if (!data.type) {
    errors.type = 'Debe seleccionar un tipo de ausencia';
  }
  
  if (!data.startDate) {
    errors.startDate = 'La fecha de inicio es obligatoria';
  }
  
  if (!data.endDate) {
    errors.endDate = 'La fecha de fin es obligatoria';
  }
  
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    
    if (end < start) {
      errors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Calcula estadísticas de ausencias
 */
export const calculateAbsenceStats = (absences) => {
  if (!absences || !Array.isArray(absences)) {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      totalDays: 0,
      byType: {},
    };
  }
  
  const stats = {
    total: absences.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalDays: 0,
    byType: {},
  };
  
  absences.forEach(absence => {
    // Por estado
    if (absence.status === 'pending') stats.pending++;
    if (absence.status === 'approved') stats.approved++;
    if (absence.status === 'rejected') stats.rejected++;
    
    // Días totales (solo aprobadas)
    if (absence.status === 'approved') {
      stats.totalDays += calculateWorkDays(absence.startDate, absence.endDate);
    }
    
    // Por tipo
    const typeLabel = getAbsenceTypeLabel(absence.type);
    stats.byType[typeLabel] = (stats.byType[typeLabel] || 0) + 1;
  });
  
  return stats;
};
