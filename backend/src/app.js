const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { loadEnv } = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

loadEnv();

const alm = require('./modules/alm');
const core = require('./modules/core/index.js');
const hr = require('./modules/hr');
const crm = require('./modules/crm');
const bpm = require('./modules/bpm');
const erp = require('./modules/erp');
const support = require('./modules/support');
const bi = require('./modules/bi');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

console.log('Modules loaded:', {
  alm: !!alm.routes,
  core: !!core.routes,
  hr: !!hr.routes,
  crm: !!crm.routes,
  bpm: !!bpm.routes,
  erp: !!erp.routes,
  support: !!support.routes,
  bi: !!bi.routes
});

app.use('/api/v1/alm', alm.routes);
app.use('/api/v1/core', core.routes);
app.use('/api/v1/hr', hr.routes);
app.use('/api/v1/crm', crm.routes);
app.use('/api/v1/bpm', bpm.routes);
app.use('/api/v1/erp', erp.routes);
app.use('/api/v1/support', support.routes);
app.use('/api/v1/bi', bi.routes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${port}`);
  });
}

module.exports = app;
