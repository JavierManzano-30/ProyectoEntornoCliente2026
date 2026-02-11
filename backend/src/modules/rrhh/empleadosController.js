<<<<<<< Updated upstream:backend/src/modules/rrhh/empleadosController.js
<<<<<<< Updated upstream:backend/src/modules/rrhh/empleadosController.js
const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');
=======
=======
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/empleadosController.js
const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/empleadosController.js

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
    const tokenCompanyId = resolveCompanyId(req);

    let query = supabase
      .from('hr_employees')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (tokenCompanyId) {
      query = query.eq('company_id', tokenCompanyId);
    } else if (req.query.empresaId) {
      query = query.eq('company_id', req.query.empresaId);
    }
    if (req.query.departamentoId) {
      query = query.eq('department_id', req.query.departamentoId);
    }
    if (req.query.estado) {
      query = query.eq('status', req.query.estado);
    }
    if (req.query.search) {
      const search = req.query.search;
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data: rows, count, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      throw error;
    }

    const totalItems = count || 0;
    const data = (rows || []).map(mapEmpleado);
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
    let query = supabase.from('hr_employees').select('*').eq('id', id);
    if (tokenCompanyId) {
      query = query.eq('company_id', tokenCompanyId);
    }
    const { data: row, error } = await query.maybeSingle();
    if (error) {
      throw error;
    }
    if (!row) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Empleado no encontrado'));
    }

    return res.json(envelopeSuccess(mapEmpleado(row)));
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

    const { data: row, error } = await supabase
      .from('hr_employees')
      .insert({
        company_id: companyId,
        first_name: req.body.nombre,
        last_name: req.body.apellidos,
        email: req.body.email,
        status: req.body.estado || 'active',
        hire_date: req.body.fechaAlta,
        department_id: req.body.departamentoId,
        user_id: req.body.usuarioId || null
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(envelopeSuccess(mapEmpleado(row)));
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

    const { data: row, error } = await supabase
      .from('hr_employees')
      .update({
        company_id: companyId,
        first_name: req.body.nombre,
        last_name: req.body.apellidos,
        email: req.body.email,
        status: req.body.estado || 'active',
        hire_date: req.body.fechaAlta,
        department_id: req.body.departamentoId,
        user_id: req.body.usuarioId || null
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }
    if (!row) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Empleado no encontrado'));
    }

    return res.json(envelopeSuccess(mapEmpleado(row)));
  } catch (err) {
    return next(err);
  }
}

// Baja lógica: marcamos el empleado como inactivo en lugar de borrarlo físicamente
async function deleteEmpleado(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase
      .from('hr_employees')
      .update({ status: 'inactive' })
      .eq('id', id);
    if (tokenCompanyId) {
      query = query.eq('company_id', tokenCompanyId);
    }
    const { data: rows, error } = await query.select('id');
    if (error) {
      throw error;
    }
    if (!rows || !rows.length) {
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
