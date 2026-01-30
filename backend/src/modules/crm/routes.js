const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const clientes = require('./clientesController');
const contactos = require('./contactosController');
const oportunidades = require('./oportunidadesController');
const actividades = require('./actividadesController');
const config = require('./configController');

const router = express.Router();

// Apply auth to all CRM routes
router.use(requireAuth);

// Clientes
router.get('/clientes', clientes.listClientes);
router.post('/clientes', clientes.createCliente);
router.get('/clientes/:id', clientes.getCliente);
router.put('/clientes/:id', clientes.updateCliente);
router.delete('/clientes/:id', clientes.deleteCliente);
router.post('/clientes/:id/convertir', clientes.convertirCliente);

// Contactos
router.get('/contactos', contactos.listContactos);
router.post('/contactos', contactos.createContacto);
router.get('/contactos/:id', contactos.getContacto);
router.put('/contactos/:id', contactos.updateContacto);
router.delete('/contactos/:id', contactos.deleteContacto);

// Oportunidades
router.get('/oportunidades', oportunidades.listOportunidades);
router.post('/oportunidades', oportunidades.createOportunidad);
router.get('/oportunidades/:id', oportunidades.getOportunidad);
router.put('/oportunidades/:id', oportunidades.updateOportunidad);
router.delete('/oportunidades/:id', oportunidades.deleteOportunidad);
router.patch('/oportunidades/:id/fase', oportunidades.updateFase);

// Actividades
router.get('/actividades', actividades.listActividades);
router.post('/actividades', actividades.createActividad);
router.get('/actividades/:id', actividades.getActividad);
router.put('/actividades/:id', actividades.updateActividad);
router.delete('/actividades/:id', actividades.deleteActividad);
router.patch('/actividades/:id/completar', actividades.marcarCompletada);

// Configuración - Pipelines
router.get('/config/pipelines', config.listPipelines);
router.post('/config/pipelines', config.createPipeline);
router.get('/config/pipelines/:id', config.getPipeline);
router.put('/config/pipelines/:id', config.updatePipeline);
router.delete('/config/pipelines/:id', config.deletePipeline);

// Configuración - Fases
router.post('/config/fases', config.createFase);
router.put('/config/fases/:id', config.updateFase);
router.delete('/config/fases/:id', config.deleteFase);

module.exports = router;
