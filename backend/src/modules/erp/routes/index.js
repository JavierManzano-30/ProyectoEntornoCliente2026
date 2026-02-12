const express = require('express');
const { requireAuth } = require('../../../middlewares/auth');

const accounting = require('../controllers/accounting-controller');
const products = require('../controllers/product-controller');
const inventory = require('../controllers/inventory-controller');
const purchases = require('../controllers/purchase-controller');
const sales = require('../controllers/sales-controller');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'erp', status: 'ok' } });
});

router.use(requireAuth);

// Rutas de Contabilidad
router.get('/accounting/chart-of-accounts', accounting.getChartOfAccounts);
router.get('/accounting/journal-entries', accounting.getJournalEntries);
router.get('/accounting/accounts/:id', accounting.getAccountById);
router.post('/accounting/accounts', accounting.createAccount);
router.put('/accounting/accounts/:id', accounting.updateAccount);

// Rutas de Productos
router.get('/products', products.listProducts);
router.post('/products', products.createProduct);
router.get('/products/:id', products.getProduct);
router.put('/products/:id', products.updateProduct);
router.delete('/products/:id', products.deleteProduct);

router.get('/categories', products.listCategories);
router.post('/categories', products.createCategory);
router.put('/categories/:id', products.updateCategory);
router.delete('/categories/:id', products.deleteCategory);

router.get('/warehouses', inventory.listWarehouses);
router.post('/warehouses', inventory.createWarehouse);
router.put('/warehouses/:id', inventory.updateWarehouse);
router.delete('/warehouses/:id', inventory.deleteWarehouse);

router.get('/inventory', inventory.listInventory);
router.get('/inventory/:id', inventory.getInventoryItem);
router.post('/inventory', inventory.createInventoryItem);
router.put('/inventory/:id', inventory.updateInventoryItem);

router.get('/movements', inventory.listMovements);
router.post('/movements', inventory.createMovement);

router.get('/suppliers', purchases.listSuppliers);
router.post('/suppliers', purchases.createSupplier);
router.get('/suppliers/:id', purchases.getSupplier);
router.put('/suppliers/:id', purchases.updateSupplier);
router.delete('/suppliers/:id', purchases.deleteSupplier);

router.get('/purchase-orders', purchases.listPurchaseOrders);
router.post('/purchase-orders', purchases.createPurchaseOrder);
router.get('/purchase-orders/:id', purchases.getPurchaseOrder);
router.put('/purchase-orders/:id', purchases.updatePurchaseOrder);
router.delete('/purchase-orders/:id', purchases.deletePurchaseOrder);
router.post('/purchase-orders/:orderId/items', purchases.addPurchaseItem);
router.put('/purchase-items/:id', purchases.updatePurchaseItem);
router.delete('/purchase-items/:id', purchases.deletePurchaseItem);

router.get('/purchase-invoices', purchases.listPurchaseInvoices);
router.post('/purchase-invoices', purchases.createPurchaseInvoice);
router.put('/purchase-invoices/:id', purchases.updatePurchaseInvoice);

router.get('/sales-orders', sales.listSalesOrders);
router.post('/sales-orders', sales.createSalesOrder);
router.get('/sales-orders/:id', sales.getSalesOrder);
router.put('/sales-orders/:id', sales.updateSalesOrder);
router.delete('/sales-orders/:id', sales.deleteSalesOrder);
router.post('/sales-orders/:orderId/items', sales.addSalesItem);
router.put('/sales-items/:id', sales.updateSalesItem);
router.delete('/sales-items/:id', sales.deleteSalesItem);

router.get('/invoices', sales.listInvoices);
router.post('/invoices', sales.createInvoice);
router.get('/invoices/:id', sales.getInvoice);
router.put('/invoices/:id', sales.updateInvoice);

module.exports = router;
