const supabase = require('../../../config/supabase');

async function listTickets(companyId) {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
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

module.exports = {
  listTickets,
  createTicket,
  addMessage,
  assignTicket,
  closeTicket,
  getTimeline
};
