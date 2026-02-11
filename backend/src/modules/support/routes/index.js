const express = require('express');
const { requireAuth } = require('../../../middlewares/auth');
const supportRoutes = require('./support.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'support', status: 'ok' } });
});

router.use(requireAuth);
router.use('/', supportRoutes);

module.exports = router;
