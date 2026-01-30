const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

function mapOportunidad(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    clienteId: row.cliente_id,
    pipelineId: row.pipeline_id,
    faseId: row.fase_id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    valorEstimado: parseFloat(row.valor_estimado || 0),
    moneda: row.moneda,
    probabilidad: row.probabilidad,
    fechaCierrePrevista: row.fecha_cierre_prevista,
    responsableId: row.responsable_id,
    orden: row.orden,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  if (!sort) return 'created_at DESC';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');
  const map = {
    titulo: 'titulo',
    valorEstimado: 'valor_estimado',
    probabilidad: 'probabilidad',
    fechaCierrePrevista: 'fecha_cierre_prevista',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'created_at DESC';
  return `${map[field]} ${direction}`;
}

async function listOportunidades(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.empresaId) {
      values.push(req.query.empresaId);
      filters.push(`empresa_id = $${values.length}`);
    }
    if (req.query.pipelineId) {
      values.push(req.query.pipelineId);
      filters.push(`pipeline_id = $${values.length}`);
    }
    if (req.query.faseId) {
      values.push(req.query.faseId);
      filters.push(`fase_id = $${values.length}`);
    }
    if (req.query.responsableId) {
      values.push(req.query.responsableId);
      filters.push(`responsable_id = $${values.length}`);
    }
    if (req.query.clienteId) {
      values.push(req.query.clienteId);
      filters.push(`cliente_id = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = parseSort(req.query.sort);

    const countQuery = `SELECT COUNT(*)::int AS total FROM crm_oportunidades ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit);
    values.push(offset);
    const listQuery = `
      SELECT *
      FROM crm_oportunidades
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapOportunidad);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getOportunidad(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM crm_oportunidades WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Oportunidad no encontrada'));
    }
    return res.json(envelopeSuccess(mapOportunidad(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createOportunidad(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'clienteId',
      'pipelineId',
      'faseId',
      'titulo'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('opor');
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO crm_oportunidades
        (id, empresa_id, cliente_id, pipeline_id, fase_id, titulo, descripcion, valor_estimado, 
         moneda, probabilidad, fecha_cierre_prevista, responsable_id, orden, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      id,
      req.body.empresaId || null,
      req.body.clienteId,
      req.body.pipelineId,
      req.body.faseId,
      req.body.titulo,
      req.body.descripcion || null,
      req.body.valorEstimado || 0,
      req.body.moneda || 'EUR',
      req.body.probabilidad || 0,
      req.body.fechaCierrePrevista || null,
      req.body.responsableId || null,
      req.body.orden || 0,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapOportunidad(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateOportunidad(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'clienteId',
      'pipelineId',
      'faseId',
      'titulo'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const updateQuery = `
      UPDATE crm_oportunidades
      SET cliente_id = $1,
          pipeline_id = $2,
          fase_id = $3,
          titulo = $4,
          descripcion = $5,
          valor_estimado = $6,
          moneda = $7,
          probabilidad = $8,
          fecha_cierre_prevista = $9,
          responsable_id = $10,
          orden = $11,
          updated_at = $12
      WHERE id = $13
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.clienteId,
      req.body.pipelineId,
      req.body.faseId,
      req.body.titulo,
      req.body.descripcion || null,
      req.body.valorEstimado || 0,
      req.body.moneda || 'EUR',
      req.body.probabilidad || 0,
      req.body.fechaCierrePrevista || null,
      req.body.responsableId || null,
      req.body.orden || 0,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Oportunidad no encontrada'));
    }

    return res.json(envelopeSuccess(mapOportunidad(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteOportunidad(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM crm_oportunidades WHERE id = $1 RETURNING id',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Oportunidad no encontrada'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function updateFase(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['faseId']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const updateQuery = `
      UPDATE crm_oportunidades
      SET fase_id = $1,
          orden = $2,
          updated_at = $3
      WHERE id = $4
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.faseId,
      req.body.orden || 0,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Oportunidad no encontrada'));
    }

    return res.json(envelopeSuccess(mapOportunidad(result.rows[0])));
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
  updateFase
};
