const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

// GET /api/v1/erp/accounting/chart-of-accounts
async function getChartOfAccounts(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('erp_chart_of_accounts')
      .select('*')
      .eq('company_id', companyId)
      .order('code', { ascending: true });

    if (error) {
      console.error('[ERP Chart of Accounts] Database error:', error);
      // Si la tabla no existe, retornar array vacío
      return res.json(envelopeSuccess([]));
    }

    return res.json(envelopeSuccess(data || []));
  } catch (err) {
    console.error('[ERP Chart of Accounts] Error:', err);
    return next(err);
  }
}

// GET /api/v1/erp/accounting/journal-entries
async function getJournalEntries(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('erp_journal_entries')
      .select('*')
      .eq('company_id', companyId)
      .order('entry_date', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[ERP Journal Entries] Database error:', error);
      // Si la tabla no existe, retornar array vacío
      return res.json(envelopeSuccess([]));
    }

    return res.json(envelopeSuccess(data || []));
  } catch (err) {
    console.error('[ERP Journal Entries] Error:', err);
    return next(err);
  }
}

// GET /api/v1/erp/accounting/accounts/:id
async function getAccountById(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const accountId = req.params.id;
    
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('erp_chart_of_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('company_id', companyId)
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Account not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    console.error('[ERP Get Account] Error:', err);
    return next(err);
  }
}

// POST /api/v1/erp/accounting/accounts
async function createAccount(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const accountData = {
      ...req.body,
      company_id: companyId
    };

    const { data, error } = await supabase
      .from('erp_chart_of_accounts')
      .insert(accountData)
      .select()
      .single();

    if (error) {
      console.error('[ERP Create Account] Database error:', error);
      return res.status(500).json(
        envelopeError('DATABASE_ERROR', 'Failed to create account', error.message)
      );
    }

    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    console.error('[ERP Create Account] Error:', err);
    return next(err);
  }
}

// PUT /api/v1/erp/accounting/accounts/:id
async function updateAccount(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const accountId = req.params.id;
    
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const { data, error } = await supabase
      .from('erp_chart_of_accounts')
      .update(req.body)
      .eq('id', accountId)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json(envelopeError('NOT_FOUND', 'Account not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    console.error('[ERP Update Account] Error:', err);
    return next(err);
  }
}

module.exports = {
  getChartOfAccounts,
  getJournalEntries,
  getAccountById,
  createAccount,
  updateAccount
};
