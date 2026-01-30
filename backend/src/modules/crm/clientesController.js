const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

const CLIENTE_TIPOS = ['lead', 'cliente'];

function mapCliente(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    nombre: row.nombre,
    cif: row.cif,
    email: row.email,
    telefono: row.telefono,
    direccion: row.direccion,
    ciudad: row.ciudad,
    responsableId: row.responsable_id,
    tipo: row.tipo,
    notas: row.notas,
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
    tipo: 'tipo',
    ciudad: 'ciudad',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'created_at DESC';
  return `${map[field]} ${direction}`;
}

async function listClientes(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.tipo) {
      values.push(req.query.tipo);
      filters.push(`tipo = $${values.length}`);
    }
    if (req.query.responsableId) {
      values.push(req.query.responsableId);
      filters.push(`responsable_id = $${values.length}`);
    }
    if (req.query.search) {
      values.push(`%${req.query.search}%`);
      filters.push(`(nombre ILIKE $${values.length} OR cif ILIKE $${values.length})`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = parseSort(req.query.sort);

    const countQuery = `SELECT COUNT(*)::int AS total FROM crm_clientes ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit);
    values.push(offset);
    const listQuery = `
      SELECT *
      FROM crm_clientes
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapCliente);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getCliente(req, res, next) {
  try {
    const { id } = req.params;
    
    // Obtener cliente
    const clienteResult = await pool.query('SELECT * FROM crm_clientes WHERE id = $1', [id]);
    if (!clienteResult.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Cliente no encontrado'));
    }

    const cliente = mapCliente(clienteResult.rows[0]);

    // Obtener contactos
    const contactosResult = await pool.query(
      'SELECT * FROM crm_contactos WHERE cliente_id = $1 ORDER BY created_at DESC',
      [id]
    );
    cliente.contactos = contactosResult.rows.map(row => ({
      id: row.id,
      nombre: row.nombre,
      apellidos: row.apellidos,
      cargo: row.cargo,
      email: row.email,
      telefono: row.telefono,
      esDecisor: row.es_decisor
    }));

    // Obtener métricas de oportunidades
    const metricsResult = await pool.query(
      `SELECT 
        COUNT(*)::int AS oportunidades_abiertas,
        COALESCE(SUM(valor_estimado), 0) AS valor_pipeline_total
      FROM crm_oportunidades
      WHERE cliente_id = $1 AND fase_id NOT IN (
        SELECT id FROM crm_fases WHERE nombre IN ('Ganada', 'Perdida')
      )`,
      [id]
    );

    cliente.oportunidadesAbiertas = metricsResult.rows[0]?.oportunidades_abiertas || 0;
    cliente.valorPipelineTotal = parseFloat(metricsResult.rows[0]?.valor_pipeline_total || 0);

    return res.json(envelopeSuccess(cliente));
  } catch (err) {
    return next(err);
  }
}

async function createCliente(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['nombre', 'tipo']);
    const tipoError = validateEnum(req.body.tipo, CLIENTE_TIPOS);
    if (tipoError) requiredErrors.push({ field: 'tipo', message: tipoError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('cli');
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO crm_clientes
        (id, empresa_id, nombre, cif, email, telefono, direccion, ciudad, responsable_id, tipo, notas, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      id,
      req.body.empresaId || null,
      req.body.nombre,
      req.body.cif || null,
      req.body.email || null,
      req.body.telefono || null,
      req.body.direccion || null,
      req.body.ciudad || null,
      req.body.responsableId || null,
      req.body.tipo,
      req.body.notas || null,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapCliente(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateCliente(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['nombre', 'tipo']);
    const tipoError = validateEnum(req.body.tipo, CLIENTE_TIPOS);
    if (tipoError) requiredErrors.push({ field: 'tipo', message: tipoError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const updateQuery = `
      UPDATE crm_clientes
      SET nombre = $1,
          cif = $2,
          email = $3,
          telefono = $4,
          direccion = $5,
          ciudad = $6,
          responsable_id = $7,
          tipo = $8,
          notas = $9,
          updated_at = $10
      WHERE id = $11
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      req.body.nombre,
      req.body.cif || null,
      req.body.email || null,
      req.body.telefono || null,
      req.body.direccion || null,
      req.body.ciudad || null,
      req.body.responsableId || null,
      req.body.tipo,
      req.body.notas || null,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Cliente no encontrado'));
    }

    return res.json(envelopeSuccess(mapCliente(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteCliente(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM crm_clientes WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Cliente no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function convertirCliente(req, res, next) {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    const updateQuery = `
      UPDATE crm_clientes
      SET tipo = 'cliente',
          updated_at = $1
      WHERE id = $2 AND tipo = 'lead'
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [now, id]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Lead no encontrado o ya es cliente'));
    }

    const cliente = mapCliente(result.rows[0]);
    cliente.sincronizadoConErp = true; // Simular sincronización con ERP

    return res.json(envelopeSuccess(cliente));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
  convertirCliente
};
