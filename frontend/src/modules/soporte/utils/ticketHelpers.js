import { TICKET_STATUS_LABELS, TICKET_STATUS_COLORS } from '../constants/ticketStatuses';
import { TICKET_PRIORITY_LABELS, TICKET_PRIORITY_COLORS } from '../constants/ticketPriorities';
import { TICKET_CATEGORY_LABELS, TICKET_CATEGORY_COLORS } from '../constants/ticketCategories';

export const getStatusLabel = (status) => {
  return TICKET_STATUS_LABELS[status] || status;
};

export const getStatusColor = (status) => {
  return TICKET_STATUS_COLORS[status] || 'default';
};

export const getPriorityLabel = (priority) => {
  return TICKET_PRIORITY_LABELS[priority] || priority;
};

export const getPriorityColor = (priority) => {
  return TICKET_PRIORITY_COLORS[priority] || 'default';
};

export const getCategoryLabel = (category) => {
  return TICKET_CATEGORY_LABELS[category] || category;
};

export const getCategoryColor = (category) => {
  return TICKET_CATEGORY_COLORS[category] || 'default';
};

export const formatTicketId = (id) => {
  return `#${String(id).padStart(6, '0')}`;
};

export const calculateTicketAge = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

export const filterTickets = (tickets, filters) => {
  return tickets.filter((ticket) => {
    if (filters.estado && ticket.estado !== filters.estado) return false;
    if (filters.prioridad && ticket.prioridad !== filters.prioridad) return false;
    if (filters.categoria && ticket.categoria !== filters.categoria) return false;
    if (filters.asignadoA && ticket.asignadoA !== filters.asignadoA) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        ticket.titulo?.toLowerCase().includes(searchLower) ||
        ticket.descripcion?.toLowerCase().includes(searchLower) ||
        String(ticket.id).includes(searchLower);
      if (!matchesSearch) return false;
    }
    return true;
  });
};

export const sortTickets = (tickets, sortBy, sortOrder = 'asc') => {
  const sorted = [...tickets].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Manejar fechas
    if (sortBy === 'fechaCreacion' || sortBy === 'fechaActualizacion') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

export const groupTicketsByStatus = (tickets) => {
  return tickets.reduce((acc, ticket) => {
    const status = ticket.estado;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(ticket);
    return acc;
  }, {});
};

export const calculateTicketStats = (tickets) => {
  const total = tickets.length;
  const byStatus = groupTicketsByStatus(tickets);
  
  const pendiente = byStatus.pendiente?.length || 0;
  const enProgreso = byStatus.en_progreso?.length || 0;
  const resuelto = byStatus.resuelto?.length || 0;
  const cerrado = byStatus.cerrado?.length || 0;
  
  const criticos = tickets.filter(t => t.prioridad === 'critica').length;
  const sinAsignar = tickets.filter(t => !t.asignadoA).length;
  
  return {
    total,
    pendiente,
    enProgreso,
    resuelto,
    cerrado,
    criticos,
    sinAsignar,
    byStatus,
  };
};
