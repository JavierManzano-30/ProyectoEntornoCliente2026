const supabase = require('../../../config/supabase');
const { validateRequiredFields } = require('../../../utils/validation');
const { createServiceError } = require('./serviceError');

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

async function listPipelines(query) {
  let builder = supabase.from('crm_pipelines').select('*');

  if (query.companyId) builder = builder.eq('company_id', query.companyId);
  if (query.isActive !== undefined) builder = builder.eq('is_active', query.isActive === 'true');

  const { data, error } = await builder.order('created_at', { ascending: false });
  if (error) {
    throw createServiceError(500, 'INTERNAL_ERROR', 'Error fetching pipelines');
  }

  const pipelines = (data || []).map(mapPipeline);

  for (const pipeline of pipelines) {
    const { data: stages, error: stagesError } = await supabase
      .from('crm_stages')
      .select('*')
      .eq('pipeline_id', pipeline.id)
      .order('sort_order', { ascending: true });

    pipeline.stages = stagesError ? [] : (stages || []).map(mapStage);
  }

  return pipelines;
}

async function getPipeline(id) {
  const { data, error } = await supabase
    .from('crm_pipelines')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Pipeline not found');
  }

  const pipeline = mapPipeline(data);
  const { data: stages, error: stagesError } = await supabase
    .from('crm_stages')
    .select('*')
    .eq('pipeline_id', id)
    .order('sort_order', { ascending: true });

  pipeline.stages = stagesError ? [] : (stages || []).map(mapStage);
  return pipeline;
}

function validatePipelineBody(body) {
  const requiredErrors = validateRequiredFields(body, ['name']);
  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', requiredErrors);
  }
}

async function createPipeline(companyId, body) {
  validatePipelineBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_pipelines')
    .insert([{
      company_id: companyId,
      name: body.name,
      description: body.description || null,
      is_active: body.isActive !== undefined ? body.isActive : true,
      created_at: now,
      updated_at: now
    }])
    .select()
    .single();

  if (error) {
    throw createServiceError(500, 'INTERNAL_ERROR', 'Error creating pipeline');
  }

  const pipeline = mapPipeline(data);
  pipeline.stages = [];
  return pipeline;
}

async function updatePipeline(id, body) {
  validatePipelineBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_pipelines')
    .update({
      name: body.name,
      description: body.description || null,
      is_active: body.isActive !== undefined ? body.isActive : true,
      updated_at: now
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Pipeline not found');
  }
  return mapPipeline(data);
}

async function deletePipeline(id) {
  const { data, error } = await supabase
    .from('crm_pipelines')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Pipeline not found');
  }
}

function validateStageBody(body, requiredFields = ['pipelineId', 'name', 'sortOrder']) {
  const requiredErrors = validateRequiredFields(body, requiredFields);
  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', requiredErrors);
  }
}

async function createStage(companyId, body) {
  validateStageBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_stages')
    .insert([{
      company_id: companyId,
      pipeline_id: body.pipelineId,
      name: body.name,
      sort_order: body.sortOrder,
      default_probability: body.defaultProbability || 0,
      created_at: now,
      updated_at: now
    }])
    .select()
    .single();

  if (error) {
    throw createServiceError(500, 'INTERNAL_ERROR', 'Error creating stage');
  }
  return mapStage(data);
}

async function updateStage(id, body) {
  validateStageBody(body, ['name', 'sortOrder']);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_stages')
    .update({
      name: body.name,
      sort_order: body.sortOrder,
      default_probability: body.defaultProbability || 0,
      updated_at: now
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Stage not found');
  }
  return mapStage(data);
}

async function deleteStage(id) {
  const { data, error } = await supabase
    .from('crm_stages')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Stage not found');
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
