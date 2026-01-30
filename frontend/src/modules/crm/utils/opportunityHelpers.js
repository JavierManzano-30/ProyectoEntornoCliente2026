import { OPPORTUNITY_STAGES } from '../constants/opportunityStages';

export const filterOpportunities = (opportunities, filters) => {
  return opportunities.filter((opportunity) => {
    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        opportunity.nombre?.toLowerCase().includes(searchLower) ||
        opportunity.descripcion?.toLowerCase().includes(searchLower) ||
        opportunity.cliente?.nombre?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filtro por fase
    if (filters.fase && opportunity.fase !== filters.fase) {
      return false;
    }

    // Filtro por cliente
    if (filters.clienteId && opportunity.clienteId !== filters.clienteId) {
      return false;
    }

    // Filtro por responsable
    if (filters.responsableId && opportunity.responsableId !== filters.responsableId) {
      return false;
    }

    // Filtro por prioridad
    if (filters.prioridad && opportunity.prioridad !== filters.prioridad) {
      return false;
    }

    return true;
  });
};

export const sortOpportunities = (opportunities, sortBy, sortOrder = 'asc') => {
  const sorted = [...opportunities].sort((a, b) => {
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

export const groupOpportunitiesByStage = (opportunities) => {
  const grouped = {};
  
  // Inicializar todas las fases
  Object.values(OPPORTUNITY_STAGES).forEach((stage) => {
    grouped[stage] = [];
  });

  // Agrupar oportunidades por fase
  opportunities.forEach((opportunity) => {
    const stage = opportunity.fase || OPPORTUNITY_STAGES.PROSPECTO;
    if (grouped[stage]) {
      grouped[stage].push(opportunity);
    }
  });

  return grouped;
};

export const calculateOpportunityStats = (opportunities) => {
  const stats = {
    total: opportunities.length,
    valorTotal: 0,
    valorPonderado: 0,
    porFase: {},
  };

  Object.values(OPPORTUNITY_STAGES).forEach((stage) => {
    stats.porFase[stage] = {
      cantidad: 0,
      valor: 0,
    };
  });

  opportunities.forEach((opp) => {
    stats.valorTotal += opp.valor || 0;
    stats.valorPonderado += (opp.valor || 0) * ((opp.probabilidad || 0) / 100);

    const stage = opp.fase || OPPORTUNITY_STAGES.PROSPECTO;
    if (stats.porFase[stage]) {
      stats.porFase[stage].cantidad++;
      stats.porFase[stage].valor += opp.valor || 0;
    }
  });

  return stats;
};

export const calculatePipelineValue = (opportunities) => {
  return opportunities.reduce((total, opp) => {
    // Solo contar oportunidades activas (no ganadas ni perdidas)
    if (opp.fase !== OPPORTUNITY_STAGES.GANADA && opp.fase !== OPPORTUNITY_STAGES.PERDIDA) {
      return total + (opp.valor || 0);
    }
    return total;
  }, 0);
};

export const calculateWeightedValue = (opportunities) => {
  return opportunities.reduce((total, opp) => {
    if (opp.fase !== OPPORTUNITY_STAGES.GANADA && opp.fase !== OPPORTUNITY_STAGES.PERDIDA) {
      return total + (opp.valor || 0) * ((opp.probabilidad || 0) / 100);
    }
    return total;
  }, 0);
};
