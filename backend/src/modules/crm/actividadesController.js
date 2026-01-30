const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

const ACTIVIDAD_TIPOS = ['llamada', 'email', 'reunion', 'nota'];

function mapActividad(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    usuarioId: row.usuario_id,
    clienteId: row.cliente_id,
    oportunidadId: row.oportunidad_id,
    tipo: row.tipo,
    asunto: row.asunto,
    descripcion: row.descripcion,
    fecha: row.fecha,
    fechaVencimiento: row.fecha_vencimiento,
    completada: row.completada,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  if (!sort) return 'fecha DESC';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');
  const map = {
    fecha: 'fecha',
    fechaVencimiento: 'fecha_vencimiento',
    tipo: 'tipo',
    completada: 'completada',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'fecha DESC';
  return `${map[field]} ${direction}`;
}

async function listActividades(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.empresaId) {
      values.push(req.query.empresaId);
      filters.push(`empresa_id = $${values.length}`);
    }
    if (req.query.usuarioId) {
      values.push(req.query.usuarioId);
      filters.push(`usuario_id = $${values.length}`);
    }
    if (req.query.clienteId) {
      values.push(req.query.clienteId);
      filters.push(`cliente_id = $${values.length}`);
    }
    if (req.query.oportunidadId) {
      values.push(req.query.oportunidadId);
      filters.push(`oportunidad_id = $${values.length}`);
    }
    if (req.query.tipo) {
      values.push(req.query.tipo);
      filters.push(`tipo = $${values.length}`);
    }
    if (req.query.estado === 'pendiente') {
      filters.push('completada = false');
    } else if (req.query.estado === 'completada') {
      filters.push('completada = true');
    }
    if (req.query.entidadTipo && req.query.entidadId) {
      if (req.query.entidadTipo === 'cliente') {
        values.push(req.query.entidadId);
        filters.push(`cliente_id = $${values.length}`);
      } else if (req.query.entidadTipo === 'oportunidad') {
        values.push(req.query.entidadId);
        filters.push(`oportunidad_id = $${values.length}`);
      }
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = parseSort(req.query.sort);

    const countQuery = `SELECT COUNT(*)::int AS total FROM crm_actividades ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit);
    values.push(offset);
    const listQuery = `
      SELECT *
      FROM crm_actividades
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapActividad);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getActividad(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM crm_actividades WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }
    return res.json(envelopeSuccess(mapActividad(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createActividad(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['usuarioId', 'tipo', 'asunto', 'fecha']);
    const tipoError = validateEnum(req.body.tipo, ACTIVIDAD_TIPOS);
    if (tipoError) requiredErrors.push({ field: 'tipo', message: tipoError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('act');
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO crm_actividades
        (id, empresa_id, usuario_id, cliente_id, oportunidad_id, tipo, asunto, descripcion, 
         fecha, fecha_vencimiento, completada, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      id,
      req.body.empresaId || null,
      req.body.usuarioId,
      req.body.clienteId || null,
      req.body.oportunidadId || null,
      req.body.tipo,
      req.body.asunto,
      req.body.descripcion || null,
      req.body.fecha,
      req.body.fechaVencimiento || null,
      req.body.completada || false,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapActividad(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateActividad(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['usuarioId', 'tipo', 'asunto', 'fecha']);
    const tipoError = validateEnum(req.body.tipo, ACTIVIDAD_TIPOS);
    if (tipoError) requiredErrors.push({ field: 'tipo', message: tipoError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const updateQuery = `
      UPDATE crm_actividades
      SET usuario_id = $1,
          cliente_id = $2,
          oportunidad_id = $3,
          tipo = $4,
          asunto = $5,
          descripcion = $6,
          fecha = $7,
          fecha_vencimiento = $8,
          completada = $9,
          updated_at = $10
      WHERE id = $11
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.usuarioId,
      req.body.clienteId || null,
      req.body.oportunidadId || null,
      req.body.tipo,
      req.body.asunto,
      req.body.descripcion || null,
      req.body.fecha,
      req.body.fechaVencimiento || null,
      req.body.completada || false,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }

    return res.json(envelopeSuccess(mapActividad(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteActividad(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM crm_actividades WHERE id = $1 RETURNING id',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function marcarCompletada(req, res, next) {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    const updateQuery = `
      UPDATE crm_actividades
      SET completada = true,
          updated_at = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [now, id]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }

    return res.json(envelopeSuccess(mapActividad(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listActividades,
  getActividad,
  createActividad,
  updateActividad,
  deleteActividad,
  marcarCompletada
};
