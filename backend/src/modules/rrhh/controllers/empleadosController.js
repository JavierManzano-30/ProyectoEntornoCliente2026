const { pool } = require('../../../config/db');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');

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

function mapEmpleado(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    nombre: row.first_name,
    apellidos: row.last_name,
    email: row.email,
    estado: row.status,
    fechaAlta: row.hire_date,
    departamentoId: row.department_id,
    usuarioId: row.user_id,
    createdAt: row.created_at
  };
}

async function listEmpleados(req, res, next) {
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
    if (req.query.departamentoId) {
      values.push(req.query.departamentoId);
      filters.push(`department_id = $${values.length}`);
    }
    if (req.query.estado) {
      values.push(req.query.estado);
      filters.push(`status = $${values.length}`);
    }
    if (req.query.search) {
      values.push(`%${req.query.search}%`);
      filters.push(
        `(first_name ILIKE $${values.length} OR last_name ILIKE $${values.length} OR email ILIKE $${values.length})`
      );
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int AS total FROM hr_employees ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM hr_employees
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapEmpleado);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getEmpleado(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    const values = [id];
    let query = 'SELECT * FROM hr_employees WHERE id = $1';
    if (tokenCompanyId) {
      values.push(tokenCompanyId);
      query += ` AND company_id = $2`;
    }
    const result = await pool.query(query, values);
    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Empleado no encontrado'));
    }

    return res.json(envelopeSuccess(mapEmpleado(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createEmpleado(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'nombre',
      'apellidos',
      'email',
      'fechaAlta',
      'departamentoId'
    ]);

    const companyError = ensureCompanyMatch(req, req.body.empresaId);
    if (companyError) {
      return res.status(403).json(companyError);
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

    const insertQuery = `
      INSERT INTO hr_employees (
        company_id, first_name, last_name, email, status, hire_date, department_id, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      companyId,
      req.body.nombre,
      req.body.apellidos,
      req.body.email,
      req.body.estado || 'active',
      req.body.fechaAlta,
      req.body.departamentoId,
      req.body.usuarioId || null
    ]);

    return res.status(201).json(envelopeSuccess(mapEmpleado(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateEmpleado(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'nombre',
      'apellidos',
      'email',
      'fechaAlta',
      'departamentoId'
    ]);

    const companyError = ensureCompanyMatch(req, req.body.empresaId);
    if (companyError) {
      return res.status(403).json(companyError);
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

    const updateQuery = `
      UPDATE hr_employees
      SET company_id = $1,
          first_name = $2,
          last_name = $3,
          email = $4,
          status = $5,
          hire_date = $6,
          department_id = $7,
          user_id = $8
      WHERE id = $9
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      companyId,
      req.body.nombre,
      req.body.apellidos,
      req.body.email,
      req.body.estado || 'active',
      req.body.fechaAlta,
      req.body.departamentoId,
      req.body.usuarioId || null,
      id
    ]);

    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Empleado no encontrado'));
    }

    return res.json(envelopeSuccess(mapEmpleado(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

// Baja lógica: marcamos el empleado como inactivo en lugar de borrarlo físicamente
async function deleteEmpleado(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    const updateQuery = `
      UPDATE hr_employees
      SET status = 'inactive'
      WHERE id = $1
      RETURNING *
    `;

    const values = [id];
    let query = updateQuery;
    if (tokenCompanyId) {
      query = `
        UPDATE hr_employees
        SET status = 'inactive'
        WHERE id = $1 AND company_id = $2
        RETURNING *
      `;
      values.push(tokenCompanyId);
    }
    const result = await pool.query(query, values);
    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Empleado no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listEmpleados,
  getEmpleado,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado
};
