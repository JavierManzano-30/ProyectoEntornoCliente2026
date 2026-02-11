const { pool } = require('../../../config/db');
const { generateId } = require('../../../utils/id');

async function listWarehouses(companyId, { limit, offset }) {
  const values = [];
  const clauses = [];
  if (companyId) {
    values.push(companyId);
    clauses.push(`company_id = $${values.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM erp_warehouses ${where}`, values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const rows = await pool.query(
    `SELECT * FROM erp_warehouses ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return { rows: rows.rows, totalItems };
}

async function createWarehouse(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_wh');
  const result = await pool.query(
    `INSERT INTO erp_warehouses (id, company_id, name, location, total_capacity, responsible_id, type, is_active, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [id, companyId, data.name, data.location || null, data.totalCapacity || null,
     data.responsibleId || null, data.type || 'main', data.isActive !== false, now, now]
  );
  return result.rows[0];
}

async function updateWarehouse(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.name, data.location || null, data.totalCapacity || null,
    data.responsibleId || null, data.type || 'main', data.isActive !== false, now, id
  ];
  let query = `UPDATE erp_warehouses SET name=$1, location=$2, total_capacity=$3, responsible_id=$4, type=$5, is_active=$6, updated_at=$7 WHERE id=$8`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteWarehouse(companyId, id) {
  const values = [id];
  let query = 'DELETE FROM erp_warehouses WHERE id=$1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$2`;
  }
  query += ' RETURNING id';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function listInventory(companyId, { filters, limit, offset }) {
  const values = [];
  const clauses = [];
  if (companyId) {
    values.push(companyId);
    clauses.push(`company_id = $${values.length}`);
  }
  if (filters.warehouseId) {
    values.push(filters.warehouseId);
    clauses.push(`warehouse_id = $${values.length}`);
  }
  if (filters.productId) {
    values.push(filters.productId);
    clauses.push(`product_id = $${values.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM erp_inventory ${where}`, values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const rows = await pool.query(
    `SELECT * FROM erp_inventory ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return { rows: rows.rows, totalItems };
}

async function getInventoryById(companyId, id) {
  const values = [id];
  let query = 'SELECT * FROM erp_inventory WHERE id = $1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id = $2`;
  }
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function createInventoryItem(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_inv');
  const result = await pool.query(
    `INSERT INTO erp_inventory
      (id, company_id, product_id, warehouse_id, quantity_available, quantity_reserved, minimum_quantity, maximum_quantity, last_movement_at, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [id, companyId, data.productId, data.warehouseId,
     data.quantityAvailable || 0, data.quantityReserved || 0,
     data.minimumQuantity || null, data.maximumQuantity || null,
     null, now, now]
  );
  return result.rows[0];
}

async function updateInventoryItem(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.productId, data.warehouseId,
    data.quantityAvailable || 0, data.quantityReserved || 0,
    data.minimumQuantity || null, data.maximumQuantity || null,
    now, id
  ];
  let query = `UPDATE erp_inventory SET
    product_id=$1, warehouse_id=$2, quantity_available=$3, quantity_reserved=$4,
    minimum_quantity=$5, maximum_quantity=$6, updated_at=$7
    WHERE id=$8`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function listMovements(companyId, { filters, limit, offset }) {
  const values = [];
  const clauses = [];
  if (companyId) {
    values.push(companyId);
    clauses.push(`company_id = $${values.length}`);
  }
  if (filters.productId) {
    values.push(filters.productId);
    clauses.push(`product_id = $${values.length}`);
  }
  if (filters.warehouseId) {
    values.push(filters.warehouseId);
    clauses.push(`warehouse_id = $${values.length}`);
  }
  if (filters.movementType) {
    values.push(filters.movementType);
    clauses.push(`movement_type = $${values.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM erp_inventory_movements ${where}`, values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const rows = await pool.query(
    `SELECT * FROM erp_inventory_movements ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return { rows: rows.rows, totalItems };
}

async function createMovement(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_mov');
  const result = await pool.query(
    `INSERT INTO erp_inventory_movements
      (id, company_id, product_id, warehouse_id, movement_type, quantity, reference_type, reference_id, description, user_id, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [id, companyId, data.productId, data.warehouseId, data.movementType,
     data.quantity, data.referenceType || null, data.referenceId || null,
     data.description || null, data.userId, now, now]
  );
  return result.rows[0];
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
