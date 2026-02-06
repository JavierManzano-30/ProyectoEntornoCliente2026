const express = require('express');
const { requireAuth } = require('../../middleware/auth');

const departamentos = require('./departamentosController');
const empleados = require('./empleadosController');
const contratos = require('./contratosController');
const ausencias = require('./ausenciasController');
const nominas = require('./nominasController');
const evaluaciones = require('./evaluacionesController');

const router = express.Router();

// Healthcheck del módulo RRHH
router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'rrhh', status: 'ok' } });
});

// Proteger el resto de rutas con autenticación
router.use(requireAuth);

// Departamentos
router.get('/departamentos', departamentos.listDepartamentos);
router.post('/departamentos', departamentos.createDepartamento);
router.get('/departamentos/:id', departamentos.getDepartamento);
router.put('/departamentos/:id', departamentos.updateDepartamento);
router.delete('/departamentos/:id', departamentos.deleteDepartamento);

// Empleados
router.get('/empleados', empleados.listEmpleados);
router.post('/empleados', empleados.createEmpleado);
router.get('/empleados/:id', empleados.getEmpleado);
router.put('/empleados/:id', empleados.updateEmpleado);
router.delete('/empleados/:id', empleados.deleteEmpleado);

// Contratos
router.get('/contratos', contratos.listContratos);
router.post('/contratos', contratos.createContrato);
router.get('/contratos/:id', contratos.getContrato);
router.put('/contratos/:id', contratos.updateContrato);
router.delete('/contratos/:id', contratos.deleteContrato);

// Ausencias
router.get('/ausencias', ausencias.listAusencias);
router.post('/ausencias', ausencias.createAusencia);
router.get('/ausencias/:id', ausencias.getAusencia);
router.put('/ausencias/:id', ausencias.updateAusencia);
router.delete('/ausencias/:id', ausencias.deleteAusencia);
router.patch('/ausencias/:id/aprobar', ausencias.aprobarAusencia);
router.patch('/ausencias/:id/rechazar', ausencias.rechazarAusencia);

// Nóminas (solo alta y consulta, no edición/eliminación)
router.get('/nominas', nominas.listNominas);
router.post('/nominas', nominas.createNomina);
router.get('/nominas/:id', nominas.getNomina);

// Evaluaciones (alta y consulta)
router.get('/evaluaciones', evaluaciones.listEvaluaciones);
router.post('/evaluaciones', evaluaciones.createEvaluacion);
router.get('/evaluaciones/:id', evaluaciones.getEvaluacion);

module.exports = router;
