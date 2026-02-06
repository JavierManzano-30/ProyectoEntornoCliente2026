const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'soporte', status: 'ok' } });
});

module.exports = router;
