const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');

function mapNomina(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    empleadoId: row.employee_id,
    periodo: row.period,
    importeBruto: row.gross_amount,
    importeNeto: row.net_amount,
    createdAt: row.created_at
  };
}

async function listNominas(req, res, next) {
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
    if (req.query.periodo) {
      values.push(req.query.periodo);
      filters.push(`period = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int AS total FROM hr_payrolls ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM hr_payrolls
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapNomina);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getNomina(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM hr_payrolls WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Nomina no encontrada'));
    }
    return res.json(envelopeSuccess(mapNomina(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createNomina(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'periodo',
      'importeBruto',
      'importeNeto'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const insertQuery = `
      INSERT INTO hr_payrolls (
        company_id, employee_id, period, gross_amount, net_amount
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      req.body.empresaId,
      req.body.empleadoId,
      req.body.periodo,
      req.body.importeBruto,
      req.body.importeNeto
    ]);

    return res.status(201).json(envelopeSuccess(mapNomina(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listNominas,
  getNomina,
  createNomina
};
