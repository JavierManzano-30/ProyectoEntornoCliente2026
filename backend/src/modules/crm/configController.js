const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { validateRequiredFields } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

function mapPipeline(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    activo: row.activo,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapFase(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    pipelineId: row.pipeline_id,
    nombre: row.nombre,
    orden: row.orden,
    probabilidadDefecto: row.probabilidad_defecto,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listPipelines(req, res, next) {
  try {
    const filters = [];
    const values = [];

    if (req.query.empresaId) {
      values.push(req.query.empresaId);
      filters.push(`empresa_id = $${values.length}`);
    }
    if (req.query.activo !== undefined) {
      values.push(req.query.activo === 'true');
      filters.push(`activo = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const pipelinesQuery = `
      SELECT * FROM crm_pipelines
      ${whereClause}
      ORDER BY created_at DESC
    `;
    const pipelinesResult = await pool.query(pipelinesQuery, values);
    const pipelines = pipelinesResult.rows.map(mapPipeline);

    // Obtener fases para cada pipeline
    for (const pipeline of pipelines) {
      const fasesResult = await pool.query(
        'SELECT * FROM crm_fases WHERE pipeline_id = $1 ORDER BY orden ASC',
        [pipeline.id]
      );
      pipeline.fases = fasesResult.rows.map(mapFase);
    }

    return res.json(envelopeSuccess(pipelines));
  } catch (err) {
    return next(err);
  }
}

async function getPipeline(req, res, next) {
  try {
    const { id } = req.params;

    const pipelineResult = await pool.query('SELECT * FROM crm_pipelines WHERE id = $1', [id]);
    if (!pipelineResult.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Pipeline no encontrado'));
    }

    const pipeline = mapPipeline(pipelineResult.rows[0]);

    // Obtener fases
    const fasesResult = await pool.query(
      'SELECT * FROM crm_fases WHERE pipeline_id = $1 ORDER BY orden ASC',
      [id]
    );
    pipeline.fases = fasesResult.rows.map(mapFase);

    return res.json(envelopeSuccess(pipeline));
  } catch (err) {
    return next(err);
  }
}

async function createPipeline(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['nombre']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('pipe');
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO crm_pipelines
        (id, empresa_id, nombre, descripcion, activo, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      id,
      req.body.empresaId || null,
      req.body.nombre,
      req.body.descripcion || null,
      req.body.activo !== undefined ? req.body.activo : true,
      now,
      now
    ]);

    const pipeline = mapPipeline(result.rows[0]);
    pipeline.fases = [];

    return res.status(201).json(envelopeSuccess(pipeline));
  } catch (err) {
    return next(err);
  }
}

async function updatePipeline(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['nombre']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const updateQuery = `
      UPDATE crm_pipelines
      SET nombre = $1,
          descripcion = $2,
          activo = $3,
          updated_at = $4
      WHERE id = $5
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.nombre,
      req.body.descripcion || null,
      req.body.activo !== undefined ? req.body.activo : true,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Pipeline no encontrado'));
    }

    return res.json(envelopeSuccess(mapPipeline(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deletePipeline(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM crm_pipelines WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Pipeline no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function createFase(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['pipelineId', 'nombre', 'orden']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('fase');
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO crm_fases
        (id, empresa_id, pipeline_id, nombre, orden, probabilidad_defecto, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      id,
      req.body.empresaId || null,
      req.body.pipelineId,
      req.body.nombre,
      req.body.orden,
      req.body.probabilidadDefecto || 0,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapFase(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateFase(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['nombre', 'orden']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const updateQuery = `
      UPDATE crm_fases
      SET nombre = $1,
          orden = $2,
          probabilidad_defecto = $3,
          updated_at = $4
      WHERE id = $5
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.nombre,
      req.body.orden,
      req.body.probabilidadDefecto || 0,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Fase no encontrada'));
    }

    return res.json(envelopeSuccess(mapFase(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteFase(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM crm_fases WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Fase no encontrada'));
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
  createFase,
  updateFase,
  deleteFase
};
