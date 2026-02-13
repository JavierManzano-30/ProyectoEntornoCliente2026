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
  const now = new Date().toISOString();
  return {
    company_id: companyId,
    entry_number: body.entry_number || body.entryNumber || body.number || null,
    entry_date: body.entry_date || body.entryDate || body.date || now.slice(0, 10),
    description: body.description || body.entry_description || null,
    entry_type: body.entry_type || body.entryType || body.type || 'standard',
    total_debit: body.total_debit ?? body.totalDebit ?? 0,
    total_credit: body.total_credit ?? body.totalCredit ?? 0,
    status: body.status || 'draft',
    updated_at: now
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

    const payload = normalizeJournalEntryPayload(req.body, companyId);
    payload.created_at = new Date().toISOString();
    payload.created_by = req.user?.id || req.user?.userId || null;

    const { data, error } = await supabase
      .from('erp_journal_entries')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[ERP accounting] createJournalEntry:', error);
      return res.status(500).json(envelopeError('DATABASE_ERROR', 'Failed to create journal entry', error.message));
    }

    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function updateJournalEntry(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const payload = normalizeJournalEntryPayload(req.body, companyId);
    delete payload.company_id;

    const { data, error } = await supabase
      .from('erp_journal_entries')
      .update(payload)
      .eq('id', req.params.id)
      .eq('company_id', companyId)
      .select()
      .single();

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
