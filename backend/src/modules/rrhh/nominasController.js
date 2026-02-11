<<<<<<< Updated upstream:backend/src/modules/rrhh/nominasController.js
const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');
=======
const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
>>>>>>> Stashed changes:backend/src/modules/rrhh/controllers/nominasController.js

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

function mapNomina(row) {
  return {
    id: row.id,
    empresaId: row.company_id,
    empleadoId: row.employee_id,
    periodo: row.period,
    importeBruto: row.gross_amount,
    importeNeto: row.net_amount,
    createdAt: row.created_at
  };
}

async function listNominas(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const tokenCompanyId = resolveCompanyId(req);

    let query = supabase
      .from('hr_payrolls')
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
    if (req.query.periodo) {
      query = query.eq('period', req.query.periodo);
    }

    const { data: rows, count, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      throw error;
    }

    const totalItems = count || 0;
    const data = (rows || []).map(mapNomina);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getNomina(req, res, next) {
  try {
    const { id } = req.params;
    const tokenCompanyId = resolveCompanyId(req);
    let query = supabase.from('hr_payrolls').select('*').eq('id', id);
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
        .json(envelopeError('RESOURCE_NOT_FOUND', 'Nomina no encontrada'));
    }
    return res.json(envelopeSuccess(mapNomina(row)));
  } catch (err) {
    return next(err);
  }
}

async function createNomina(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'empresaId',
      'empleadoId',
      'periodo',
      'importeBruto',
      'importeNeto'
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

    const { data: row, error } = await supabase
      .from('hr_payrolls')
      .insert({
        company_id: companyId,
        employee_id: req.body.empleadoId,
        period: req.body.periodo,
        gross_amount: req.body.importeBruto,
        net_amount: req.body.importeNeto
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(envelopeSuccess(mapNomina(row)));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listNominas,
  getNomina,
  createNomina
};
