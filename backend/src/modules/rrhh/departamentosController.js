const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');

function mapDepartamento(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    nombre: row.name,
    parentDepartmentId: row.parent_department_id,
    activo: row.active,
    createdAt: row.created_at
  };
}

async function listDepartamentos(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.empresaId) {
      values.push(req.query.empresaId);
      filters.push(`company_id = $${values.length}`);
    }
    if (req.query.activo !== undefined) {
      values.push(req.query.activo === 'true');
      filters.push(`active = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int AS total FROM hr_departments ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM hr_departments
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapDepartamento);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getDepartamento(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM hr_departments WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Departamento no encontrado'));
    }
    return res.json(envelopeSuccess(mapDepartamento(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createDepartamento(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['empresaId', 'nombre']);
    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const insertQuery = `
      INSERT INTO hr_departments (company_id, name, parent_department_id, active)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      req.body.empresaId,
      req.body.nombre,
      req.body.parentDepartmentId || null,
      req.body.activo !== undefined ? !!req.body.activo : true
    ]);

    return res.status(201).json(envelopeSuccess(mapDepartamento(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateDepartamento(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['empresaId', 'nombre']);
    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const updateQuery = `
      UPDATE hr_departments
      SET company_id = $1,
          name = $2,
          parent_department_id = $3,
          active = $4
      WHERE id = $5
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.empresaId,
      req.body.nombre,
      req.body.parentDepartmentId || null,
      req.body.activo !== undefined ? !!req.body.activo : true,
      id
    ]);

    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Departamento no encontrado'));
    }

    return res.json(envelopeSuccess(mapDepartamento(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteDepartamento(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM hr_departments WHERE id = $1', [id]);
    if (!result.rowCount) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Departamento no encontrado'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listDepartamentos,
  getDepartamento,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento
};
