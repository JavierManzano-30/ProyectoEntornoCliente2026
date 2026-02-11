const { randomUUID } = require('crypto');
const supabase = require('../../../config/supabase');

async function createCompany(req, res) {
  const { name, tax_id: taxId, domain, settings, is_active: isActive } = req.body || {};

  if (!name || !taxId) {
    return res.status(400).json({ error: 'Missing required fields (name, tax_id)' });
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
    return res.status(500).json({ error: 'Company creation failed', details: error.message || error });
  }

  return res.status(201).json(data);
}

async function getCompany(req, res) {
  const requestedId = req.params.id;
  const companyId = requestedId || req.user.companyId;

  if (requestedId && requestedId !== req.user.companyId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { data, error } = await supabase
    .from('core_companies')
    .select('*')
    .eq('id', companyId)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Company not found' });
  }

  return res.status(200).json(data);
}

async function updateCompany(req, res) {
  const requestedId = req.params.id;
  const companyId = requestedId || req.user.companyId;

  if (requestedId && requestedId !== req.user.companyId) {
    return res.status(403).json({ error: 'Forbidden' });
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
    return res.status(500).json({ error: 'Company update failed', details: error.message || error });
  }

  return res.status(200).json(data);
}

async function deleteCompany(req, res) {
  const requestedId = req.params.id;
  const companyId = requestedId || req.user.companyId;

  if (requestedId && requestedId !== req.user.companyId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { error } = await supabase
    .from('core_companies')
    .delete()
    .eq('id', companyId);

  if (error) {
    return res.status(500).json({ error: 'Company deletion failed', details: error.message || error });
  }

  return res.status(204).send();
}

module.exports = {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany
};
