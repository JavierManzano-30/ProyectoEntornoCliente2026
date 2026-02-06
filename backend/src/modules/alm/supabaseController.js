const supabase = require('./config/supabaseClient');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');

async function supabaseHealth(req, res, next) {
  try {
    const { error } = await supabase
      .from('alm_projects')
      .select('id')
      .limit(1);

    if (error) {
      return res.status(500).json(envelopeError('SUPABASE_ERROR', error.message, []));
    }

    return res.json(envelopeSuccess({ status: 'ok' }));
  } catch (err) {
    return next(err);
  }
}

module.exports = { supabaseHealth };
