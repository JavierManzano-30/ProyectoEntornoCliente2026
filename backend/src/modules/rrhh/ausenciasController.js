const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');

function mapAusencia(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    empleadoId: row.employee_id,
    tipo: row.type,
    fechaInicio: row.start_date,
    fechaFin: row.end_date,
    estado: row.status,
    notas: row.notes,
    createdAt: row.created_at
  };
}

async function listAusencias(req, res, next) {
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
    if (req.query.estado) {
      values.push(req.query.estado);
      filters.push(`status = $${values.length}`);
    }
    if (req.query.tipo) {
      values.push(req.query.tipo);
      filters.push(`type = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int AS total FROM hr_absences ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM hr_absences
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapAusencia);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM hr_absences WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }
    return res.json(envelopeSuccess(mapAusencia(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createAusencia(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'tipo',
      'fechaInicio',
      'fechaFin'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const insertQuery = `
      INSERT INTO hr_absences (
        company_id, employee_id, type, start_date, end_date, status, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      req.body.empresaId,
      req.body.empleadoId,
      req.body.tipo,
      req.body.fechaInicio,
      req.body.fechaFin,
      req.body.estado || 'pending',
      req.body.notas || null
    ]);

    return res.status(201).json(envelopeSuccess(mapAusencia(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'tipo',
      'fechaInicio',
      'fechaFin'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const updateQuery = `
      UPDATE hr_absences
      SET company_id = $1,
          employee_id = $2,
          type = $3,
          start_date = $4,
          end_date = $5,
          status = $6,
          notes = $7
      WHERE id = $8
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.empresaId,
      req.body.empleadoId,
      req.body.tipo,
      req.body.fechaInicio,
      req.body.fechaFin,
      req.body.estado || 'pending',
      req.body.notas || null,
      id
    ]);

    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }

    return res.json(envelopeSuccess(mapAusencia(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM hr_absences WHERE id = $1', [id]);
    if (!result.rowCount) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function aprobarAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE hr_absences SET status = $1 WHERE id = $2 RETURNING *',
      ['approved', id]
    );
    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }
    return res.json(envelopeSuccess(mapAusencia(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function rechazarAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE hr_absences SET status = $1 WHERE id = $2 RETURNING *',
      ['rejected', id]
    );
    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }
    return res.json(envelopeSuccess(mapAusencia(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listAusencias,
  getAusencia,
  createAusencia,
  updateAusencia,
  deleteAusencia,
  aprobarAusencia,
  rechazarAusencia
};
