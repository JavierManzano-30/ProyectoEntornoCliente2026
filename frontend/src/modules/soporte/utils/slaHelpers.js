import { SLA_RESPONSE_TIMES, SLA_RESOLUTION_TIMES } from '../constants/slaLevels';

export const calculateSLAStatus = (ticket) => {
  const { prioridad, nivelSLA, fechaCreacion, fechaPrimeraRespuesta, fechaResolucion } = ticket;
  
  const responseTime = SLA_RESPONSE_TIMES[nivelSLA]?.[prioridad];
  const resolutionTime = SLA_RESOLUTION_TIMES[nivelSLA]?.[prioridad];
  
  const createdAt = new Date(fechaCreacion);
  const now = new Date();
  const hoursElapsed = (now - createdAt) / (1000 * 60 * 60);
  
  // Estado de tiempo de respuesta
  let responseStatus = 'ok';
  let responsePercentage = 0;
  
  if (!fechaPrimeraRespuesta && responseTime) {
    responsePercentage = (hoursElapsed / responseTime) * 100;
    if (hoursElapsed >= responseTime) {
      responseStatus = 'breached';
    } else if (hoursElapsed >= responseTime * 0.8) {
      responseStatus = 'warning';
    }
  }
  
  // Estado de tiempo de resolución
  let resolutionStatus = 'ok';
  let resolutionPercentage = 0;
  
  if (!fechaResolucion && resolutionTime) {
    resolutionPercentage = (hoursElapsed / resolutionTime) * 100;
    if (hoursElapsed >= resolutionTime) {
      resolutionStatus = 'breached';
    } else if (hoursElapsed >= resolutionTime * 0.8) {
      resolutionStatus = 'warning';
    }
  }
  
  return {
    response: {
      status: responseStatus,
      percentage: Math.min(responsePercentage, 100),
      deadline: responseTime,
      hoursElapsed,
    },
    resolution: {
      status: resolutionStatus,
      percentage: Math.min(resolutionPercentage, 100),
      deadline: resolutionTime,
      hoursElapsed,
    },
    overallStatus: resolutionStatus === 'breached' || responseStatus === 'breached' 
      ? 'breached' 
      : resolutionStatus === 'warning' || responseStatus === 'warning'
      ? 'warning'
      : 'ok',
  };
};

export const formatTimeRemaining = (hours) => {
  if (hours < 0) {
    const absHours = Math.abs(hours);
    if (absHours < 1) {
      return `Vencido hace ${Math.floor(absHours * 60)}m`;
    }
    if (absHours < 24) {
      return `Vencido hace ${Math.floor(absHours)}h`;
    }
    return `Vencido hace ${Math.floor(absHours / 24)}d`;
  }
  
  if (hours < 1) {
    return `${Math.floor(hours * 60)}m restantes`;
  }
  if (hours < 24) {
    return `${Math.floor(hours)}h restantes`;
  }
  return `${Math.floor(hours / 24)}d restantes`;
};

export const getSLAColorClass = (status) => {
  switch (status) {
    case 'breached':
      return 'sla-breached';
    case 'warning':
      return 'sla-warning';
    case 'ok':
      return 'sla-ok';
    default:
      return '';
  }
};

export const shouldEscalate = (ticket) => {
  const slaStatus = calculateSLAStatus(ticket);
  return slaStatus.overallStatus === 'breached';
};
