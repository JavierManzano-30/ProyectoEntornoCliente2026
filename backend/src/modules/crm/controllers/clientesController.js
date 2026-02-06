const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const { generateId } = require('../../../utils/id');

const CLIENTE_TIPOS = ['lead', 'customer'];

function mapCliente(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    taxId: row.tax_id,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    responsibleId: row.responsible_id,
    type: row.type,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  if (!sort) return 'created_at DESC';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');
  const map = {
    name: 'name',
    type: 'type',
    city: 'city',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'created_at DESC';
  return `${map[field]} ${direction}`;
}

async function listClientes(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    
    // Construir query
    let query = supabase.from('crm_clients').select('*', { count: 'exact' });

    // Aplicar filtros
    if (req.query.type) {
      query = query.eq('type', req.query.type);
    }
    if (req.query.responsibleId) {
      query = query.eq('responsible_id', req.query.responsibleId);
    }
    if (req.query.search) {
      query = query.or(`name.ilike.%${req.query.search}%,tax_id.ilike.%${req.query.search}%`);
    }

    // Ordenamiento
    const sort = req.query.sort || '-createdAt';
    const direction = sort.startsWith('-');
    const field = sort.replace('-', '');
    const fieldMap = {
      name: 'name',
      type: 'type',
      city: 'city',
      createdAt: 'created_at'
    };
    const sortField = fieldMap[field] || 'created_at';
    query = query.order(sortField, { ascending: !direction });

    // Paginación
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const mappedData = data.map(mapCliente);
    const meta = buildPaginationMeta(page, limit, count || 0);

    return res.json(envelopeSuccess(mappedData, meta));
  } catch (err) {
    return next(err);
  }
}

async function getCliente(req, res, next) {
  try {
    const { id } = req.params;
    
    // Obtener cliente
    const { data: cliente, error: clienteError } = await supabase
      .from('crm_clients')
      .select('*')
      .eq('id', id)
      .single();

    if (clienteError || !cliente) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Cliente no encontrado'));
    }

    const mappedCliente = mapCliente(cliente);

    // Obtener contactos
    const { data: contactos } = await supabase
      .from('crm_contacts')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    mappedCliente.contacts = (contactos || []).map(row => ({
      id: row.id,
      name: row.name,
      lastName: row.last_name,
      jobTitle: row.job_title,
      email: row.email,
      phone: row.phone,
      isDecisionMaker: row.is_decision_maker
    }));

    // Obtener métricas de oportunidades
    // Primero obtener IDs de stages ganados/perdidos
    const { data: closedStages } = await supabase
      .from('crm_stages')
      .select('id')
      .in('name', ['Won', 'Lost']);

    const closedStageIds = (closedStages || []).map(s => s.id);

    const { data: opportunities } = await supabase
      .from('crm_opportunities')
      .select('id, estimated_value')
      .eq('client_id', id)
      .not('stage_id', 'in', `(${closedStageIds.join(',')})`);

    mappedCliente.openOpportunities = opportunities?.length || 0;
    mappedCliente.totalPipelineValue = opportunities?.reduce((sum, opp) => sum + (parseFloat(opp.estimated_value) || 0), 0) || 0;

    return res.json(envelopeSuccess(mappedCliente));
  } catch (err) {
    return next(err);
  }
}

async function createCliente(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['name', 'type']);
    const typeError = validateEnum(req.body.type, CLIENTE_TIPOS);
    if (typeError) requiredErrors.push({ field: 'type', message: typeError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const id = generateId('cli');
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_clients')
      .insert([{
        id,
        company_id: req.body.companyId || null,
        name: req.body.name,
        tax_id: req.body.taxId || null,
        email: req.body.email || null,
        phone: req.body.phone || null,
        address: req.body.address || null,
        city: req.body.city || null,
        responsible_id: req.body.responsibleId || null,
        type: req.body.type,
        notes: req.body.notes || null,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(envelopeSuccess(mapCliente(data)));
  } catch (err) {
    return next(err);
  }
}

async function updateCliente(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['name', 'type']);
    const typeError = validateEnum(req.body.type, CLIENTE_TIPOS);
    if (typeError) requiredErrors.push({ field: 'type', message: typeError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('crm_clients')
      .update({
        name: req.body.name,
        tax_id: req.body.taxId || null,
        email: req.body.email || null,
        phone: req.body.phone || null,
        address: req.body.address || null,
        city: req.body.city || null,
        responsible_id: req.body.responsibleId || null,
        type: req.body.type,
        notes: req.body.notes || null,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Cliente no encontrado'));
    }

    return res.json(envelopeSuccess(mapCliente(data)));
  } catch (err) {
    return next(err);
  }
}

async function deleteCliente(req, res, next) {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('crm_clients')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error || !data) {
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

    const { data, error } = await supabase
      .from('crm_clients')
      .update({
        type: 'customer',
        updated_at: now
      })
      .eq('id', id)
      .eq('type', 'lead')
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Lead not found or already a customer'));
    }

    const cliente = mapCliente(data);
    cliente.syncedWithErp = true; // Simular sincronización con ERP

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
