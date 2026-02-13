const supabase = require('../../../config/supabase');
const { generateId } = require('../../../utils/id');

async function listWarehouses(companyId, { limit, offset }) {
  let query = supabase.from('erp_warehouses').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function createWarehouse(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_wh');
  const { data: row, error } = await supabase
    .from('erp_warehouses')
    .insert([{
      id,
      company_id: companyId,
      name: data.name,
      location: data.location || null,
      total_capacity: data.totalCapacity || null,
      responsible_id: data.responsibleId || null,
      type: data.type || 'main',
      is_active: data.isActive !== false,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateWarehouse(companyId, id, data) {
  const now = new Date().toISOString();
  let query = supabase
    .from('erp_warehouses')
    .update({
      name: data.name,
      location: data.location || null,
      total_capacity: data.totalCapacity || null,
      responsible_id: data.responsibleId || null,
      type: data.type || 'main',
      is_active: data.isActive !== false,
      updated_at: now
    })
    .eq('id', id);

  if (companyId) query = query.eq('company_id', companyId);

  const { data: row, error } = await query.select('*').maybeSingle();
  if (error) throw error;
  return row || null;
}

async function deleteWarehouse(companyId, id) {
  let query = supabase.from('erp_warehouses').delete().eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query.select('id').maybeSingle();
  if (error) throw error;
  return data || null;
}

async function listInventory(companyId, { filters, limit, offset }) {
  let query = supabase.from('erp_inventory').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);
  if (filters.warehouseId) query = query.eq('warehouse_id', filters.warehouseId);
  if (filters.productId) query = query.eq('product_id', filters.productId);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function getInventoryById(companyId, id) {
  let query = supabase.from('erp_inventory').select('*').eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createInventoryItem(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_inv');
  const { data: row, error } = await supabase
    .from('erp_inventory')
    .insert([{
      id,
      company_id: companyId,
      product_id: data.productId,
      warehouse_id: data.warehouseId,
      quantity_available: data.quantityAvailable || 0,
      quantity_reserved: data.quantityReserved || 0,
      minimum_quantity: data.minimumQuantity || null,
      maximum_quantity: data.maximumQuantity || null,
      last_movement_at: null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateInventoryItem(companyId, id, data) {
  const now = new Date().toISOString();
  let query = supabase
    .from('erp_inventory')
    .update({
      product_id: data.productId,
      warehouse_id: data.warehouseId,
      quantity_available: data.quantityAvailable || 0,
      quantity_reserved: data.quantityReserved || 0,
      minimum_quantity: data.minimumQuantity || null,
      maximum_quantity: data.maximumQuantity || null,
      updated_at: now
    })
    .eq('id', id);

  if (companyId) query = query.eq('company_id', companyId);

  const { data: row, error } = await query.select('*').maybeSingle();
  if (error) throw error;
  return row || null;
}

async function listMovements(companyId, { filters, limit, offset }) {
  let query = supabase.from('erp_inventory_movements').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);
  if (filters.productId) query = query.eq('product_id', filters.productId);
  if (filters.warehouseId) query = query.eq('warehouse_id', filters.warehouseId);
  if (filters.movementType) query = query.eq('movement_type', filters.movementType);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function createMovement(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_mov');
  const { data: row, error } = await supabase
    .from('erp_inventory_movements')
    .insert([{
      id,
      company_id: companyId,
      product_id: data.productId,
      warehouse_id: data.warehouseId,
      movement_type: data.movementType,
      quantity: data.quantity,
      reference_type: data.referenceType || null,
      reference_id: data.referenceId || null,
      description: data.description || null,
      user_id: data.userId,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

module.exports = {
  listWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  listInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  listMovements,
  createMovement
};
