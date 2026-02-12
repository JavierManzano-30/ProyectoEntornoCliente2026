const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth');
const {
  listCompanies,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companyController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listCompanies);
router.post('/', createCompany);
router.get('/:id', getCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

module.exports = router;
