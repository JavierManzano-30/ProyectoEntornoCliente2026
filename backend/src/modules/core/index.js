const express = require('express');

const router = express.Router();

// Placeholder routes for Core module
router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'core', status: 'ok' } });
});

module.exports = { routes: router };
