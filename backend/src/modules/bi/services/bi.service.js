const supabase = require('../../../config/supabase');

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const sumBy = (rows, field) =>
  (rows || []).reduce((acc, row) => acc + toNumber(row?.[field]), 0);

const average = (sum, count) => (count > 0 ? sum / count : 0);

const calcPercentChange = (current, previous) => {
  if (!previous) return { change: 0, trend: 'up' };
  const diff = ((current - previous) / previous) * 100;
  return { change: Number(diff.toFixed(1)), trend: diff >= 0 ? 'up' : 'down' };
};

const calcPointChange = (current, previous) => {
  if (previous === null || previous === undefined) return { change: 0, trend: 'up' };
  const diff = current - previous;
  return { change: Number(diff.toFixed(1)), trend: diff >= 0 ? 'up' : 'down' };
};

const getPeriodBounds = (period = 'mes') => {
  const now = new Date();
  let start;

  switch (period) {
    case 'dia':
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      break;
    case 'semana':
      start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    case 'trimestre': {
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    }
    case 'ano':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case 'mes':
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  const end = now;
  const duration = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - duration);

  return { start, end, prevStart, prevEnd };
};

const toDateString = (date) => date.toISOString().slice(0, 10);

const buildMonthBuckets = (endDate, months = 6) => {
  const buckets = [];
  const start = new Date(endDate.getFullYear(), endDate.getMonth() - (months - 1), 1);

  for (let i = 0; i < months; i += 1) {
    const current = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${current.getFullYear()}-${current.getMonth() + 1}`;
    const label = current
      .toLocaleDateString('es-ES', { month: 'short' })
      .replace('.', '')
      .replace(/^\w/, (char) => char.toUpperCase());
    buckets.push({ key, label, ingresos: 0, costes: 0 });
  }

  return buckets;
};

async function getKPIs(companyId, period = 'mes') {
  const { start, end, prevStart, prevEnd } = getPeriodBounds(period);
  const startDate = toDateString(start);
  const endDate = toDateString(end);
  const prevStartDate = toDateString(prevStart);
  const prevEndDate = toDateString(prevEnd);

  const [
    { data: salesCurrent, error: salesError },
    { data: salesPrevious, error: salesPrevError },
    { data: purchasesCurrent, error: purchasesError },
    { data: purchasesPrevious, error: purchasesPrevError },
    { count: totalClients, error: clientsError },
    { data: currentClients, error: currentClientsError },
    { data: previousClients, error: previousClientsError },
    { data: currentOpps, error: currentOppsError },
    { data: previousOpps, error: previousOppsError }
  ] = await Promise.all([
    supabase
      .from('erp_sales_orders')
      .select('total, order_date')
      .eq('company_id', companyId)
      .gte('order_date', startDate)
      .lte('order_date', endDate),
    supabase
      .from('erp_sales_orders')
      .select('total')
      .eq('company_id', companyId)
      .gte('order_date', prevStartDate)
      .lte('order_date', prevEndDate),
    supabase
      .from('erp_purchase_orders')
      .select('total, order_date')
      .eq('company_id', companyId)
      .gte('order_date', startDate)
      .lte('order_date', endDate),
    supabase
      .from('erp_purchase_orders')
      .select('total')
      .eq('company_id', companyId)
      .gte('order_date', prevStartDate)
      .lte('order_date', prevEndDate),
    supabase
      .from('crm_clients')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('type', 'customer'),
    supabase
      .from('crm_clients')
      .select('id')
      .eq('company_id', companyId)
      .eq('type', 'customer')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString()),
    supabase
      .from('crm_clients')
      .select('id')
      .eq('company_id', companyId)
      .eq('type', 'customer')
      .gte('created_at', prevStart.toISOString())
      .lte('created_at', prevEnd.toISOString()),
    supabase
      .from('crm_opportunities')
      .select('probability')
      .eq('company_id', companyId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString()),
    supabase
      .from('crm_opportunities')
      .select('probability')
      .eq('company_id', companyId)
      .gte('created_at', prevStart.toISOString())
      .lte('created_at', prevEnd.toISOString())
  ]);

  if (salesError || salesPrevError || purchasesError || purchasesPrevError || clientsError) {
    console.error('[BI KPIs] Database error:', {
      salesError,
      salesPrevError,
      purchasesError,
      purchasesPrevError,
      clientsError
    });
  }

  if (currentClientsError || previousClientsError || currentOppsError || previousOppsError) {
    console.error('[BI KPIs] Supplemental data error:', {
      currentClientsError,
      previousClientsError,
      currentOppsError,
      previousOppsError
    });
  }

  const ventasActual = sumBy(salesCurrent, 'total');
  const ventasPrevias = sumBy(salesPrevious, 'total');
  const costesActual = sumBy(purchasesCurrent, 'total');
  const costesPrevios = sumBy(purchasesPrevious, 'total');
  const beneficioActual = ventasActual - costesActual;
  const beneficioPrevio = ventasPrevias - costesPrevias;

  const ticketActual = average(ventasActual, salesCurrent?.length || 0);
  const ticketPrevio = average(ventasPrevias, salesPrevious?.length || 0);

  const conversionActual = average(
    sumBy(currentOpps, 'probability'),
    currentOpps?.length || 0
  );
  const conversionPrevia = average(
    sumBy(previousOpps, 'probability'),
    previousOpps?.length || 0
  );

  const nuevosClientesActual = currentClients?.length || 0;
  const nuevosClientesPrevio = previousClients?.length || 0;
  const clientesChange = calcPercentChange(nuevosClientesActual, nuevosClientesPrevio);

  return {
    ingresosTotales: {
      value: Number(ventasActual.toFixed(2)),
      ...calcPercentChange(ventasActual, ventasPrevias)
    },
    costesOperativos: {
      value: Number(costesActual.toFixed(2)),
      ...calcPercentChange(costesActual, costesPrevios)
    },
    beneficioNeto: {
      value: Number(beneficioActual.toFixed(2)),
      ...calcPercentChange(beneficioActual, beneficioPrevio)
    },
    clientesActivos: {
      value: totalClients || 0,
      change: clientesChange.change,
      trend: clientesChange.trend
    },
    tasaConversion: {
      value: Number(conversionActual.toFixed(1)),
      ...calcPointChange(conversionActual, conversionPrevia)
    },
    ticketMedio: {
      value: Number(ticketActual.toFixed(2)),
      ...calcPercentChange(ticketActual, ticketPrevio)
    }
  };
}

async function listReports(companyId) {
  const { data: reports, error } = await supabase
    .from('bi_reports')
    .select('id, name, description, module, owner_id, company_id, created_at')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!reports || reports.length === 0) return [];

  const reportIds = reports.map((report) => report.id);
  const { data: runs, error: runsError } = await supabase
    .from('bi_report_runs')
    .select('id, report_id, status, output_path, started_at, finished_at')
    .in('report_id', reportIds)
    .order('started_at', { ascending: false });

  if (runsError) {
    console.error('[BI Reports] Runs error:', runsError);
    return reports;
  }

  const latestRunByReport = new Map();
  (runs || []).forEach((run) => {
    if (!latestRunByReport.has(run.report_id)) {
      latestRunByReport.set(run.report_id, run);
    }
  });

  return reports.map((report) => ({
    ...report,
    last_run: latestRunByReport.get(report.id) || null
  }));
}

async function createReport(companyId, ownerId, payload) {
  const { name, description, module, queryDefinition } = payload;
  const { data, error } = await supabase
    .from('bi_reports')
    .insert([
      {
        name,
        description: description || null,
        module: module || null,
        query_definition: queryDefinition,
        owner_id: ownerId,
        company_id: companyId
      }
    ])
    .select('id, name, description, module, owner_id, company_id, created_at')
    .single();

  if (error) throw error;
  return data;
}

async function runReport(companyId, reportId) {
  const { data: report, error: reportError } = await supabase
    .from('bi_reports')
    .select('id, name, query_definition')
    .eq('id', reportId)
    .eq('company_id', companyId)
    .maybeSingle();

  if (reportError) throw reportError;
  if (!report) return null;

  const startedAt = new Date();
  const { data: run, error: runError } = await supabase
    .from('bi_report_runs')
    .insert([
      {
        report_id: reportId,
        status: 'completed',
        started_at: startedAt.toISOString(),
        finished_at: new Date().toISOString()
      }
    ])
    .select('id, report_id, status, started_at, finished_at')
    .single();

  if (runError) throw runError;

  return {
    report,
    run
  };
}

async function getDashboard(companyId, period = 'mes') {
  const { start, end } = getPeriodBounds(period);
  const startDate = toDateString(start);
  const endDate = toDateString(end);

  const chartBuckets = buildMonthBuckets(end, 6);
  const chartStart = new Date(end.getFullYear(), end.getMonth() - 5, 1);
  const chartStartDate = toDateString(chartStart);
  const chartEndDate = toDateString(end);

  const [
    { data: salesForChart, error: salesChartError },
    { data: purchasesForChart, error: purchasesChartError },
    { data: salesOrders, error: salesOrdersError },
    { data: clients, error: clientsError },
    { data: opportunities, error: opportunitiesError }
  ] = await Promise.all([
    supabase
      .from('erp_sales_orders')
      .select('total, order_date')
      .eq('company_id', companyId)
      .gte('order_date', chartStartDate)
      .lte('order_date', chartEndDate),
    supabase
      .from('erp_purchase_orders')
      .select('total, order_date')
      .eq('company_id', companyId)
      .gte('order_date', chartStartDate)
      .lte('order_date', chartEndDate),
    supabase
      .from('erp_sales_orders')
      .select('id, order_date')
      .eq('company_id', companyId)
      .gte('order_date', startDate)
      .lte('order_date', endDate),
    supabase
      .from('crm_clients')
      .select('id, city')
      .eq('company_id', companyId),
    supabase
      .from('crm_opportunities')
      .select('client_id, estimated_value')
      .eq('company_id', companyId)
  ]);

  if (salesChartError || purchasesChartError || salesOrdersError) {
    console.error('[BI Dashboard] Sales/purchases error:', {
      salesChartError,
      purchasesChartError,
      salesOrdersError
    });
  }

  if (clientsError || opportunitiesError) {
    console.error('[BI Dashboard] Detail data error:', {
      clientsError,
      opportunitiesError
    });
  }

  const monthIndex = new Map(chartBuckets.map((bucket) => [bucket.key, bucket]));
  (salesForChart || []).forEach((order) => {
    if (!order.order_date) return;
    const date = new Date(order.order_date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const bucket = monthIndex.get(key);
    if (!bucket) return;
    bucket.ingresos += toNumber(order.total);
  });
  (purchasesForChart || []).forEach((order) => {
    if (!order.order_date) return;
    const date = new Date(order.order_date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const bucket = monthIndex.get(key);
    if (!bucket) return;
    bucket.costes += toNumber(order.total);
  });

  const salesOrderIds = new Set((salesOrders || []).map((order) => order.id));
  let filteredItems = [];
  if (salesOrderIds.size > 0) {
    const { data: items, error: salesItemsError } = await supabase
      .from('erp_sales_items')
      .select('sales_order_id, product_id, quantity, subtotal')
      .eq('company_id', companyId)
      .in('sales_order_id', Array.from(salesOrderIds));

    if (salesItemsError) {
      console.error('[BI Dashboard] Sales items error:', salesItemsError);
    } else {
      filteredItems = items || [];
    }
  }

  const productIds = Array.from(new Set(filteredItems.map((item) => item.product_id)));
  let productMap = new Map();
  let categoryMap = new Map();
  if (productIds.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from('erp_products')
      .select('id, name, category_id')
      .eq('company_id', companyId)
      .in('id', productIds);

    if (productsError) {
      console.error('[BI Dashboard] Products error:', productsError);
    } else {
      productMap = new Map((products || []).map((product) => [product.id, product]));
      const categoryIds = Array.from(
        new Set((products || []).map((product) => product.category_id).filter(Boolean))
      );
      if (categoryIds.length > 0) {
        const { data: categories, error: categoriesError } = await supabase
          .from('erp_product_categories')
          .select('id, name')
          .eq('company_id', companyId)
          .in('id', categoryIds);

        if (categoriesError) {
          console.error('[BI Dashboard] Categories error:', categoriesError);
        } else {
          categoryMap = new Map((categories || []).map((cat) => [cat.id, cat.name]));
        }
      }
    }
  }

  const categoryTotals = new Map();
  const productTotals = new Map();

  filteredItems.forEach((item) => {
    const product = productMap.get(item.product_id);
    const categoryName = product?.category_id ? categoryMap.get(product.category_id) : null;
    const categoryLabel = categoryName || 'Sin categoría';
    const subtotal = toNumber(item.subtotal);
    const quantity = toNumber(item.quantity);

    categoryTotals.set(categoryLabel, (categoryTotals.get(categoryLabel) || 0) + subtotal);
    const productLabel = product?.name || 'Producto';
    const currentProduct = productTotals.get(productLabel) || { ventas: 0, ingresos: 0 };
    productTotals.set(productLabel, {
      ventas: currentProduct.ventas + quantity,
      ingresos: currentProduct.ingresos + subtotal
    });
  });

  const totalVentasCategoria = Array.from(categoryTotals.values()).reduce((acc, value) => acc + value, 0);
  const ventasPorCategoria = Array.from(categoryTotals.entries())
    .map(([categoria, valor]) => ({
      categoria,
      valor: Number(valor.toFixed(2)),
      porcentaje: totalVentasCategoria
        ? Number(((valor / totalVentasCategoria) * 100).toFixed(1))
        : 0
    }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 6);

  const topProductos = Array.from(productTotals.entries())
    .map(([producto, data]) => ({
      producto,
      ventas: Number(data.ventas.toFixed(0)),
      ingresos: Number(data.ingresos.toFixed(2))
    }))
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 5);

  const clientCityMap = new Map();
  const clientIdToCity = new Map();

  (clients || []).forEach((client) => {
    const city = client.city?.trim() || 'Sin región';
    const entry = clientCityMap.get(city) || { clientes: 0, valor: 0 };
    entry.clientes += 1;
    clientCityMap.set(city, entry);
    clientIdToCity.set(client.id, city);
  });

  (opportunities || []).forEach((opp) => {
    const city = clientIdToCity.get(opp.client_id);
    if (!city) return;
    const entry = clientCityMap.get(city) || { clientes: 0, valor: 0 };
    entry.valor += toNumber(opp.estimated_value);
    clientCityMap.set(city, entry);
  });

  const clientesPorRegion = Array.from(clientCityMap.entries())
    .map(([region, data]) => ({
      region,
      clientes: data.clientes,
      valor: Number(data.valor.toFixed(2))
    }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 6);

  return {
    ingresosPorMes: chartBuckets.map((bucket) => ({
      mes: bucket.label,
      ingresos: Number(bucket.ingresos.toFixed(2)),
      costes: Number(bucket.costes.toFixed(2))
    })),
    ventasPorCategoria,
    clientesPorRegion,
    topProductos
  };
}

async function listAlerts(companyId) {
  const { data, error } = await supabase
    .from('bi_alerts')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[BI Alerts] Database error:', error);
    return [];
  }
  return data || [];
}

async function listDatasets(companyId) {
  const { data, error } = await supabase
    .from('bi_datasets')
    .select('*')
    .order('last_refresh', { ascending: false });

  if (error) {
    console.error('[BI Datasets] Database error:', error);
    return [];
  }
  return data || [];
}

module.exports = {
  getKPIs,
  listReports,
  createReport,
  runReport,
  getDashboard,
  listAlerts,
  listDatasets
};
