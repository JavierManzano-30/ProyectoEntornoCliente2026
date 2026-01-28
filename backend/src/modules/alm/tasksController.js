const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

const TASK_STATES = ['pendiente', 'en_progreso', 'completada'];
const TASK_PRIORITIES = ['baja', 'media', 'alta'];

function mapTask(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    proyectoId: row.proyecto_id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    estado: row.estado,
    prioridad: row.prioridad,
    asignadoA: row.asignado_a,
    fechaVencimiento: row.fecha_vencimiento,
    tiempoEstimado: row.tiempo_estimado,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  if (!sort) return 'created_at DESC';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');
  const map = {
    titulo: 'titulo',
    estado: 'estado',
    prioridad: 'prioridad',
    fechaVencimiento: 'fecha_vencimiento',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'created_at DESC';
  return `${map[field]} ${direction}`;
}

async function listTasks(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.empresaId) {
      values.push(req.query.empresaId);
      filters.push(`empresa_id = $${values.length}`);
    }
    if (req.query.estado) {
      values.push(req.query.estado);
      filters.push(`estado = $${values.length}`);
    }
    if (req.query.prioridad) {
      values.push(req.query.prioridad);
      filters.push(`prioridad = $${values.length}`);
    }
    if (req.query.proyectoId) {
      values.push(req.query.proyectoId);
      filters.push(`proyecto_id = $${values.length}`);
    }
    if (req.query.asignadoA) {
      values.push(req.query.asignadoA);
      filters.push(`asignado_a = $${values.length}`);
    }
    if (req.query.fechaVencimiento) {
      values.push(req.query.fechaVencimiento);
      filters.push(`fecha_vencimiento <= $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = parseSort(req.query.sort);

    const countQuery = `SELECT COUNT(*)::int AS total FROM alm_tareas ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit);
    values.push(offset);
    const listQuery = `
      SELECT *
      FROM alm_tareas
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;
    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapTask);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM alm_tareas WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }
    return res.json(envelopeSuccess(mapTask(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'proyectoId',
      'titulo',
      'estado',
      'prioridad'
    ]);
    const estadoError = validateEnum(req.body.estado, TASK_STATES);
    const prioridadError = validateEnum(req.body.prioridad, TASK_PRIORITIES);
    if (estadoError) requiredErrors.push({ field: 'estado', message: estadoError });
    if (prioridadError) requiredErrors.push({ field: 'prioridad', message: prioridadError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('tar');
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO alm_tareas
        (id, empresa_id, proyecto_id, titulo, descripcion, estado, prioridad, asignado_a, fecha_vencimiento, tiempo_estimado, created_at, updated_at)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      id,
      req.body.empresaId,
      req.body.proyectoId,
      req.body.titulo,
      req.body.descripcion || null,
      req.body.estado,
      req.body.prioridad,
      req.body.asignadoA || null,
      req.body.fechaVencimiento || null,
      req.body.tiempoEstimado || null,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapTask(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'proyectoId',
      'titulo',
      'estado',
      'prioridad'
    ]);
    const estadoError = validateEnum(req.body.estado, TASK_STATES);
    const prioridadError = validateEnum(req.body.prioridad, TASK_PRIORITIES);
    if (estadoError) requiredErrors.push({ field: 'estado', message: estadoError });
    if (prioridadError) requiredErrors.push({ field: 'prioridad', message: prioridadError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const updateQuery = `
      UPDATE alm_tareas
      SET empresa_id = $1,
          proyecto_id = $2,
          titulo = $3,
          descripcion = $4,
          estado = $5,
          prioridad = $6,
          asignado_a = $7,
          fecha_vencimiento = $8,
          tiempo_estimado = $9,
          updated_at = $10
      WHERE id = $11
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.empresaId,
      req.body.proyectoId,
      req.body.titulo,
      req.body.descripcion || null,
      req.body.estado,
      req.body.prioridad,
      req.body.asignadoA || null,
      req.body.fechaVencimiento || null,
      req.body.tiempoEstimado || null,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM alm_tareas WHERE id = $1', [id]);
    if (!result.rowCount) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const { id } = req.params;
    const estadoError = validateEnum(req.body.estado, TASK_STATES);
    if (estadoError) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
          { field: 'estado', message: estadoError }
        ]));
    }

    const now = new Date().toISOString();
    const result = await pool.query(
      'UPDATE alm_tareas SET estado = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [req.body.estado, now, id]
    );

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function assignTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!req.body.asignadoA) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
          { field: 'asignadoA', message: 'Requerido' }
        ]));
    }

    const now = new Date().toISOString();
    const result = await pool.query(
      'UPDATE alm_tareas SET asignado_a = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [req.body.asignadoA, now, id]
    );

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask
};
