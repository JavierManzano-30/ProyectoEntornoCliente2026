const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { validateRequiredFields } = require('../../../utils/validation');

function mapPipeline(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapStage(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    pipelineId: row.pipeline_id,
    name: row.name,
    sortOrder: row.sort_order,
    defaultProbability: row.default_probability,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listPipelines(req, res, next) {
  try {
    let query = supabase.from('crm_pipelines').select('*');

    if (req.query.companyId) {
      query = query.eq('company_id', req.query.companyId);
    }
    if (req.query.isActive !== undefined) {
      query = query.eq('is_active', req.query.isActive === 'true');
    }

    query = query.order('created_at', { ascending: false });

    const { data: pipelines, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error al obtener pipelines'));
    }

    const mappedPipelines = pipelines.map(mapPipeline);

    // Obtener stages para cada pipeline
    for (const pipeline of mappedPipelines) {
      const { data: stages, error: stagesError } = await supabase
        .from('crm_stages')
        .select('*')
        .eq('pipeline_id', pipeline.id)
        .order('sort_order', { ascending: true });

      if (!stagesError) {
        pipeline.stages = stages.map(mapStage);
      } else {
        pipeline.stages = [];
      }
    }

    return res.json(envelopeSuccess(mappedPipelines));
  } catch (err) {
    return next(err);
  }
}

async function getPipeline(req, res, next) {
  try {
    const { id } = req.params;

    const { data: pipelineData, error } = await supabase
      .from('crm_pipelines')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !pipelineData) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Pipeline no encontrado'));
    }

    const pipeline = mapPipeline(pipelineData);

    // Obtener stages
    const { data: stages, error: stagesError } = await supabase
      .from('crm_stages')
      .select('*')
      .eq('pipeline_id', id)
      .order('sort_order', { ascending: true });

    if (!stagesError) {
      pipeline.stages = stages.map(mapStage);
    } else {
      pipeline.stages = [];
    }

    return res.json(envelopeSuccess(pipeline));
  } catch (err) {
    return next(err);
  }
}

async function createPipeline(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['name']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_pipelines')
      .insert([{
        company_id: req.user.companyId,
        name: req.body.name,
        description: req.body.description || null,
        is_active: req.body.isActive !== undefined ? req.body.isActive : true,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error al crear pipeline'));
    }

    const pipeline = mapPipeline(data);
    pipeline.stages = [];

    return res.status(201).json(envelopeSuccess(pipeline));
  } catch (err) {
    return next(err);
  }
}

async function updatePipeline(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['name']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_pipelines')
      .update({
        name: req.body.name,
        description: req.body.description || null,
        is_active: req.body.isActive !== undefined ? req.body.isActive : true,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Pipeline no encontrado'));
    }

    return res.json(envelopeSuccess(mapPipeline(data)));
  } catch (err) {
    return next(err);
  }
}

async function deletePipeline(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('crm_pipelines')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Pipeline no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function createStage(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['pipelineId', 'name', 'sortOrder']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_stages')
      .insert([{
        company_id: req.user.companyId,
        pipeline_id: req.body.pipelineId,
        name: req.body.name,
        sort_order: req.body.sortOrder,
        default_probability: req.body.defaultProbability || 0,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error al crear stage'));
    }

    return res.status(201).json(envelopeSuccess(mapStage(data)));
  } catch (err) {
    return next(err);
  }
}

async function updateStage(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['name', 'sortOrder']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_stages')
      .update({
        name: req.body.name,
        sort_order: req.body.sortOrder,
        default_probability: req.body.defaultProbability || 0,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Stage not found'));
    }

    return res.json(envelopeSuccess(mapStage(data)));
  } catch (err) {
    return next(err);
  }
}

async function deleteStage(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('crm_stages')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Stage not found'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listPipelines,
  getPipeline,
  createPipeline,
  updatePipeline,
  deletePipeline,
  createStage,
  updateStage,
  deleteStage
};
