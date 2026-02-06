const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields, isNumber } = require('../../utils/validation');

function mapEvaluacion(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    empleadoId: row.employee_id,
    puntuacion: row.score,
    fechaRevision: row.review_date,
    notas: row.notes,
    createdAt: row.created_at
  };
}

async function listEvaluaciones(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.empresaId) {
      values.push(req.query.empresaId);
      filters.push(`company_id = $${values.length}`);
    }
    if (req.query.empleadoId) {
      values.push(req.query.empleadoId);
      filters.push(`employee_id = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int AS total FROM hr_evaluations ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM hr_evaluations
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapEvaluacion);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getEvaluacion(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM hr_evaluations WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Evaluacion no encontrada'));
    }
    return res.json(envelopeSuccess(mapEvaluacion(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createEvaluacion(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'puntuacion',
      'fechaRevision'
    ]);

    // Validar rango de puntuacion 0-100 para alinearlo con la constraint de la BD
    if (req.body.puntuacion !== undefined) {
      if (!isNumber(req.body.puntuacion)) {
        requiredErrors.push({ field: 'puntuacion', message: 'Debe ser numerico' });
      } else if (req.body.puntuacion < 0 || req.body.puntuacion > 100) {
        requiredErrors.push({ field: 'puntuacion', message: 'Debe estar entre 0 y 100' });
      }
    }

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const insertQuery = `
      INSERT INTO hr_evaluations (
        company_id, employee_id, score, review_date, notes
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      req.body.empresaId,
      req.body.empleadoId,
      req.body.puntuacion,
      req.body.fechaRevision,
      req.body.notas || null
    ]);

    return res.status(201).json(envelopeSuccess(mapEvaluacion(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listEvaluaciones,
  getEvaluacion,
  createEvaluacion
};
