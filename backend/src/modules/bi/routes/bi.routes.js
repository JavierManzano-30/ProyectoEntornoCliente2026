const express = require('express');
const controller = require('../controllers/bi.controller');

const router = express.Router();

// Canonical (English)
router.get('/kpis', controller.getKPIs);
router.get('/dashboard', controller.getDashboard);
router.get('/reports', controller.listReports);
router.post('/reports', controller.createReport);
router.post('/reports/:id/run', controller.runReport);
router.get('/alerts', controller.listAlerts);
router.get('/datasets', controller.listDatasets);

// Spanish aliases
router.get('/alertas', controller.listAlerts);

module.exports = router;
