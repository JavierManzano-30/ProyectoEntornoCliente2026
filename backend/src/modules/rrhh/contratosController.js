const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');

function resolveCompanyId(req) {
  return req.user?.companyId || req.user?.empresaId || req.user?.company_id || null;
}

function ensureCompanyMatch(req, providedCompanyId) {
  const tokenCompanyId = resolveCompanyId(req);
  if (tokenCompanyId && providedCompanyId && providedCompanyId !== tokenCompanyId) {
    return envelopeError('FORBIDDEN', 'Empresa no autorizada');
  }
  return null;
}

function validateDateRange(startDate, endDate) {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 'fechaInicio invalida';
  if (!endDate) return null;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return 'fechaFin invalida';
  if (start > end) return 'fechaFin debe ser igual o posterior a fechaInicio';
  return null;
}

async function hasOverlappingActiveContract({ employeeId, startDate, endDate, excludeId }) {
  const result = await pool.query(
    `
      SELECT 1
      FROM hr_contracts
      WHERE employee_id = $1
        AND active = true
        AND id <> COALESCE($2, '00000000-0000-0000-0000-000000000000')
        AND start_date <= COALESCE($4, 'infinity'::date)
        AND COALESCE(end_date, 'infinity'::date) >= $3
      LIMIT 1
    `,
    [employeeId, excludeId || null, startDate, endDate || null]
  );
  return result.rows.length > 0;
}

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
    const tokenCompanyId = resolveCompanyId(req);

    if (tokenCompanyId) {
      values.push(tokenCompanyId);
      filters.push(`company_id = $${values.length}`);
    } else if (req.query.empresaId) {
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
    const tokenCompanyId = resolveCompanyId(req);
    const values = [id];
    let query = 'SELECT * FROM hr_contracts WHERE id = $1';
    if (tokenCompanyId) {
      values.push(tokenCompanyId);
      query += ` AND company_id = $2`;
    }
    const result = await pool.query(query, values);
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

    const companyError = ensureCompanyMatch(req, req.body.empresaId);
    if (companyError) {
      return res.status(403).json(companyError);
    }

    const dateError = validateDateRange(req.body.fechaInicio, req.body.fechaFin);
    if (dateError) {
      requiredErrors.push({ field: 'fechaFin', message: dateError });
    }

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const companyId = resolveCompanyId(req) || req.body.empresaId;
    if (!companyId) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'empresaId es obligatorio'));
    }

    const active = req.body.activo !== undefined ? !!req.body.activo : true;
    if (active) {
      const hasOverlap = await hasOverlappingActiveContract({
        employeeId: req.body.empleadoId,
        startDate: req.body.fechaInicio,
        endDate: req.body.fechaFin
      });
      if (hasOverlap) {
        return res
          .status(400)
          .json(envelopeError('VALIDATION_ERROR', 'Contrato activo solapado'));
      }
    }

    const insertQuery = `
      INSERT INTO hr_contracts (
        company_id, employee_id, start_date, end_date, contract_type, salary, active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      companyId,
      req.body.empleadoId,
      req.body.fechaInicio,
      req.body.fechaFin || null,
      req.body.tipoContrato,
      req.body.salario,
      active
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

    const companyError = ensureCompanyMatch(req, req.body.empresaId);
    if (companyError) {
      return res.status(403).json(companyError);
    }

    const dateError = validateDateRange(req.body.fechaInicio, req.body.fechaFin);
    if (dateError) {
      requiredErrors.push({ field: 'fechaFin', message: dateError });
    }

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const companyId = resolveCompanyId(req) || req.body.empresaId;
    if (!companyId) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'empresaId es obligatorio'));
    }

    const active = req.body.activo !== undefined ? !!req.body.activo : true;
    if (active) {
      const hasOverlap = await hasOverlappingActiveContract({
        employeeId: req.body.empleadoId,
        startDate: req.body.fechaInicio,
        endDate: req.body.fechaFin,
        excludeId: id
      });
      if (hasOverlap) {
        return res
          .status(400)
          .json(envelopeError('VALIDATION_ERROR', 'Contrato activo solapado'));
      }
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
      companyId,
      req.body.empleadoId,
      req.body.fechaInicio,
      req.body.fechaFin || null,
      req.body.tipoContrato,
      req.body.salario,
      active,
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
    const tokenCompanyId = resolveCompanyId(req);
    const values = [id];
    let query = `
      UPDATE hr_contracts
      SET active = false,
          end_date = COALESCE(end_date, CURRENT_DATE)
      WHERE id = $1
      RETURNING *
    `;
    if (tokenCompanyId) {
      query = `
        UPDATE hr_contracts
        SET active = false,
            end_date = COALESCE(end_date, CURRENT_DATE)
        WHERE id = $1 AND company_id = $2
        RETURNING *
      `;
      values.push(tokenCompanyId);
    }
    const result = await pool.query(query, values);
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
