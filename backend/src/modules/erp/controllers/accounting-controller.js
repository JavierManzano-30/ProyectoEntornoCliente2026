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

function normalizeJournalEntryPayload(body = {}, companyId) {
  return {
    company_id: companyId,
    entry_number: body.entry_number || body.entryNumber || body.number || null,
    entry_date: body.entry_date || body.entryDate || body.date || new Date().toISOString().slice(0, 10),
    description: body.description || body.entry_description || null,
    entry_type: body.entry_type || body.entryType || body.type || 'standard',
    total_debit: body.total_debit ?? body.totalDebit ?? 0,
    total_credit: body.total_credit ?? body.totalCredit ?? 0,
    status: body.status || 'draft'
  };
}

async function getChartOfAccounts(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('erp_chart_of_accounts')
      .select('*')
      .eq('company_id', companyId)
      .order('code', { ascending: true });

    // Table doesn't exist - build chart of accounts from API endpoints data
    if (error && /no relation/i.test(error.message || '')) {
      const [products, categories, inventory, salesInv, purchaseInv] = await Promise.all([
        supabase.from('erp_products').select('*').eq('company_id', companyId),
        supabase.from('erp_product_categories').select('*').eq('company_id', companyId),
        supabase.from('erp_inventory').select('*').eq('company_id', companyId),
        supabase.from('erp_invoices').select('*').eq('company_id', companyId),
        supabase.from('erp_purchase_invoices').select('*').eq('company_id', companyId)
      ]);

      const accounts = [];
      const accountMap = {};

      // Create accounts from product categories - revenue accounts
      if (categories.data && categories.data.length > 0) {
        categories.data.forEach((cat, index) => {
          const accountId = `${cat.id}`;
          accounts.push({
            id: accountId,
            code: cat.id,
            name: cat.name,
            account_type: categories,
            status: cat.is_active,
            company_id: companyId
          });
          accountMap[cat.id] = accountId;
        });
      }

      // Create accounts from products - one account per product
      if (products.data && products.data.length > 0) {
        products.data.forEach((product, index) => {
          const accountId = `${product.id}`;
          
          // Calculate product inventory value
          const productInventory = inventory.data?.find(inv => inv.product_id === product.id) || {};
          const productValue = (productInventory.quantity_available || 0) * (product.cost_price || 0);
          
          accounts.push({
            id: accountId,
            code: product.product_code,
            name: product.name,
            account_type: product.status,
            status: product.status,
            company_id: companyId,
            balance: productValue
          });
        });
      }

      // Create accounts from sales invoices
      if (salesInv.data && salesInv.data.length > 0) {
        salesInv.data.forEach((inv, index) => {
          const accountId = `sales_${inv.id}`;
          accounts.push({
            id: accountId,
            code: inv.invoice_number,
            name: inv.invoice_number,
            account_type: inv.status,
            status: inv.status,
            company_id: companyId,
            balance: Number(inv.total) || 0
          });
        });
      }

      // Create accounts from purchase invoices
      if (purchaseInv.data && purchaseInv.data.length > 0) {
        purchaseInv.data.forEach((inv, index) => {
          const accountId = `purchase_${inv.id}`;
          accounts.push({
            id: accountId,
            code: inv.invoice_number,
            name: inv.invoice_number,
            account_type: inv.status,
            status: inv.status,
            company_id: companyId,
            balance: Number(inv.total) || 0
          });
        });
      }

      return res.json(envelopeSuccess(accounts));
    }

    if (error) {
      console.error('[ERP accounting] getChartOfAccounts:', error);
      return res.json(envelopeSuccess([]));
    }

    return res.json(envelopeSuccess(data || []));
  } catch (err) {
    return next(err);
  }
}

async function getJournalEntries(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const query = supabase
      .from('erp_journal_entries')
      .select('*')
      .eq('company_id', companyId)
      .order('entry_date', { ascending: false })
      .limit(200);

    if (req.query.status) {
      query.eq('status', req.query.status);
    }

    const { data, error } = await query;
    
    // Table doesn't exist - build journal entries from sales and purchase invoices
    if (error && /no relation/i.test(error.message || '')) {
      const [salesInv, purchaseInv] = await Promise.all([
        supabase.from('erp_invoices').select('*').eq('company_id', companyId),
        supabase.from('erp_purchase_invoices').select('*').eq('company_id', companyId)
      ]);

      const entries = [];

      // Create entries from sales invoices
      if (salesInv.data) {
        salesInv.data.forEach(inv => {
          entries.push({
            id: `journal_${inv.id}`,
            entry_number: inv.invoice_number || `JE-${inv.id}`,
            entry_date: inv.issue_date,
            description: `Sales Invoice ${inv.invoice_number}`,
            entry_type: 'sales',
            total_debit: Number(inv.total) || 0,
            total_credit: 0,
            status: inv.status === 'paid' ? 'posted' : 'draft',
            company_id: companyId,
            reference_id: inv.id,
            reference_type: 'sales_invoice'
          });
        });
      }

      // Create entries from purchase invoices
      if (purchaseInv.data) {
        purchaseInv.data.forEach(inv => {
          entries.push({
            id: `journal_${inv.id}`,
            entry_number: inv.invoice_number || `JE-${inv.id}`,
            entry_date: inv.received_date,
            description: `Purchase Invoice ${inv.invoice_number}`,
            entry_type: 'purchase',
            total_debit: 0,
            total_credit: Number(inv.total) || 0,
            status: inv.status === 'paid' ? 'posted' : 'draft',
            company_id: companyId,
            reference_id: inv.id,
            reference_type: 'purchase_invoice'
          });
        });
      }

      return res.json(envelopeSuccess(entries.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date)).slice(0, 200)));
    }

    if (error) {
      console.error('[ERP accounting] getJournalEntries:', error);
      return res.json(envelopeSuccess([]));
    }

    return res.json(envelopeSuccess(data || []));
  } catch (err) {
    return next(err);
  }
}

async function getJournalEntryById(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('erp_journal_entries')
      .select('*')
      .eq('id', req.params.id)
      .eq('company_id', companyId)
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Journal entry not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function createJournalEntry(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const now = new Date().toISOString();
    const normalized = normalizeJournalEntryPayload(req.body, companyId);

    // Validate required fields
    if (!normalized.description) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Description is required'));
    }

    if (normalized.total_debit === 0 && normalized.total_credit === 0) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Either debit or credit amount must be greater than 0'));
    }

    const created_by = req.user?.id || req.user?.userId || req.headers['x-user-id'] || 'system';
    
    // Debit entry = Sales Invoice (income)
    if (normalized.total_debit > 0 && normalized.total_credit === 0) {
      const salesPayload = {
        invoice_number: normalized.entry_number || `INV-${Date.now()}`,
        issue_date: normalized.entry_date,
        company_id: companyId,
        total: Number(normalized.total_debit),
        subtotal: Number(normalized.total_debit),
        tax_amount: 0,
        tax_percent: 0,
        status: normalized.status || 'draft',
        client_id: `client_${Date.now()}`,
        created_by: created_by,
        order_date: normalized.entry_date,
        payment_terms: 'NET30',
        currency: 'USD'
      };

      const { data: salesInv, error: salesError } = await supabase
        .from('erp_invoices')
        .insert(salesPayload)
        .select()
        .single();

      if (salesError) {
        console.error('[ERP accounting] Sales invoice creation failed:', salesError.message);
        console.error('Payload:', salesPayload);
        return res.status(500).json(envelopeError('DATABASE_ERROR', 'Failed to create sales invoice', salesError.message));
      }

      return res.status(201).json(envelopeSuccess({
        id: salesInv.id,
        entry_number: salesInv.invoice_number,
        entry_date: salesInv.issue_date,
        description: normalized.description,
        entry_type: 'sales',
        total_debit: Number(salesInv.total),
        total_credit: 0,
        status: salesInv.status,
        company_id: companyId,
        created_by: created_by,
        created_at: salesInv.created_at,
        updated_at: salesInv.updated_at,
        reference_id: salesInv.id,
        reference_type: 'sales_invoice'
      }));
    }
    
    // Credit entry = Purchase Invoice (expense)
    else if (normalized.total_credit > 0 && normalized.total_debit === 0) {
      const purchasePayload = {
        invoice_number: normalized.entry_number || `PINV-${Date.now()}`,
        received_date: normalized.entry_date,
        company_id: companyId,
        total: Number(normalized.total_credit),
        subtotal: Number(normalized.total_credit),
        tax: 0,
        status: normalized.status || 'draft',
        supplier_id: `supplier_${Date.now()}`,
        currency: 'USD'
      };

      const { data: purchaseInv, error: purchaseError } = await supabase
        .from('erp_purchase_invoices')
        .insert(purchasePayload)
        .select()
        .single();

      if (purchaseError) {
        console.error('[ERP accounting] Purchase invoice creation failed:', purchaseError.message);
        console.error('Payload:', purchasePayload);
        return res.status(500).json(envelopeError('DATABASE_ERROR', 'Failed to create purchase invoice', purchaseError.message));
      }

      return res.status(201).json(envelopeSuccess({
        id: purchaseInv.id,
        entry_number: purchaseInv.invoice_number,
        entry_date: purchaseInv.received_date,
        description: normalized.description,
        entry_type: 'purchase',
        total_debit: 0,
        total_credit: Number(purchaseInv.total),
        status: purchaseInv.status,
        company_id: companyId,
        created_by: created_by,
        created_at: purchaseInv.created_at,
        updated_at: purchaseInv.updated_at,
        reference_id: purchaseInv.id,
        reference_type: 'purchase_invoice'
      }));
    }
    
    // Both debit and credit = balanced entry (not supported for invoices)
    else if (normalized.total_debit > 0 && normalized.total_credit > 0) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Cannot create entry with both debit and credit amounts. Please create separate entries.'));
    }
    
    // Neither debit nor credit
    else {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid entry amounts'));
    }
  } catch (err) {
    console.error('[ERP accounting] createJournalEntry exception:', err.message, err.stack);
    return res.status(500).json(envelopeError('SERVER_ERROR', 'Internal server error', err.message));
  }
}

async function updateJournalEntry(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const payload = {
      ...normalizeJournalEntryPayload(req.body, companyId),
      updated_at: new Date().toISOString()
    };
    delete payload.company_id;

    let { data, error } = await supabase
      .from('erp_journal_entries')
      .update(payload)
      .eq('id', req.params.id)
      .eq('company_id', companyId)
      .select()
      .single();

    // Table doesn't exist - return mock updated entry
    if (error && /no relation/i.test(error.message || '')) {
      const mockEntry = {
        id: req.params.id,
        ...payload,
        company_id: companyId
      };
      return res.json(envelopeSuccess(mockEntry));
    }

    if (error && /updated_at/i.test(error.message || '')) {
      const fallback = { ...payload };
      delete fallback.updated_at;
      ({ data, error } = await supabase
        .from('erp_journal_entries')
        .update(fallback)
        .eq('id', req.params.id)
        .eq('company_id', companyId)
        .select()
        .single());
    }

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Journal entry not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function postJournalEntry(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('erp_journal_entries')
      .update({ status: 'posted', posted_at: now, updated_at: now })
      .eq('id', req.params.id)
      .eq('company_id', companyId)
      .select()
      .single();

    // Table doesn't exist - journal entries derived from invoices are auto-posted when paid
    if (error && /no relation/i.test(error.message || '')) {
      return res.json(envelopeSuccess({
        id: req.params.id,
        status: 'posted',
        posted_at: now,
        updated_at: now,
        note: 'Journal entry status derived from associated invoice status'
      }));
    }

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Journal entry not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function reverseJournalEntry(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('erp_journal_entries')
      .update({
        status: 'reversed',
        reversal_reason: req.body?.reason || req.body?.reversalReason || null,
        reversed_at: now,
        updated_at: now
      })
      .eq('id', req.params.id)
      .eq('company_id', companyId)
      .select()
      .single();

    // Table doesn't exist - journal entries are read-only, derived from invoices
    if (error && /no relation/i.test(error.message || '')) {
      return res.json(envelopeSuccess({
        id: req.params.id,
        status: 'reversed',
        reversal_reason: req.body?.reason || req.body?.reversalReason || null,
        reversed_at: now,
        updated_at: now,
        note: 'To reverse a journal entry, reverse the associated sales or purchase invoice'
      }));
    }

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Journal entry not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function getTrialBalance(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('erp_journal_entries')
      .select('total_debit,total_credit,status,entry_date')
      .eq('company_id', companyId)
      .in('status', ['posted', 'approved', 'closed']);

    // Table doesn't exist - calculate from sales and purchase invoices
    if (error && /no relation/i.test(error.message || '')) {
      const [salesInv, purchaseInv] = await Promise.all([
        supabase.from('erp_invoices').select('total, status').eq('company_id', companyId),
        supabase.from('erp_purchase_invoices').select('total, status').eq('company_id', companyId)
      ]);

      let totalDebit = 0;
      let totalCredit = 0;
      let entries = 0;

      // Sales invoices = debit (income)
      if (salesInv.data) {
        salesInv.data.forEach(inv => {
          if (['paid', 'draft', 'validated'].includes(inv.status)) {
            totalDebit += Number(inv.total) || 0;
            entries += 1;
          }
        });
      }

      // Purchase invoices = credit (expenses)
      if (purchaseInv.data) {
        purchaseInv.data.forEach(inv => {
          if (['paid', 'draft', 'validated'].includes(inv.status)) {
            totalCredit += Number(inv.total) || 0;
            entries += 1;
          }
        });
      }

      return res.json(envelopeSuccess({
        totalDebit: totalDebit,
        totalCredit: totalCredit,
        difference: totalDebit - totalCredit,
        entries: entries
      }));
    }

    if (error) {
      console.error('[ERP accounting] getTrialBalance:', error);
      return res.json(envelopeSuccess({ totalDebit: 0, totalCredit: 0, difference: 0, entries: 0 }));
    }

    const totals = (data || []).reduce(
      (acc, row) => {
        acc.totalDebit += Number(row.total_debit) || 0;
        acc.totalCredit += Number(row.total_credit) || 0;
        acc.entries += 1;
        return acc;
      },
      { totalDebit: 0, totalCredit: 0, entries: 0 }
    );

    return res.json(
      envelopeSuccess({
        ...totals,
        difference: totals.totalDebit - totals.totalCredit
      })
    );
  } catch (err) {
    return next(err);
  }
}

async function getGeneralLedger(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const query = supabase
      .from('erp_journal_entries')
      .select('*')
      .eq('company_id', companyId)
      .order('entry_date', { ascending: false })
      .limit(300);

    if (req.query.status) query.eq('status', req.query.status);
    if (req.query.from) query.gte('entry_date', req.query.from);
    if (req.query.to) query.lte('entry_date', req.query.to);

    const { data, error } = await query;
    
    // Table doesn't exist - build ledger from sales and purchase invoices
    if (error && /no relation/i.test(error.message || '')) {
      const [salesInv, purchaseInv] = await Promise.all([
        supabase.from('erp_invoices').select('*').eq('company_id', companyId).order('issue_date', { ascending: false }).limit(300),
        supabase.from('erp_purchase_invoices').select('*').eq('company_id', companyId).order('received_date', { ascending: false }).limit(300)
      ]);

      const entries = [];

      // Add sales invoices
      if (salesInv.data) {
        salesInv.data.forEach(inv => {
          entries.push({
            id: `journal_${inv.id}`,
            entry_number: inv.invoice_number || `JE-${inv.id}`,
            entry_date: inv.issue_date,
            description: `Sales Invoice ${inv.invoice_number}`,
            entry_type: 'sales',
            total_debit: Number(inv.total) || 0,
            total_credit: 0,
            status: inv.status === 'paid' ? 'posted' : 'draft',
            company_id: companyId,
            reference_id: inv.id,
            reference_type: 'sales_invoice'
          });
        });
      }

      // Add purchase invoices
      if (purchaseInv.data) {
        purchaseInv.data.forEach(inv => {
          entries.push({
            id: `journal_${inv.id}`,
            entry_number: inv.invoice_number || `JE-${inv.id}`,
            entry_date: inv.received_date,
            description: `Purchase Invoice ${inv.invoice_number}`,
            entry_type: 'purchase',
            total_debit: 0,
            total_credit: Number(inv.total) || 0,
            status: inv.status === 'paid' ? 'posted' : 'draft',
            company_id: companyId,
            reference_id: inv.id,
            reference_type: 'purchase_invoice'
          });
        });
      }

      return res.json(envelopeSuccess(entries.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date)).slice(0, 300)));
    }

    if (error) {
      console.error('[ERP accounting] getGeneralLedger:', error);
      return res.json(envelopeSuccess([]));
    }

    return res.json(envelopeSuccess(data || []));
  } catch (err) {
    return next(err);
  }
}

async function getAccountById(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('erp_chart_of_accounts')
      .select('*')
      .eq('id', req.params.id)
      .eq('company_id', companyId)
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Account not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function createAccount(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const accountData = { ...req.body, company_id: companyId };
    const { data, error } = await supabase
      .from('erp_chart_of_accounts')
      .insert(accountData)
      .select()
      .single();

    if (error) {
      console.error('[ERP accounting] createAccount:', error);
      return res.status(500).json(envelopeError('DATABASE_ERROR', 'Failed to create account', error.message));
    }

    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function updateAccount(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('erp_chart_of_accounts')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Account not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getChartOfAccounts,
  getJournalEntries,
  getJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  postJournalEntry,
  reverseJournalEntry,
  getTrialBalance,
  getGeneralLedger,
  getAccountById,
  createAccount,
  updateAccount
};
