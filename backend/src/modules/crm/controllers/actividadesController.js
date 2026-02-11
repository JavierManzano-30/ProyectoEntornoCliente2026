const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');

const ACTIVIDAD_TIPOS = ['call', 'email', 'meeting', 'note'];

function mapActividad(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    userId: row.user_id,
    clientId: row.client_id,
    opportunityId: row.opportunity_id,
    type: row.type,
    subject: row.subject,
    description: row.description,
    activityAt: row.activity_at,
    dueDate: row.due_date,
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  if (!sort) return 'activity_at DESC';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');
  const map = {
    activityAt: 'activity_at',
    dueDate: 'due_date',
    type: 'type',
    completed: 'completed',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'activity_at DESC';
  return `${map[field]} ${direction}`;
}

async function listActividades(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    
    let query = supabase.from('crm_activities').select('*', { count: 'exact' });

    if (req.query.companyId) {
      query = query.eq('company_id', req.query.companyId);
    }
    if (req.query.userId) {
      query = query.eq('user_id', req.query.userId);
    }
    if (req.query.clientId) {
      query = query.eq('client_id', req.query.clientId);
    }
    if (req.query.opportunityId) {
      query = query.eq('opportunity_id', req.query.opportunityId);
    }
    if (req.query.type) {
      query = query.eq('type', req.query.type);
    }
    if (req.query.estado === 'pendiente') {
      query = query.eq('completed', false);
    } else if (req.query.estado === 'completada') {
      query = query.eq('completed', true);
    }
    if (req.query.entidadTipo && req.query.entidadId) {
      if (req.query.entidadTipo === 'cliente') {
        query = query.eq('client_id', req.query.entidadId);
      } else if (req.query.entidadTipo === 'oportunidad') {
        query = query.eq('opportunity_id', req.query.entidadId);
      }
    }

    const orderBy = parseSort(req.query.sort);
    const [field, direction] = orderBy.split(' ');
    query = query.order(field, { ascending: direction === 'ASC' });

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error al obtener actividades'));
    }

    const mappedData = data.map(mapActividad);
    const meta = buildPaginationMeta(page, limit, count || 0);

    return res.json(envelopeSuccess(mappedData, meta));
  } catch (err) {
    return next(err);
  }
}

async function getActividad(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('crm_activities')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }

    return res.json(envelopeSuccess(mapActividad(data)));
  } catch (err) {
    return next(err);
  }
}

async function createActividad(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['userId', 'type', 'subject', 'activityAt']);
    const tipoError = validateEnum(req.body.type, ACTIVIDAD_TIPOS);
    if (tipoError) requiredErrors.push({ field: 'type', message: tipoError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_activities')
      .insert([{
        company_id: req.user.companyId,
        user_id: req.body.userId,
        client_id: req.body.clientId || null,
        opportunity_id: req.body.opportunityId || null,
        type: req.body.type,
        subject: req.body.subject,
        description: req.body.description || null,
        activity_at: req.body.activityAt,
        due_date: req.body.dueDate || null,
        completed: req.body.completed || false,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error al crear actividad'));
    }

    return res.status(201).json(envelopeSuccess(mapActividad(data)));
  } catch (err) {
    return next(err);
  }
}

async function updateActividad(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['userId', 'type', 'subject', 'activityAt']);
    const typeError = validateEnum(req.body.type, ACTIVIDAD_TIPOS);
    if (typeError) requiredErrors.push({ field: 'type', message: typeError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_activities')
      .update({
        user_id: req.body.userId,
        client_id: req.body.clientId || null,
        opportunity_id: req.body.opportunityId || null,
        type: req.body.type,
        subject: req.body.subject,
        description: req.body.description || null,
        activity_at: req.body.activityAt,
        due_date: req.body.dueDate || null,
        completed: req.body.completed || false,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }

    return res.json(envelopeSuccess(mapActividad(data)));
  } catch (err) {
    return next(err);
  }
}

async function deleteActividad(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('crm_activities')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function marcarCompletada(req, res, next) {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_activities')
      .update({
        completed: true,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }

    return res.json(envelopeSuccess(mapActividad(data)));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listActividades,
  getActividad,
  createActividad,
  updateActividad,
  deleteActividad,
  marcarCompletada
};
