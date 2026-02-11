<<<<<<< Updated upstream:backend/src/modules/rrhh/contratosController.js
const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');
=======
const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/contratosController.js

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

function validateDateRange(startDate, endDate) {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 'fechaInicio invalida';
  if (!endDate) return null;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return 'fechaFin invalida';
  if (start > end) return 'fechaFin debe ser igual o posterior a fechaInicio';
  return null;
}

async function hasOverlappingActiveContract({ employeeId, startDate, endDate, excludeId }) {
  let query = supabase
    .from('hr_contracts')
    .select('id', { count: 'exact' })
    .eq('employee_id', employeeId)
    .eq('active', true);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  if (endDate) {
    query = query.lte('start_date', endDate);
  }
  query = query.or(`end_date.is.null,end_date.gte.${startDate}`);

  const { count, error } = await query.limit(1);
  if (error) {
    throw error;
  }
  return (count || 0) > 0;
}

function mapContrato(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    empleadoId: row.employee_id,
    fechaInicio: row.start_date,
    fechaFin: row.end_date,
    tipoContrato: row.contract_type,
    salario: row.salary,
    activo: row.active,
    createdAt: row.created_at
  };
}

async function listContratos(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const tokenCompanyId = resolveCompanyId(req);

    let query = supabase
      .from('hr_contracts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (tokenCompanyId) {
      query = query.eq('company_id', tokenCompanyId);
    } else if (req.query.empresaId) {
      query = query.eq('company_id', req.query.empresaId);
    }
    if (req.query.empleadoId) {
      query = query.eq('employee_id', req.query.empleadoId);
    }
    if (req.query.activo !== undefined) {
      query = query.eq('active', req.query.activo === 'true');
    }

    const { data: rows, count, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      throw error;
    }

    const totalItems = count || 0;
    const data = (rows || []).map(mapContrato);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getContrato(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase.from('hr_contracts').select('*').eq('id', id);
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
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Contrato no encontrado'));
    }
    return res.json(envelopeSuccess(mapContrato(row)));
  } catch (err) {
    return next(err);
  }
}

async function createContrato(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'fechaInicio',
      'tipoContrato',
      'salario'
    ]);

    const companyError = ensureCompanyMatch(req, req.body.empresaId);
    if (companyError) {
      return res.status(403).json(companyError);
    }

    const dateError = validateDateRange(req.body.fechaInicio, req.body.fechaFin);
    if (dateError) {
      requiredErrors.push({ field: 'fechaFin', message: dateError });
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

    const active = req.body.activo !== undefined ? !!req.body.activo : true;
    if (active) {
      const hasOverlap = await hasOverlappingActiveContract({
        employeeId: req.body.empleadoId,
        startDate: req.body.fechaInicio,
        endDate: req.body.fechaFin
      });
      if (hasOverlap) {
        return res
          .status(400)
          .json(envelopeError('VALIDATION_ERROR', 'Contrato activo solapado'));
      }
    }

    const { data: row, error } = await supabase
      .from('hr_contracts')
      .insert({
        company_id: companyId,
        employee_id: req.body.empleadoId,
        start_date: req.body.fechaInicio,
        end_date: req.body.fechaFin || null,
        contract_type: req.body.tipoContrato,
        salary: req.body.salario,
        active
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(envelopeSuccess(mapContrato(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateContrato(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'fechaInicio',
      'tipoContrato',
      'salario'
    ]);

    const companyError = ensureCompanyMatch(req, req.body.empresaId);
    if (companyError) {
      return res.status(403).json(companyError);
    }

    const dateError = validateDateRange(req.body.fechaInicio, req.body.fechaFin);
    if (dateError) {
      requiredErrors.push({ field: 'fechaFin', message: dateError });
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

    const active = req.body.activo !== undefined ? !!req.body.activo : true;
    if (active) {
      const hasOverlap = await hasOverlappingActiveContract({
        employeeId: req.body.empleadoId,
        startDate: req.body.fechaInicio,
        endDate: req.body.fechaFin,
        excludeId: id
      });
      if (hasOverlap) {
        return res
          .status(400)
          .json(envelopeError('VALIDATION_ERROR', 'Contrato activo solapado'));
      }
    }

    const { data: row, error } = await supabase
      .from('hr_contracts')
      .update({
        company_id: companyId,
        employee_id: req.body.empleadoId,
        start_date: req.body.fechaInicio,
        end_date: req.body.fechaFin || null,
        contract_type: req.body.tipoContrato,
        salary: req.body.salario,
        active
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
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Contrato no encontrado'));
    }

    return res.json(envelopeSuccess(mapContrato(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteContrato(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let lookup = supabase.from('hr_contracts').select('id, end_date').eq('id', id);
    if (tokenCompanyId) {
      lookup = lookup.eq('company_id', tokenCompanyId);
    }
    const { data: existing, error: lookupError } = await lookup.maybeSingle();
    if (lookupError) {
      throw lookupError;
    }
    if (!existing) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Contrato no encontrado'));
    }
    const today = new Date().toISOString().slice(0, 10);
    const endDate = existing.end_date || today;
    let query = supabase
      .from('hr_contracts')
      .update({ active: false, end_date: endDate })
      .eq('id', id);
    if (tokenCompanyId) {
      query = query.eq('company_id', tokenCompanyId);
    }
    const { error } = await query.select('id');
    if (error) {
      throw error;
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listContratos,
  getContrato,
  createContrato,
  updateContrato,
  deleteContrato
};
