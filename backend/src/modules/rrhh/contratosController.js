const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');

function mapContrato(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    empleadoId: row.employee_id,
    fechaInicio: row.start_date,
    fechaFin: row.end_date,
    tipoContrato: row.contract_type,
    salario: row.salary,
    activo: row.active,
    createdAt: row.created_at
  };
}

async function listContratos(req, res, next) {
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
    if (req.query.activo !== undefined) {
      values.push(req.query.activo === 'true');
      filters.push(`active = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int AS total FROM hr_contracts ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM hr_contracts
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapContrato);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getContrato(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM hr_contracts WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Contrato no encontrado'));
    }
    return res.json(envelopeSuccess(mapContrato(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createContrato(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'fechaInicio',
      'tipoContrato',
      'salario'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const insertQuery = `
      INSERT INTO hr_contracts (
        company_id, employee_id, start_date, end_date, contract_type, salary, active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      req.body.empresaId,
      req.body.empleadoId,
      req.body.fechaInicio,
      req.body.fechaFin || null,
      req.body.tipoContrato,
      req.body.salario,
      req.body.activo !== undefined ? !!req.body.activo : true
    ]);

    return res.status(201).json(envelopeSuccess(mapContrato(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateContrato(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'fechaInicio',
      'tipoContrato',
      'salario'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const updateQuery = `
      UPDATE hr_contracts
      SET company_id = $1,
          employee_id = $2,
          start_date = $3,
          end_date = $4,
          contract_type = $5,
          salary = $6,
          active = $7
      WHERE id = $8
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.empresaId,
      req.body.empleadoId,
      req.body.fechaInicio,
      req.body.fechaFin || null,
      req.body.tipoContrato,
      req.body.salario,
      req.body.activo !== undefined ? !!req.body.activo : true,
      id
    ]);

    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Contrato no encontrado'));
    }

    return res.json(envelopeSuccess(mapContrato(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteContrato(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM hr_contracts WHERE id = $1', [id]);
    if (!result.rowCount) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Contrato no encontrado'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listContratos,
  getContrato,
  createContrato,
  updateContrato,
  deleteContrato
};
