const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');

function mapTime(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    tareaId: row.tarea_id,
    usuarioId: row.usuario_id,
    fecha: row.fecha,
    horas: row.horas,
    descripcion: row.descripcion,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listTimes(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.empresaId) {
      values.push(req.query.empresaId);
      filters.push(`empresa_id = $${values.length}`);
    }
    if (req.query.tareaId) {
      values.push(req.query.tareaId);
      filters.push(`tarea_id = $${values.length}`);
    }
    if (req.query.usuarioId) {
      values.push(req.query.usuarioId);
      filters.push(`usuario_id = $${values.length}`);
    }
    if (req.query.fecha) {
      values.push(req.query.fecha);
      filters.push(`fecha = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*)::int AS total FROM alm_registro_horas ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM alm_registro_horas
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapTime);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function createTime(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'tareaId',
      'usuarioId',
      'fecha',
      'horas'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const insertQuery = `
      INSERT INTO alm_registro_horas
        (empresa_id, tarea_id, usuario_id, fecha, horas, descripcion)
      VALUES
        ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      req.body.empresaId,
      req.body.tareaId,
      req.body.usuarioId,
      req.body.fecha,
      req.body.horas,
      req.body.descripcion || null
    ]);

    return res.status(201).json(envelopeSuccess(mapTime(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateTime(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'tareaId',
      'usuarioId',
      'fecha',
      'horas'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const updateQuery = `
      UPDATE alm_registro_horas
      SET empresa_id = $1,
          tarea_id = $2,
          usuario_id = $3,
          fecha = $4,
          horas = $5,
          descripcion = $6,
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.empresaId,
      req.body.tareaId,
      req.body.usuarioId,
      req.body.fecha,
      req.body.horas,
      req.body.descripcion || null,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Registro de tiempo no encontrado'));
    }

    return res.json(envelopeSuccess(mapTime(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteTime(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM alm_registro_horas WHERE id = $1', [id]);
    if (!result.rowCount) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Registro de tiempo no encontrado'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function getProjectTimeSummary(req, res, next) {
  try {
    const { id } = req.params;
    const summaryQuery = `
      SELECT
        t.proyecto_id,
        COUNT(r.id)::int AS registros,
        COALESCE(SUM(r.horas), 0)::numeric AS horas_totales
      FROM alm_registro_horas r
      JOIN alm_tareas t ON t.id = r.tarea_id
      WHERE t.proyecto_id = $1
      GROUP BY t.proyecto_id
    `;

    const result = await pool.query(summaryQuery, [id]);
    const row = result.rows[0];
    if (!row) {
      return res.json(envelopeSuccess({ proyectoId: id, registros: 0, horasTotales: 0 }));
    }

    return res.json(envelopeSuccess({
      proyectoId: row.proyecto_id,
      registros: row.registros,
      horasTotales: Number(row.horas_totales)
    }));
  } catch (err) {
    return next(err);
  }
}

async function getUserTimes(req, res, next) {
  try {
    const { id } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);

    const countQuery = 'SELECT COUNT(*)::int AS total FROM alm_registro_horas WHERE usuario_id = $1';
    const countResult = await pool.query(countQuery, [id]);
    const totalItems = countResult.rows[0]?.total || 0;

    const listQuery = `
      SELECT *
      FROM alm_registro_horas
      WHERE usuario_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(listQuery, [id, limit, offset]);

    const data = result.rows.map(mapTime);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getTaskTimes(req, res, next) {
  try {
    const { id } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);

    const countQuery = 'SELECT COUNT(*)::int AS total FROM alm_registro_horas WHERE tarea_id = $1';
    const countResult = await pool.query(countQuery, [id]);
    const totalItems = countResult.rows[0]?.total || 0;

    const listQuery = `
      SELECT *
      FROM alm_registro_horas
      WHERE tarea_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(listQuery, [id, limit, offset]);

    const data = result.rows.map(mapTime);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listTimes,
  createTime,
  updateTime,
  deleteTime,
  getProjectTimeSummary,
  getUserTimes,
  getTaskTimes
};
