<<<<<<< Updated upstream:backend/src/modules/rrhh/departamentosController.js
<<<<<<< Updated upstream:backend/src/modules/rrhh/departamentosController.js
const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');
=======
=======
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/departamentosController.js
const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/departamentosController.js

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

function mapDepartamento(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    nombre: row.name,
    parentDepartmentId: row.parent_department_id,
    activo: row.active,
    createdAt: row.created_at
  };
}

async function listDepartamentos(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const tokenCompanyId = resolveCompanyId(req);

    let query = supabase
      .from('hr_departments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (tokenCompanyId) {
      query = query.eq('company_id', tokenCompanyId);
    } else if (req.query.empresaId) {
      query = query.eq('company_id', req.query.empresaId);
    }
    if (req.query.activo !== undefined) {
      query = query.eq('active', req.query.activo === 'true');
    }

    const { data: rows, count, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      throw error;
    }

    const totalItems = count || 0;
    const data = (rows || []).map(mapDepartamento);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getDepartamento(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase.from('hr_departments').select('*').eq('id', id);
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
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Departamento no encontrado'));
    }
    return res.json(envelopeSuccess(mapDepartamento(row)));
  } catch (err) {
    return next(err);
  }
}

async function createDepartamento(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['empresaId', 'nombre']);
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

    const { data: row, error } = await supabase
      .from('hr_departments')
      .insert({
        company_id: companyId,
        name: req.body.nombre,
        parent_department_id: req.body.parentDepartmentId || null,
        active: req.body.activo !== undefined ? !!req.body.activo : true
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(envelopeSuccess(mapDepartamento(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateDepartamento(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['empresaId', 'nombre']);
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

    const { data: row, error } = await supabase
      .from('hr_departments')
      .update({
        company_id: companyId,
        name: req.body.nombre,
        parent_department_id: req.body.parentDepartmentId || null,
        active: req.body.activo !== undefined ? !!req.body.activo : true
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
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Departamento no encontrado'));
    }

    return res.json(envelopeSuccess(mapDepartamento(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteDepartamento(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase.from('hr_departments').delete().eq('id', id);
    if (tokenCompanyId) {
      query = query.eq('company_id', tokenCompanyId);
    }
    const { error, count } = await query.select('id', { count: 'exact' });
    if (error) {
      throw error;
    }
    if (!count) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Departamento no encontrado'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listDepartamentos,
  getDepartamento,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento
};
