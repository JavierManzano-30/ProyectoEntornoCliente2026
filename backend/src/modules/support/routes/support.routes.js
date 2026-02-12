const express = require('express');
const controller = require('../controllers/support.controller');

const router = express.Router();

// Dashboard y stats
router.get('/dashboard', controller.getDashboard);
router.get('/stats', controller.getStats);

// Catálogos
router.get('/categorias', controller.getCategories);
router.get('/prioridades', controller.getPriorities);

// Notificaciones, Reportes y SLA
router.get('/notificaciones', controller.getNotifications);
router.get('/reportes', controller.getReports);
router.get('/sla', controller.getSLA);

// Canonical (English)
router.get('/tickets', controller.getTickets);
router.post('/tickets', controller.createTicket);
router.post('/tickets/:id/messages', controller.addMessage);
router.patch('/tickets/:id/assign', controller.assignTicket);
router.patch('/tickets/:id/close', controller.closeTicket);
router.get('/tickets/:id/timeline', controller.getTimeline);

module.exports = router;

