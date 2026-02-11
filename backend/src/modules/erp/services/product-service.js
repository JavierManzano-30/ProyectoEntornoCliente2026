const { pool } = require('../../../config/db');
const { generateId } = require('../../../utils/id');

async function listProducts(companyId, { filters, limit, offset }) {
  const values = [];
  const clauses = [];

  if (companyId) {
    values.push(companyId);
    clauses.push(`company_id = $${values.length}`);
  }
  if (filters.status) {
    values.push(filters.status);
    clauses.push(`status = $${values.length}`);
  }
  if (filters.categoryId) {
    values.push(filters.categoryId);
    clauses.push(`category_id = $${values.length}`);
  }
  if (filters.search) {
    values.push(`%${filters.search}%`);
    clauses.push(`(name ILIKE $${values.length} OR product_code ILIKE $${values.length})`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM erp_products ${where}`,
    values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const rows = await pool.query(
    `SELECT * FROM erp_products ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return { rows: rows.rows, totalItems };
}

async function getProductById(companyId, id) {
  const values = [id];
  let query = 'SELECT * FROM erp_products WHERE id = $1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id = $2`;
  }
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function createProduct(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_prod');
  const result = await pool.query(
    `INSERT INTO erp_products
      (id, company_id, product_code, name, description, category_id, cost_price, sale_price, profit_margin, unit_of_measure, status, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [id, companyId, data.productCode, data.name, data.description || null, data.categoryId || null,
     data.costPrice, data.salePrice, data.profitMargin || null, data.unitOfMeasure || null,
     data.status, now, now]
  );
  return result.rows[0];
}

async function updateProduct(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.productCode, data.name, data.description || null, data.categoryId || null,
    data.costPrice, data.salePrice, data.profitMargin || null, data.unitOfMeasure || null,
    data.status, now, id
  ];
  let query = `UPDATE erp_products SET
    product_code=$1, name=$2, description=$3, category_id=$4,
    cost_price=$5, sale_price=$6, profit_margin=$7, unit_of_measure=$8,
    status=$9, updated_at=$10
    WHERE id=$11`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteProduct(companyId, id) {
  const values = [id];
  let query = 'DELETE FROM erp_products WHERE id=$1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$2`;
  }
  query += ' RETURNING id';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function listCategories(companyId, { limit, offset }) {
  const values = [];
  const clauses = [];
  if (companyId) {
    values.push(companyId);
    clauses.push(`company_id = $${values.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM erp_product_categories ${where}`,
    values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const rows = await pool.query(
    `SELECT * FROM erp_product_categories ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return { rows: rows.rows, totalItems };
}

async function createCategory(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_cat');
  const result = await pool.query(
    `INSERT INTO erp_product_categories (id, company_id, name, description, is_active, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [id, companyId, data.name, data.description || null, data.isActive !== false, now, now]
  );
  return result.rows[0];
}

async function updateCategory(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [data.name, data.description || null, data.isActive !== false, now, id];
  let query = `UPDATE erp_product_categories SET name=$1, description=$2, is_active=$3, updated_at=$4 WHERE id=$5`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteCategory(companyId, id) {
  const values = [id];
  let query = 'DELETE FROM erp_product_categories WHERE id=$1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$2`;
  }
  query += ' RETURNING id';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
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
