const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../../../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

router.get('/', dashboardController.getDashboard);

module.exports = router;
