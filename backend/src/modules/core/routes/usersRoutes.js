const express = require('express');
const usersController = require('../controllers/usersController');
const { requireAuth } = require('../../../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.patch('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
