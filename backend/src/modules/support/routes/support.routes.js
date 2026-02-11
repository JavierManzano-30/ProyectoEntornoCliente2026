const express = require('express');
const controller = require('../controllers/support.controller');

const router = express.Router();

// Canonical (English)
router.get('/tickets', controller.getTickets);
router.post('/tickets', controller.createTicket);
router.post('/tickets/:id/messages', controller.addMessage);
router.patch('/tickets/:id/assign', controller.assignTicket);
router.patch('/tickets/:id/close', controller.closeTicket);
router.get('/tickets/:id/timeline', controller.getTimeline);

module.exports = router;

