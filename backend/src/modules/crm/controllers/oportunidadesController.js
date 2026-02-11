const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');

function mapOportunidad(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    clientId: row.client_id,
    pipelineId: row.pipeline_id,
    stageId: row.stage_id,
    title: row.title,
    description: row.description,
    estimatedValue: parseFloat(row.estimated_value || 0),
    currency: row.currency,
    probability: row.probability,
    expectedCloseDate: row.expected_close_date,
    responsibleId: row.responsible_id,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  if (!sort) return 'created_at DESC';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');
  const map = {
    title: 'title',
    estimatedValue: 'estimated_value',
    probability: 'probability',
    expectedCloseDate: 'expected_close_date',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'created_at DESC';
  return `${map[field]} ${direction}`;
}

async function listOportunidades(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    
    let query = supabase.from('crm_opportunities').select('*', { count: 'exact' });

    if (req.query.companyId) {
      query = query.eq('company_id', req.query.companyId);
    }
    if (req.query.pipelineId) {
      query = query.eq('pipeline_id', req.query.pipelineId);
    }
    if (req.query.stageId) {
      query = query.eq('stage_id', req.query.stageId);
    }
    if (req.query.responsibleId) {
      query = query.eq('responsible_id', req.query.responsibleId);
    }
    if (req.query.clientId) {
      query = query.eq('client_id', req.query.clientId);
    }

    const orderBy = parseSort(req.query.sort);
    const [field, direction] = orderBy.split(' ');
    query = query.order(field, { ascending: direction === 'ASC' });

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error al obtener oportunidades'));
    }

    const mappedData = data.map(mapOportunidad);
    const meta = buildPaginationMeta(page, limit, count || 0);

    return res.json(envelopeSuccess(mappedData, meta));
  } catch (err) {
    return next(err);
  }
}

async function getOportunidad(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('crm_opportunities')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Oportunidad no encontrada'));
    }

    return res.json(envelopeSuccess(mapOportunidad(data)));
  } catch (err) {
    return next(err);
  }
}

async function createOportunidad(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'clientId',
      'pipelineId',
      'stageId',
      'title'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_opportunities')
      .insert([{
        company_id: req.user.companyId,
        client_id: req.body.clientId,
        pipeline_id: req.body.pipelineId,
        stage_id: req.body.stageId,
        title: req.body.title,
        description: req.body.description || null,
        estimated_value: req.body.estimatedValue || 0,
        currency: req.body.currency || 'EUR',
        probability: req.body.probability || 0,
        expected_close_date: req.body.expectedCloseDate || null,
        responsible_id: req.body.responsibleId || null,
        sort_order: req.body.sortOrder || 0,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error al crear oportunidad'));
    }

    return res.status(201).json(envelopeSuccess(mapOportunidad(data)));
  } catch (err) {
    return next(err);
  }
}

async function updateOportunidad(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'clientId',
      'pipelineId',
      'stageId',
      'title'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_opportunities')
      .update({
        client_id: req.body.clientId,
        pipeline_id: req.body.pipelineId,
        stage_id: req.body.stageId,
        title: req.body.title,
        description: req.body.description || null,
        estimated_value: req.body.estimatedValue || 0,
        currency: req.body.currency || 'EUR',
        probability: req.body.probability || 0,
        expected_close_date: req.body.expectedCloseDate || null,
        responsible_id: req.body.responsibleId || null,
        sort_order: req.body.sortOrder || 0,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Oportunidad no encontrada'));
    }

    return res.json(envelopeSuccess(mapOportunidad(data)));
  } catch (err) {
    return next(err);
  }
}

async function deleteOportunidad(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('crm_opportunities')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Oportunidad no encontrada'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function updateStage(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['stageId']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_opportunities')
      .update({
        stage_id: req.body.stageId,
        sort_order: req.body.sortOrder || 0,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Oportunidad no encontrada'));
    }

    return res.json(envelopeSuccess(mapOportunidad(data)));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listOportunidades,
  getOportunidad,
  createOportunidad,
  updateOportunidad,
  deleteOportunidad,
  updateStage
};
