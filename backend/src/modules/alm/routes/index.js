const express = require('express');
const { requireAuth } = require('../../../middlewares/auth');
const projects = require('../controllers/projectsController');
const tasks = require('../controllers/tasksController');
const times = require('../controllers/timesController');
const supabase = require('../controllers/supabaseController');

const router = express.Router();

// Public health check (no auth) for Supabase connectivity
router.get('/supabase/health', supabase.supabaseHealth);

// Apply auth to all remaining ALM routes
router.use(requireAuth);
// Proyectos
router.get('/proyectos', projects.listProjects);
router.post('/proyectos', projects.createProject);
router.get('/proyectos/:id', projects.getProject);
router.put('/proyectos/:id', projects.updateProject);
router.delete('/proyectos/:id', projects.deleteProject);
router.get('/proyectos/:id/tareas', projects.listProjectTasks);
router.get('/proyectos/:id/estadisticas', projects.getProjectStats);

// Tareas
router.get('/tareas', tasks.listTasks);
router.post('/tareas', tasks.createTask);
router.get('/tareas/:id', tasks.getTask);
router.put('/tareas/:id', tasks.updateTask);
router.delete('/tareas/:id', tasks.deleteTask);
router.patch('/tareas/:id/estado', tasks.updateTaskStatus);
router.patch('/tareas/:id/asignar', tasks.assignTask);

// Tiempos
router.get('/tiempos', times.listTimes);
router.post('/tiempos', times.createTime);
router.put('/tiempos/:id', times.updateTime);
router.delete('/tiempos/:id', times.deleteTime);
router.get('/tiempos/proyecto/:id/resumen', times.getProjectTimeSummary);
router.get('/tiempos/usuario/:id', times.getUserTimes);
router.get('/tiempos/tarea/:id', times.getTaskTimes);


module.exports = router;
