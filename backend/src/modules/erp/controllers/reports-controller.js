const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

function resolveCompanyId(req) {
  return (
    req.user?.companyId
    || req.user?.company_id
    || req.headers['x-company-id']
    || req.query.companyId
    || req.query.company_id
    || null
  );
}

function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toMonthKey(value) {
  const date = toDate(value);
  if (!date) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function calculateChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

async function getFinancialKPIs(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const [salesInvoicesRs, purchaseInvoicesRs, salesOrdersRs, inventoryRs, productsRs] = await Promise.all([
      supabase.from('erp_invoices').select('*').eq('company_id', companyId),
      supabase.from('erp_purchase_invoices').select('*').eq('company_id', companyId),
      supabase.from('erp_sales_orders').select('*').eq('company_id', companyId),
      supabase.from('erp_inventory').select('*').eq('company_id', companyId),
      supabase.from('erp_products').select('id,cost_price').eq('company_id', companyId)
    ]);

    const firstError = [
      salesInvoicesRs.error,
      purchaseInvoicesRs.error,
      salesOrdersRs.error,
      inventoryRs.error,
      productsRs.error
    ].find(Boolean);

    if (firstError) {
      return res.status(500).json(envelopeError('DATABASE_ERROR', 'Failed to build ERP KPIs', firstError.message));
    }

    const salesInvoices = salesInvoicesRs.data || [];
    const purchaseInvoices = purchaseInvoicesRs.data || [];
    const salesOrders = salesOrdersRs.data || [];
    const inventory = inventoryRs.data || [];
    const products = productsRs.data || [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const salesMonth = (monthKey) => salesInvoices.reduce((sum, row) => {
      const status = String(row.status || '').toLowerCase();
      if (status === 'voided' || status === 'draft') return sum;
      if (toMonthKey(row.issue_date) !== monthKey) return sum;
      return sum + toNumber(row.total);
    }, 0);

    const purchaseMonth = (monthKey) => purchaseInvoices.reduce((sum, row) => {
      const status = String(row.status || '').toLowerCase();
      if (status === 'voided') return sum;
      if (toMonthKey(row.received_date) !== monthKey) return sum;
      return sum + toNumber(row.total);
    }, 0);

    const currentRevenue = salesMonth(currentMonthKey);
    const previousRevenue = salesMonth(previousMonthKey);
    const currentExpenses = purchaseMonth(currentMonthKey);
    const previousExpenses = purchaseMonth(previousMonthKey);

    const paidSalesCash = salesInvoices.reduce((sum, row) => (
      String(row.status || '').toLowerCase() === 'paid' ? sum + toNumber(row.total) : sum
    ), 0);
    const paidPurchaseCash = purchaseInvoices.reduce((sum, row) => (
      String(row.status || '').toLowerCase() === 'paid' ? sum + toNumber(row.total) : sum
    ), 0);

    const previousPaidSalesCash = salesInvoices.reduce((sum, row) => {
      if (String(row.status || '').toLowerCase() !== 'paid') return sum;
      const paidDate = toDate(row.paid_date);
      if (!paidDate || paidDate >= currentMonthStart) return sum;
      return sum + toNumber(row.total);
    }, 0);

    const previousPaidPurchaseCash = purchaseInvoices.reduce((sum, row) => {
      if (String(row.status || '').toLowerCase() !== 'paid') return sum;
      const paidDate = toDate(row.paid_date);
      if (!paidDate || paidDate >= currentMonthStart) return sum;
      return sum + toNumber(row.total);
    }, 0);

    const receivables = salesInvoices.reduce((acc, row) => {
      const status = String(row.status || '').toLowerCase();
      if (status === 'paid' || status === 'voided') return acc;
      const total = toNumber(row.total);
      acc.current += total;
      const dueDate = toDate(row.due_date);
      if (dueDate && dueDate < now) acc.overdue += total;
      return acc;
    }, { current: 0, overdue: 0 });

    const payables = purchaseInvoices.reduce((acc, row) => {
      const status = String(row.status || '').toLowerCase();
      if (status === 'paid' || status === 'voided') return acc;
      const total = toNumber(row.total);
      acc.current += total;
      const dueDate = toDate(row.due_date);
      if (dueDate && dueDate < now) acc.overdue += total;
      return acc;
    }, { current: 0, overdue: 0 });

    const costByProductId = products.reduce((acc, row) => {
      acc[row.id] = toNumber(row.cost_price);
      return acc;
    }, {});

    const inventoryValue = inventory.reduce((sum, row) => {
      const quantity = toNumber(row.quantity_available);
      const cost = toNumber(costByProductId[row.product_id]);
      return sum + (quantity * cost);
    }, 0);

    const inventoryTurnover = inventoryValue > 0 ? (currentRevenue * 12) / inventoryValue : 0;

    const orders = salesOrders.reduce((acc, row) => {
      const status = String(row.status || '').toLowerCase();
      if (status === 'delivered') acc.completed += 1;
      else if (!new Set(['canceled', 'cancelled']).has(status)) acc.pending += 1;
      return acc;
    }, { pending: 0, completed: 0 });

    return res.json(
      envelopeSuccess({
        revenue: {
          current: round(currentRevenue),
          previous: round(previousRevenue),
          change: round(calculateChange(currentRevenue, previousRevenue))
        },
        expenses: {
          current: round(currentExpenses),
          previous: round(previousExpenses),
          change: round(calculateChange(currentExpenses, previousExpenses))
        },
        profit: {
          current: round(currentRevenue - currentExpenses),
          previous: round(previousRevenue - previousExpenses),
          change: round(calculateChange(currentRevenue - currentExpenses, previousRevenue - previousExpenses))
        },
        cash: {
          current: round(paidSalesCash - paidPurchaseCash),
          previous: round(previousPaidSalesCash - previousPaidPurchaseCash),
          change: round(calculateChange(paidSalesCash - paidPurchaseCash, previousPaidSalesCash - previousPaidPurchaseCash))
        },
        receivables: {
          current: round(receivables.current),
          overdue: round(receivables.overdue)
        },
        payables: {
          current: round(payables.current),
          overdue: round(payables.overdue)
        },
        inventory: {
          value: round(inventoryValue),
          turnover: round(inventoryTurnover, 1)
        },
        orders
      })
    );
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getFinancialKPIs
};
