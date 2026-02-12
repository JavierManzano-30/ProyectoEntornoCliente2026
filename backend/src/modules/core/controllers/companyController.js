const { randomUUID } = require('crypto');
const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

// GET /api/v1/core/companies - List current user's company only
async function listCompanies(req, res, next) {
  try {
    const companyId = req.user?.companyId || req.user?.company_id;
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Missing company context in token'));
    }

    const { data, error } = await supabase
      .from('core_companies')
      .select('*')
      .eq('id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json(envelopeError('DATABASE_ERROR', 'Error fetching companies', error.message));
    }

    return res.json(envelopeSuccess(data || []));
  } catch (err) {
    return next(err);
  }
}

async function createCompany(req, res, next) {
  const { name, tax_id: taxId, domain, settings, is_active: isActive } = req.body || {};

  if (!name || !taxId) {
    return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Missing required fields', [
      { field: 'name' },
      { field: 'tax_id' }
    ]));
  }

  const companyId = randomUUID();

  const { data, error } = await supabase
    .from('core_companies')
    .insert([
      {
        id: companyId,
        name,
        tax_id: taxId,
        domain: domain || null,
        settings: settings || null,
        is_active: typeof isActive === 'boolean' ? isActive : true
      }
    ])
    .select('*')
    .single();

  if (error) {
    return res.status(500).json(envelopeError('DATABASE_ERROR', 'Company creation failed', error.message));
  }

  return res.status(201).json(envelopeSuccess(data));
}

async function getCompany(req, res, next) {
  const requestedId = req.params.id;
  const companyId = requestedId || req.user.companyId;

  if (requestedId && requestedId !== req.user.companyId) {
    return res.status(403).json(envelopeError('FORBIDDEN', 'Access denied'));
  }

  const { data, error } = await supabase
    .from('core_companies')
    .select('*')
    .eq('id', companyId)
    .single();

  if (error) {
    return res.status(404).json(envelopeError('NOT_FOUND', 'Company not found'));
  }

  return res.status(200).json(envelopeSuccess(data));
}

async function updateCompany(req, res, next) {
  const requestedId = req.params.id;
  const companyId = requestedId || req.user.companyId;

  if (requestedId && requestedId !== req.user.companyId) {
    return res.status(403).json(envelopeError('FORBIDDEN', 'Access denied'));
  }

  const updates = { ...req.body };
  delete updates.id;

  const { data, error } = await supabase
    .from('core_companies')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', companyId)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json(envelopeError('DATABASE_ERROR', 'Company update failed', error.message));
  }

  return res.status(200).json(envelopeSuccess(data));
}

async function deleteCompany(req, res, next) {
  const requestedId = req.params.id;
  const companyId = requestedId || req.user.companyId;

  if (requestedId && requestedId !== req.user.companyId) {
    return res.status(403).json(envelopeError('FORBIDDEN', 'Access denied'));
  }

  const { error } = await supabase
    .from('core_companies')
    .delete()
    .eq('id', companyId);

  if (error) {
    return res.status(500).json(envelopeError('DATABASE_ERROR', 'Company deletion failed', error.message));
  }

  return res.status(204).send();
}

module.exports = {
  listCompanies,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany
};
