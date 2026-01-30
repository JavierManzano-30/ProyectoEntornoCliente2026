const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

function mapContacto(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    clienteId: row.cliente_id,
    nombre: row.nombre,
    apellidos: row.apellidos,
    cargo: row.cargo,
    email: row.email,
    telefono: row.telefono,
    esDecisor: row.es_decisor,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listContactos(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.clienteId) {
      values.push(req.query.clienteId);
      filters.push(`cliente_id = $${values.length}`);
    }
    if (req.query.empresaId) {
      values.push(req.query.empresaId);
      filters.push(`empresa_id = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int AS total FROM crm_contactos ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit);
    values.push(offset);
    const listQuery = `
      SELECT *
      FROM crm_contactos
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapContacto);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getContacto(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM crm_contactos WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Contacto no encontrado'));
    }
    return res.json(envelopeSuccess(mapContacto(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createContacto(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['clienteId', 'nombre']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('cont');
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO crm_contactos
        (id, empresa_id, cliente_id, nombre, apellidos, cargo, email, telefono, es_decisor, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      id,
      req.body.empresaId || null,
      req.body.clienteId,
      req.body.nombre,
      req.body.apellidos || null,
      req.body.cargo || null,
      req.body.email || null,
      req.body.telefono || null,
      req.body.esDecisor || false,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapContacto(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateContacto(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['clienteId', 'nombre']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const updateQuery = `
      UPDATE crm_contactos
      SET cliente_id = $1,
          nombre = $2,
          apellidos = $3,
          cargo = $4,
          email = $5,
          telefono = $6,
          es_decisor = $7,
          updated_at = $8
      WHERE id = $9
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.clienteId,
      req.body.nombre,
      req.body.apellidos || null,
      req.body.cargo || null,
      req.body.email || null,
      req.body.telefono || null,
      req.body.esDecisor || false,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Contacto no encontrado'));
    }

    return res.json(envelopeSuccess(mapContacto(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteContacto(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM crm_contactos WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Contacto no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listContactos,
  getContacto,
  createContacto,
  updateContacto,
  deleteContacto
};
