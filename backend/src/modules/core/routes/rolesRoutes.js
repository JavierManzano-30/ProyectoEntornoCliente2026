const express = require('express');
const rolesController = require('../controllers/rolesController');
const { requireAuth } = require('../../../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

router.get('/', rolesController.getRoles);
router.get('/:id', rolesController.getRoleById);
router.post('/', rolesController.createRole);
router.patch('/:id', rolesController.updateRole);
router.delete('/:id', rolesController.deleteRole);

module.exports = router;
