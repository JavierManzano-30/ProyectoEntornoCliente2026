const express = require('express');
const authRoutes = require('./authRoutes');
const companyRoutes = require('./companyRoutes');
const supabase = require('../../../config/supabase');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.get('/health/db', async (req, res) => {
  const { error } = await supabase
    .from('core_companies')
    .select('id')
    .limit(1);

  if (error) {
    return res.status(500).json({ status: 'error', message: error.message || 'DB error' });
  }

  return res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);

module.exports = router;
