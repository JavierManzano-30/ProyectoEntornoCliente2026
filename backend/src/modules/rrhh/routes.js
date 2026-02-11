const express = require('express');
const { requireAuth } = require('../../middleware/auth');

const departments = require('./controllers/department-controller');
const employees = require('./controllers/employee-controller');
const contracts = require('./controllers/contract-controller');
const absences = require('./controllers/absence-controller');
const payrolls = require('./controllers/payroll-controller');
const evaluations = require('./controllers/evaluation-controller');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'rrhh', status: 'ok' } });
});

router.use(requireAuth);

router.get('/departamentos', departments.listDepartments);
router.post('/departamentos', departments.createDepartment);
router.get('/departamentos/:id', departments.getDepartment);
router.put('/departamentos/:id', departments.updateDepartment);
router.delete('/departamentos/:id', departments.deleteDepartment);

router.get('/empleados', employees.listEmployees);
router.post('/empleados', employees.createEmployee);
router.get('/empleados/:id', employees.getEmployee);
router.get('/empleados/:id/resumen', employees.getEmployeeSummary);
router.put('/empleados/:id', employees.updateEmployee);
router.delete('/empleados/:id', employees.deleteEmployee);

router.get('/contratos', contracts.listContracts);
router.post('/contratos', contracts.createContract);
router.get('/contratos/:id', contracts.getContract);
router.put('/contratos/:id', contracts.updateContract);
router.delete('/contratos/:id', contracts.deleteContract);

router.get('/ausencias', absences.listAbsences);
router.post('/ausencias', absences.createAbsence);
router.get('/ausencias/:id', absences.getAbsence);
router.put('/ausencias/:id', absences.updateAbsence);
router.delete('/ausencias/:id', absences.deleteAbsence);
router.patch('/ausencias/:id/aprobar', absences.approveAbsence);
router.patch('/ausencias/:id/rechazar', absences.rejectAbsence);

router.get('/nominas', payrolls.listPayrolls);
router.post('/nominas', payrolls.createPayroll);
router.get('/nominas/:id', payrolls.getPayroll);

router.get('/evaluaciones', evaluations.listEvaluations);
router.post('/evaluaciones', evaluations.createEvaluation);
router.get('/evaluaciones/:id', evaluations.getEvaluation);

module.exports = router;
