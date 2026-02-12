const express = require('express');
const { requireAuth } = require('../../../middlewares/auth');
const customers = require('../controllers/customersController');
const contacts = require('../controllers/contactsController');
const opportunities = require('../controllers/opportunitiesController');
const activities = require('../controllers/activitiesController');
const config = require('../controllers/configController');
const dashboard = require('../controllers/dashboardController');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, data: { module: 'crm', status: 'ok' } });
});

// Apply auth to all CRM routes
router.use(requireAuth);

// Dashboard
router.get('/dashboard', dashboard.getDashboard);

// Customers (English + Spanish alias)
router.get('/customers', customers.listCustomers);
router.post('/customers', customers.createCustomer);
router.get('/customers/:id', customers.getCustomer);
router.put('/customers/:id', customers.updateCustomer);
router.delete('/customers/:id', customers.deleteCustomer);
router.post('/customers/:id/convert', customers.convertCustomer);

// Alias en español para customers
router.get('/clientes', customers.listCustomers);
router.post('/clientes', customers.createCustomer);
router.get('/clientes/:id', customers.getCustomer);
router.put('/clientes/:id', customers.updateCustomer);
router.delete('/clientes/:id', customers.deleteCustomer);

// Contacts
router.get('/contacts', contacts.listContacts);
router.post('/contacts', contacts.createContact);
router.get('/contacts/:id', contacts.getContact);
router.put('/contacts/:id', contacts.updateContact);
router.delete('/contacts/:id', contacts.deleteContact);

// Opportunities
router.get('/opportunities', opportunities.listOpportunities);
router.post('/opportunities', opportunities.createOpportunity);
router.get('/opportunities/:id', opportunities.getOpportunity);
router.put('/opportunities/:id', opportunities.updateOpportunity);
router.delete('/opportunities/:id', opportunities.deleteOpportunity);
router.patch('/opportunities/:id/stage', opportunities.updateStage);

// Activities
router.get('/activities', activities.listActivities);
router.post('/activities', activities.createActivity);
router.get('/activities/:id', activities.getActivity);
router.put('/activities/:id', activities.updateActivity);
router.delete('/activities/:id', activities.deleteActivity);
router.patch('/activities/:id/complete', activities.markCompleted);

// Configuration
router.get('/config/pipelines', config.listPipelines);
router.post('/config/pipelines', config.createPipeline);
router.get('/config/pipelines/:id', config.getPipeline);
router.put('/config/pipelines/:id', config.updatePipeline);
router.delete('/config/pipelines/:id', config.deletePipeline);

router.post('/config/stages', config.createStage);
router.put('/config/stages/:id', config.updateStage);
router.delete('/config/stages/:id', config.deleteStage);

module.exports = router;
