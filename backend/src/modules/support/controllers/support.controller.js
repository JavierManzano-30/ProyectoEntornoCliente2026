const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const supportService = require('../services/support.service');

// Regex más permisiva para UUIDs (acepta también UUIDs dummy para testing)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

function getAuthContext(req) {
  return {
    userId: req.user?.userId || req.user?.id || null,
    companyId: req.user?.companyId || req.user?.company_id || null
  };
}

function requireAuthContext(req, res) {
  const { userId, companyId } = getAuthContext(req);
  if (!userId || !companyId) {
    res.status(403).json(envelopeError('FORBIDDEN', 'Authenticated user context is incomplete'));
    return null;
  }

  const invalidFields = [];
  if (!isUuid(userId)) invalidFields.push({ field: 'userId', message: 'Must be a valid UUID' });
  if (!isUuid(companyId)) invalidFields.push({ field: 'companyId', message: 'Must be a valid UUID' });

  if (invalidFields.length) {
    res
      .status(400)
      .json(envelopeError('VALIDATION_ERROR', 'Invalid token payload context', invalidFields));
    return null;
  }

  return { userId, companyId };
}

function requireTicketId(req, res) {
  const ticketId = req.params.id;
  if (!isUuid(ticketId)) {
    res.status(400).json(
      envelopeError('VALIDATION_ERROR', 'Invalid ticket id', [
        { field: 'id', message: 'Must be a valid UUID' }
      ])
    );
    return null;
  }
  return ticketId;
}

async function getTickets(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const data = await supportService.listTickets(auth.companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function createTicket(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;

    const required = ['title', 'description', 'category', 'priority'];
    const missing = required.filter((field) => !req.body?.[field]);
    if (missing.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Missing required fields', missing.map((field) => ({ field }))));
    }

    const data = await supportService.createTicket(auth.companyId, auth.userId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function addMessage(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const ticketId = requireTicketId(req, res);
    if (!ticketId) return;

    if (!req.body?.content) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Missing required fields', [{ field: 'content' }]));
    }

    const data = await supportService.addMessage(
      ticketId,
      auth.userId,
      req.body.content,
      Boolean(req.body.isInternal)
    );
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function assignTicket(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const ticketId = requireTicketId(req, res);
    if (!ticketId) return;

    if (!req.body?.assignedTo) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Missing required fields', [{ field: 'assignedTo' }]));
    }

    const ok = await supportService.assignTicket(ticketId, req.body.assignedTo, auth.userId);
    if (!ok) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Ticket not found'));
    }

    return res.json(envelopeSuccess({ id: ticketId, assignedTo: req.body.assignedTo }));
  } catch (err) {
    return next(err);
  }
}

async function closeTicket(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const ticketId = requireTicketId(req, res);
    if (!ticketId) return;

    const ok = await supportService.closeTicket(ticketId, auth.userId);
    if (!ok) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Ticket not found'));
    }

    return res.json(envelopeSuccess({ id: ticketId, status: 'closed' }));
  } catch (err) {
    return next(err);
  }
}

async function getTimeline(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const ticketId = requireTicketId(req, res);
    if (!ticketId) return;

    const data = await supportService.getTimeline(ticketId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function getDashboard(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;

    const data = await supportService.getDashboardStats(auth.companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;

    const data = await supportService.getStats(auth.companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    // Categorías predefinidas del sistema
    const categories = [
      { id: 'technical', nombre: 'Técnico', descripcion: 'Problemas técnicos y bugs' },
      { id: 'billing', nombre: 'Facturación', descripcion: 'Consultas sobre facturación y pagos' },
      { id: 'other', nombre: 'Otro', descripcion: 'Otras consultas generales' }
    ];
    return res.json(envelopeSuccess(categories));
  } catch (err) {
    return next(err);
  }
}

async function getPriorities(req, res, next) {
  try {
    // Prioridades predefinidas del sistema
    const priorities = [
      { id: 'low', nombre: 'Baja', color: '#10b981', orden: 1 },
      { id: 'medium', nombre: 'Media', color: '#f59e0b', orden: 2 },
      { id: 'high', nombre: 'Alta', color: '#ef4444', orden: 3 },
      { id: 'urgent', nombre: 'Urgente', color: '#dc2626', orden: 4 }
    ];
    return res.json(envelopeSuccess(priorities));
  } catch (err) {
    return next(err);
  }
}

async function getNotifications(req, res, next) {
  try {
    const context = requireAuthContext(req, res);
    if (!context) return;

    const { companyId } = context;
    const notifications = await supportService.getNotifications(companyId);
    return res.json(envelopeSuccess(notifications));
  } catch (err) {
    console.error('[Support Notifications] Error:', err);
    return next(err);
  }
}

async function getReports(req, res, next) {
  try {
    const context = requireAuthContext(req, res);
    if (!context) return;

    const { companyId } = context;
    const reports = await supportService.getReports(companyId);
    return res.json(envelopeSuccess(reports));
  } catch (err) {
    console.error('[Support Reports] Error:', err);
    return next(err);
  }
}

async function getSLA(req, res, next) {
  try {
    const context = requireAuthContext(req, res);
    if (!context) return;

    const { companyId } = context;
    const sla = await supportService.getSLA(companyId);
    return res.json(envelopeSuccess(sla));
  } catch (err) {
    console.error('[Support SLA] Error:', err);
    return next(err);
  }
}

module.exports = {
  getTickets,
  createTicket,
  addMessage,
  assignTicket,
  closeTicket,
  getTimeline,
  getDashboard,
  getStats,
  getCategories,
  getPriorities,
  getNotifications,
  getReports,
  getSLA
};
