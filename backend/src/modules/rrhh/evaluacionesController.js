<<<<<<< Updated upstream:backend/src/modules/rrhh/evaluacionesController.js
<<<<<<< Updated upstream:backend/src/modules/rrhh/evaluacionesController.js
const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields, isNumber } = require('../../utils/validation');
=======
=======
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/evaluacionesController.js
const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, isNumber } = require('../../../utils/validation');
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/evaluacionesController.js

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

function mapEvaluacion(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    empleadoId: row.employee_id,
    puntuacion: row.score,
    fechaRevision: row.review_date,
    notas: row.notes,
    createdAt: row.created_at
  };
}

async function listEvaluaciones(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const tokenCompanyId = resolveCompanyId(req);

    let query = supabase
      .from('hr_evaluations')
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

    const { data: rows, count, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      throw error;
    }

    const totalItems = count || 0;
    const data = (rows || []).map(mapEvaluacion);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getEvaluacion(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase.from('hr_evaluations').select('*').eq('id', id);
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
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Evaluacion no encontrada'));
    }
    return res.json(envelopeSuccess(mapEvaluacion(row)));
  } catch (err) {
    return next(err);
  }
}

async function createEvaluacion(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'puntuacion',
      'fechaRevision'
    ]);

    const companyError = ensureCompanyMatch(req, req.body.empresaId);
    if (companyError) {
      return res.status(403).json(companyError);
    }

    // Validar rango de puntuacion 0-100 para alinearlo con la constraint de la BD
    if (req.body.puntuacion !== undefined) {
      if (!isNumber(req.body.puntuacion)) {
        requiredErrors.push({ field: 'puntuacion', message: 'Debe ser numerico' });
      } else if (req.body.puntuacion < 0 || req.body.puntuacion > 100) {
        requiredErrors.push({ field: 'puntuacion', message: 'Debe estar entre 0 y 100' });
      }
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
      .from('hr_evaluations')
      .insert({
        company_id: companyId,
        employee_id: req.body.empleadoId,
        score: req.body.puntuacion,
        review_date: req.body.fechaRevision,
        notes: req.body.notas || null
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(envelopeSuccess(mapEvaluacion(row)));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listEvaluaciones,
  getEvaluacion,
  createEvaluacion
};
