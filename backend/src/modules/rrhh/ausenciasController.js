<<<<<<< Updated upstream:backend/src/modules/rrhh/ausenciasController.js
<<<<<<< Updated upstream:backend/src/modules/rrhh/ausenciasController.js
const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');
=======
=======
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/ausenciasController.js
const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/ausenciasController.js

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

async function hasOverlappingAbsence({ employeeId, startDate, endDate, excludeId }) {
  let query = supabase
    .from('hr_absences')
    .select('id', { count: 'exact' })
    .eq('employee_id', employeeId)
    .in('status', ['pending', 'approved']);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  if (endDate) {
    query = query.lte('start_date', endDate);
  }
  query = query.gte('end_date', startDate);

  const { count, error } = await query.limit(1);
  if (error) {
    throw error;
  }
  return (count || 0) > 0;
}

function mapAusencia(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    empleadoId: row.employee_id,
    tipo: row.type,
    fechaInicio: row.start_date,
    fechaFin: row.end_date,
    estado: row.status,
    notas: row.notes,
    createdAt: row.created_at
  };
}

async function listAusencias(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const tokenCompanyId = resolveCompanyId(req);

    let query = supabase
      .from('hr_absences')
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
    if (req.query.estado) {
      query = query.eq('status', req.query.estado);
    }
    if (req.query.tipo) {
      query = query.eq('type', req.query.tipo);
    }

    const { data: rows, count, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      throw error;
    }

    const totalItems = count || 0;
    const data = (rows || []).map(mapAusencia);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase.from('hr_absences').select('*').eq('id', id);
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
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }
    return res.json(envelopeSuccess(mapAusencia(row)));
  } catch (err) {
    return next(err);
  }
}

async function createAusencia(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'tipo',
      'fechaInicio',
      'fechaFin'
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

    const hasOverlap = await hasOverlappingAbsence({
      employeeId: req.body.empleadoId,
      startDate: req.body.fechaInicio,
      endDate: req.body.fechaFin
    });
    if (hasOverlap) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Ausencia solapada'));
    }

    const { data: row, error } = await supabase
      .from('hr_absences')
      .insert({
        company_id: companyId,
        employee_id: req.body.empleadoId,
        type: req.body.tipo,
        start_date: req.body.fechaInicio,
        end_date: req.body.fechaFin,
        status: req.body.estado || 'pending',
        notes: req.body.notas || null
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(envelopeSuccess(mapAusencia(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'tipo',
      'fechaInicio',
      'fechaFin'
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

    const hasOverlap = await hasOverlappingAbsence({
      employeeId: req.body.empleadoId,
      startDate: req.body.fechaInicio,
      endDate: req.body.fechaFin,
      excludeId: id
    });
    if (hasOverlap) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Ausencia solapada'));
    }

    const { data: row, error } = await supabase
      .from('hr_absences')
      .update({
        company_id: companyId,
        employee_id: req.body.empleadoId,
        type: req.body.tipo,
        start_date: req.body.fechaInicio,
        end_date: req.body.fechaFin,
        status: req.body.estado || 'pending',
        notes: req.body.notas || null
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
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }

    return res.json(envelopeSuccess(mapAusencia(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase
      .from('hr_absences')
      .update({ status: 'rejected' })
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
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function aprobarAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase
      .from('hr_absences')
      .update({ status: 'approved' })
      .eq('id', id);
    if (tokenCompanyId) {
      query = query.eq('company_id', tokenCompanyId);
    }
    const { data: row, error } = await query.select('*').single();
    if (error) {
      throw error;
    }
    if (!row) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }
    return res.json(envelopeSuccess(mapAusencia(row)));
  } catch (err) {
    return next(err);
  }
}

async function rechazarAusencia(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase
      .from('hr_absences')
      .update({ status: 'rejected' })
      .eq('id', id);
    if (tokenCompanyId) {
      query = query.eq('company_id', tokenCompanyId);
    }
    const { data: row, error } = await query.select('*').single();
    if (error) {
      throw error;
    }
    if (!row) {
      return res
        .status(404)
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }
    return res.json(envelopeSuccess(mapAusencia(row)));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listAusencias,
  getAusencia,
  createAusencia,
  updateAusencia,
  deleteAusencia,
  aprobarAusencia,
  rechazarAusencia
};
