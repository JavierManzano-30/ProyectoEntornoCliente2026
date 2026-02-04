const supabase = require('../core/src/config/supabaseClient');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

function mapContacto(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    clientId: row.client_id,
    name: row.name,
    lastName: row.last_name,
    jobTitle: row.job_title,
    email: row.email,
    phone: row.phone,
    isDecisionMaker: row.is_decision_maker,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listContactos(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    
    let query = supabase.from('crm_contacts').select('*', { count: 'exact' });

    if (req.query.clientId) {
      query = query.eq('client_id', req.query.clientId);
    }
    if (req.query.companyId) {
      query = query.eq('company_id', req.query.companyId);
    }

    query = query.order('created_at', { ascending: false });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const mappedData = data.map(mapContacto);
    const meta = buildPaginationMeta(page, limit, count || 0);

    return res.json(envelopeSuccess(mappedData, meta));
  } catch (err) {
    return next(err);
  }
}

async function getContacto(req, res, next) {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Contacto no encontrado'));
    }

    return res.json(envelopeSuccess(mapContacto(data)));
  } catch (err) {
    return next(err);
  }
}

async function createContacto(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['clientId', 'name']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('cont');
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_contacts')
      .insert([{
        id,
        company_id: req.body.companyId || null,
        client_id: req.body.clientId,
        name: req.body.name,
        last_name: req.body.lastName || null,
        job_title: req.body.jobTitle || null,
        email: req.body.email || null,
        phone: req.body.phone || null,
        is_decision_maker: req.body.isDecisionMaker || false,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(envelopeSuccess(mapContacto(data)));
  } catch (err) {
    return next(err);
  }
}

async function updateContacto(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['clientId', 'name']);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_contacts')
      .update({
        client_id: req.body.clientId,
        name: req.body.name,
        last_name: req.body.lastName || null,
        job_title: req.body.jobTitle || null,
        email: req.body.email || null,
        phone: req.body.phone || null,
        is_decision_maker: req.body.isDecisionMaker || false,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Contacto no encontrado'));
    }

    return res.json(envelopeSuccess(mapContacto(data)));
  } catch (err) {
    return next(err);
  }
}

async function deleteContacto(req, res, next) {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('crm_contacts')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Contacto no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listContactos,
  getContacto,
  createContacto,
  updateContacto,
  deleteContacto
};
