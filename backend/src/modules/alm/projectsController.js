const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

const PROJECT_STATES = ['planificacion', 'en_curso', 'pausado', 'completado'];

function mapProject(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    responsableId: row.responsable_id,
    estado: row.estado,
    presupuesto: row.presupuesto,
    clienteId: row.cliente_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  if (!sort) return 'created_at DESC';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');
  const map = {
    nombre: 'nombre',
    fechaInicio: 'fecha_inicio',
    fechaFin: 'fecha_fin',
    estado: 'estado',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'created_at DESC';
  return `${map[field]} ${direction}`;
}

async function listProjects(req, res, next) {
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
    if (req.query.clienteId) {
      values.push(req.query.clienteId);
      filters.push(`cliente_id = $${values.length}`);
    }
    if (req.query.responsableId) {
      values.push(req.query.responsableId);
      filters.push(`responsable_id = $${values.length}`);
    }
    if (req.query.fechaInicio) {
      values.push(req.query.fechaInicio);
      filters.push(`fecha_inicio >= $${values.length}`);
    }
    if (req.query.fechaFin) {
      values.push(req.query.fechaFin);
      filters.push(`fecha_fin <= $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = parseSort(req.query.sort);

    const countQuery = `SELECT COUNT(*)::int AS total FROM alm_proyectos ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit);
    values.push(offset);
    const listQuery = `
      SELECT *
      FROM alm_proyectos
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapProject);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM alm_proyectos WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }
    return res.json(envelopeSuccess(mapProject(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'nombre',
      'fechaInicio',
      'responsableId',
      'estado'
    ]);
    const enumError = validateEnum(req.body.estado, PROJECT_STATES);
    if (enumError) requiredErrors.push({ field: 'estado', message: enumError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('proy');
    const now = new Date().toISOString();
    const payload = {
      id,
      empresaId: req.body.empresaId,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || null,
      fechaInicio: req.body.fechaInicio,
      fechaFin: req.body.fechaFin || null,
      responsableId: req.body.responsableId,
      estado: req.body.estado,
      presupuesto: req.body.presupuesto || null,
      clienteId: req.body.clienteId || null
    };

    const insertQuery = `
      INSERT INTO alm_proyectos
        (id, empresa_id, nombre, descripcion, fecha_inicio, fecha_fin, responsable_id, estado, presupuesto, cliente_id, created_at, updated_at)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      payload.id,
      payload.empresaId,
      payload.nombre,
      payload.descripcion,
      payload.fechaInicio,
      payload.fechaFin,
      payload.responsableId,
      payload.estado,
      payload.presupuesto,
      payload.clienteId,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapProject(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'nombre',
      'fechaInicio',
      'responsableId',
      'estado'
    ]);
    const enumError = validateEnum(req.body.estado, PROJECT_STATES);
    if (enumError) requiredErrors.push({ field: 'estado', message: enumError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const updateQuery = `
      UPDATE alm_proyectos
      SET empresa_id = $1,
          nombre = $2,
          descripcion = $3,
          fecha_inicio = $4,
          fecha_fin = $5,
          responsable_id = $6,
          estado = $7,
          presupuesto = $8,
          cliente_id = $9,
          updated_at = $10
      WHERE id = $11
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.empresaId,
      req.body.nombre,
      req.body.descripcion || null,
      req.body.fechaInicio,
      req.body.fechaFin || null,
      req.body.responsableId,
      req.body.estado,
      req.body.presupuesto || null,
      req.body.clienteId || null,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }

    return res.json(envelopeSuccess(mapProject(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM alm_proyectos WHERE id = $1', [id]);
    if (!result.rowCount) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listProjectTasks(req, res, next) {
  try {
    const { id } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);
    const values = [id];

    const countQuery = 'SELECT COUNT(*)::int AS total FROM alm_tareas WHERE proyecto_id = $1';
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM alm_tareas
      WHERE proyecto_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(listQuery, values);

    const data = result.rows.map((row) => ({
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
    }));

    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getProjectStats(req, res, next) {
  try {
    const { id } = req.params;

    const projectResult = await pool.query('SELECT id FROM alm_proyectos WHERE id = $1', [id]);
    if (!projectResult.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }

    const countsQuery = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'pendiente')::int AS pendientes,
        COUNT(*) FILTER (WHERE estado = 'en_progreso')::int AS en_progreso,
        COUNT(*) FILTER (WHERE estado = 'completada')::int AS completadas,
        COALESCE(SUM(tiempo_estimado), 0)::int AS horas_estimadas
      FROM alm_tareas
      WHERE proyecto_id = $1
    `;

    const timesQuery = `
      SELECT COALESCE(SUM(r.horas), 0)::numeric AS horas_reales
      FROM alm_registro_horas r
      JOIN alm_tareas t ON t.id = r.tarea_id
      WHERE t.proyecto_id = $1
    `;

    const counts = await pool.query(countsQuery, [id]);
    const times = await pool.query(timesQuery, [id]);
    const statsRow = counts.rows[0];
    const horasReales = Number(times.rows[0]?.horas_reales || 0);
    const completion = statsRow.total ? Math.round((statsRow.completadas / statsRow.total) * 100) : 0;

    const data = {
      totalTareas: statsRow.total,
      pendientes: statsRow.pendientes,
      enProgreso: statsRow.en_progreso,
      completadas: statsRow.completadas,
      porcentajeCompletado: completion,
      horasEstimadas: statsRow.horas_estimadas,
      horasReales
    };

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listProjectTasks,
  getProjectStats
};
