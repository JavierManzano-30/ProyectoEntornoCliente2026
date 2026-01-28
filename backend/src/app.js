const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const alm = require('./modules/alm');
const core = require('./modules/core');
const rrhh = require('./modules/rrhh');
const crm = require('./modules/crm');
const bpm = require('./modules/bpm');
const erp = require('./modules/erp');
const soporte = require('./modules/soporte');
const bi = require('./modules/bi');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/v1/alm', alm.routes);
app.use('/api/v1/core', core.routes);
app.use('/api/v1/rrhh', rrhh.routes);
app.use('/api/v1/crm', crm.routes);
app.use('/api/v1/bpm', bpm.routes);
app.use('/api/v1/erp', erp.routes);
app.use('/api/v1/soporte', soporte.routes);
app.use('/api/v1/bi', bi.routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
