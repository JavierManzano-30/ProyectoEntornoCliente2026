const supabase = require('../../../config/supabase');
const { generateId } = require('../../../utils/id');

async function listProducts(companyId, { filters, limit, offset }) {
  let query = supabase.from('erp_products').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId);
  if (filters.search) query = query.or(`name.ilike.%${filters.search}%,product_code.ilike.%${filters.search}%`);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function getProductById(companyId, id) {
  let query = supabase.from('erp_products').select('*').eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createProduct(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_prod');
  const { data: row, error } = await supabase
    .from('erp_products')
    .insert([{
      id,
      company_id: companyId,
      product_code: data.productCode,
      name: data.name,
      description: data.description || null,
      category_id: data.categoryId || null,
      cost_price: data.costPrice,
      sale_price: data.salePrice,
      profit_margin: data.profitMargin || null,
      unit_of_measure: data.unitOfMeasure || null,
      status: data.status,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateProduct(companyId, id, data) {
  const now = new Date().toISOString();
  let query = supabase
    .from('erp_products')
    .update({
      product_code: data.productCode,
      name: data.name,
      description: data.description || null,
      category_id: data.categoryId || null,
      cost_price: data.costPrice,
      sale_price: data.salePrice,
      profit_margin: data.profitMargin || null,
      unit_of_measure: data.unitOfMeasure || null,
      status: data.status,
      updated_at: now
    })
    .eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data: row, error } = await query.select('*').maybeSingle();
  if (error) throw error;
  return row || null;
}

async function deleteProduct(companyId, id) {
  let query = supabase.from('erp_products').delete().eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query.select('id').maybeSingle();
  if (error) throw error;
  return data || null;
}

async function listCategories(companyId, { limit, offset }) {
  let query = supabase.from('erp_product_categories').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function createCategory(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_cat');
  const { data: row, error } = await supabase
    .from('erp_product_categories')
    .insert([{
      id,
      company_id: companyId,
      name: data.name,
      description: data.description || null,
      is_active: data.isActive !== false,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateCategory(companyId, id, data) {
  const now = new Date().toISOString();
  let query = supabase
    .from('erp_product_categories')
    .update({
      name: data.name,
      description: data.description || null,
      is_active: data.isActive !== false,
      updated_at: now
    })
    .eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data: row, error } = await query.select('*').maybeSingle();
  if (error) throw error;
  return row || null;
}

async function deleteCategory(companyId, id) {
  let query = supabase.from('erp_product_categories').delete().eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query.select('id').maybeSingle();
  if (error) throw error;
  return data || null;
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
