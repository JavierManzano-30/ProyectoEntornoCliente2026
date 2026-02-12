const supabase = require('../../../config/supabase');

async function listTickets(companyId) {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Mapear campos al formato esperado por el frontend
  const mappedData = (data || []).map(ticket => ({
    ...ticket,
    estado: mapStatusToEstado(ticket.status),
    titulo: ticket.title,
    descripcion: ticket.description,
    prioridad: ticket.priority,
    categoria: ticket.category,
    creadoEn: ticket.created_at,
    actualizadoEn: ticket.updated_at,
    asignadoA: ticket.assigned_to,
    creadorId: ticket.creator_id
  }));
  
  return mappedData;
}

// Helper para mapear status de BD (inglés) a estado (español)
function mapStatusToEstado(status) {
  const statusMap = {
    'open': 'nuevo',
    'in_progress': 'en_proceso',
    'resolved': 'resuelto',
    'closed': 'resuelto'
  };
  return statusMap[status] || 'nuevo';
}

// Helper para determinar si un ticket está asignado (tiene assigned_to)
function isTicketAssigned(ticket) {
  return ticket.assigned_to !== null && ticket.assigned_to !== undefined;
}

async function createTicket(companyId, userId, payload) {
  const { title, description, category, priority } = payload;
  const { data, error } = await supabase
    .from('support_tickets')
    .insert([
      {
        company_id: companyId,
        creator_id: userId,
        title,
        description,
        category,
        priority
      }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

async function addMessage(ticketId, userId, content, isInternal = false) {
  const { data, error } = await supabase
    .from('support_messages')
    .insert([
      {
        ticket_id: ticketId,
        user_id: userId,
        content,
        is_internal: isInternal
      }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

async function assignTicket(ticketId, assignedTo, userId) {
  const { data: updatedRows, error: updateError } = await supabase
    .from('support_tickets')
    .update({
      assigned_to: assignedTo,
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId)
    .select('id');

  if (updateError) throw updateError;
  if (!updatedRows?.length) return false;

  const { error: auditError } = await supabase.from('support_audit_log').insert([
    {
      ticket_id: ticketId,
      user_id: userId,
      action: 'ASSIGN',
      new_value: String(assignedTo)
    }
  ]);
  if (auditError) throw auditError;

  return true;
}

async function closeTicket(ticketId, userId) {
  const now = new Date().toISOString();
  const { data: updatedRows, error: updateError } = await supabase
    .from('support_tickets')
    .update({
      status: 'closed',
      closed_at: now,
      updated_at: now
    })
    .eq('id', ticketId)
    .select('id');

  if (updateError) throw updateError;
  if (!updatedRows?.length) return false;

  const { error: auditError } = await supabase.from('support_audit_log').insert([
    {
      ticket_id: ticketId,
      user_id: userId,
      action: 'CLOSE'
    }
  ]);
  if (auditError) throw auditError;

  return true;
}

async function updateTicketWorkflow(ticketId, actorUserId, companyId, updates = {}) {
  const { status, assignedTo } = updates;

  const { data: existing, error: existingError } = await supabase
    .from('support_tickets')
    .select('id, status, assigned_to, closed_at')
    .eq('id', ticketId)
    .eq('company_id', companyId)
    .single();

  if (existingError) {
    if (existingError.code === 'PGRST116') return null;
    throw existingError;
  }

  const payload = {
    updated_at: new Date().toISOString()
  };

  if (status) {
    payload.status = status;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'assignedTo')) {
    payload.assigned_to = assignedTo || null;
  }

  if (status === 'closed') {
    payload.closed_at = new Date().toISOString();
  } else if (status && existing.closed_at) {
    payload.closed_at = null;
  }

  const { data: updated, error: updateError } = await supabase
    .from('support_tickets')
    .update(payload)
    .eq('id', ticketId)
    .eq('company_id', companyId)
    .select('*')
    .single();

  if (updateError) throw updateError;

  const auditRows = [];

  if (status && status !== existing.status) {
    auditRows.push({
      ticket_id: ticketId,
      user_id: actorUserId,
      action: 'STATUS_CHANGE',
      old_value: existing.status,
      new_value: status
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(updates, 'assignedTo') &&
    (existing.assigned_to || null) !== (payload.assigned_to || null)
  ) {
    auditRows.push({
      ticket_id: ticketId,
      user_id: actorUserId,
      action: payload.assigned_to ? 'ASSIGN' : 'UNASSIGN',
      old_value: existing.assigned_to ? String(existing.assigned_to) : null,
      new_value: payload.assigned_to ? String(payload.assigned_to) : null
    });
  }

  if (auditRows.length) {
    const { error: auditError } = await supabase.from('support_audit_log').insert(auditRows);
    if (auditError) throw auditError;
  }

  return updated;
}

async function getTimeline(ticketId) {
  const [{ data: messageRows, error: messagesError }, { data: auditRows, error: auditError }] =
    await Promise.all([
      supabase
        .from('support_messages')
        .select('id, ticket_id, user_id, content, is_internal, created_at')
        .eq('ticket_id', ticketId),
      supabase
        .from('support_audit_log')
        .select('id, ticket_id, user_id, action, old_value, new_value, created_at')
        .eq('ticket_id', ticketId)
    ]);

  if (messagesError) throw messagesError;
  if (auditError) throw auditError;

  const messages = (messageRows || []).map((row) => ({
    id: row.id,
    ticketId: row.ticket_id,
    type: 'message',
    userId: row.user_id,
    content: row.content,
    isInternal: row.is_internal,
    createdAt: row.created_at
  }));

  const auditEvents = (auditRows || []).map((row) => ({
    id: row.id,
    ticketId: row.ticket_id,
    type: 'audit',
    userId: row.user_id,
    action: row.action,
    oldValue: row.old_value,
    newValue: row.new_value,
    createdAt: row.created_at
  }));

  const toTimestamp = (value) => new Date(value).getTime();
  return [...messages, ...auditEvents].sort((a, b) => toTimestamp(a.createdAt) - toTimestamp(b.createdAt));
}

async function getDashboardStats(companyId) {
  // Obtener todos los tickets de la empresa
  const { data: allTickets, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('company_id', companyId);

  if (error) {
    throw new Error('Error fetching dashboard stats: ' + error.message);
  }

  const tickets = allTickets || [];
  
  // Contar por estado
  const ticketsNuevos = tickets.filter(t => t.status === 'open').length;
  const ticketsAsignados = tickets.filter(t => t.status === 'open' && t.assigned_to !== null).length;
  const ticketsEnProgreso = tickets.filter(t => t.status === 'in_progress').length;
  const ticketsResueltos = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  
  // Stats adicionales
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ticketsResueltosHoy = tickets.filter(t => {
    if (!t.closed_at) return false;
    const closedDate = new Date(t.closed_at);
    closedDate.setHours(0, 0, 0, 0);
    return closedDate.getTime() === today.getTime();
  }).length;
  
  // SLA en riesgo (simplificado - tickets open más de 48 horas)
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const ticketsSLARiesgo = tickets.filter(t => {
    return t.status === 'open' && new Date(t.created_at) < twoDaysAgo;
  }).length;

  return {
    totalTickets: tickets.length,
    ticketsAbiertos: ticketsNuevos,
    ticketsAsignados: ticketsAsignados,
    ticketsEnProgreso: ticketsEnProgreso,
    ticketsCerrados: ticketsResueltos,
    ticketsResueltosHoy: ticketsResueltosHoy,
    ticketsSLARiesgo: ticketsSLARiesgo
  };
}

async function getStats(companyId) {
  // Stats por categoría
  const { data: byCategory, error: errorCategory } = await supabase
    .from('support_tickets')
    .select('category')
    .eq('company_id', companyId);

  // Stats por prioridad
  const { data: byPriority, error: errorPriority } = await supabase
    .from('support_tickets')
    .select('priority')
    .eq('company_id', companyId);

  if (errorCategory || errorPriority) {
    throw new Error('Error fetching stats');
  }

  // Agrupar por categoría
  const categoryCounts = (byCategory || []).reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {});

  // Agrupar por prioridad
  const priorityCounts = (byPriority || []).reduce((acc, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
    return acc;
  }, {});

  return {
    porCategoria: categoryCounts,
    porPrioridad: priorityCounts
  };
}

async function getNotifications(companyId) {
  // Retornar notificaciones básicas por ahora (pueden estar en una tabla separada)
  const { data, error } = await supabase
    .from('support_tickets')
    .select('id, title, status, priority, created_at')
    .eq('company_id', companyId)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('[Support Notifications] Error:', error);
    return [];
  }

  return (data || []).map(ticket => ({
    id: ticket.id,
    type: 'ticket',
    titulo: ticket.title,
    prioridad: ticket.priority,
    fecha: ticket.created_at,
    leido: false
  }));
}

async function getReports(companyId) {
  // Generar reportes básicos
  const stats = await getStats(companyId);
  const dashboardStats = await getDashboardStats(companyId);

  return {
    resumenGeneral: dashboardStats,
    estadisticas: stats,
    generadoEn: new Date().toISOString()
  };
}

async function getSLA(companyId) {
  // Configuración de SLA básica
  return {
    tiempoRespuesta: {
      bajo: 24, // horas
      medio: 8,
      alto: 4,
      urgente: 1
    },
    tiempoResolucion: {
      bajo: 120, // horas
      medio: 48,
      alto: 24,
      urgente: 8
    },
    cumplimiento: 85 // porcentaje
  };
}

module.exports = {
  listTickets,
  createTicket,
  addMessage,
  assignTicket,
  closeTicket,
  updateTicketWorkflow,
  getTimeline,
  getDashboardStats,
  getStats,
  getNotifications,
  getReports,
  getSLA
};
