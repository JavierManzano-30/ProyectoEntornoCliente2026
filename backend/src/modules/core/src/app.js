const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

const authRoutes = require('./modules/core/routes/authRoutes');
const companyRoutes = require('./modules/core/routes/companyRoutes');
const supabase = require('./config/supabaseClient');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/health/db', async (req, res) => {
  const { error } = await supabase
    .from('core_companies')
    .select('id')
    .limit(1);

  if (error) {
    return res.status(500).json({ status: 'error', message: error.message || 'DB error' });
  }

  return res.status(200).json({ status: 'ok' });
});

app.use('/api/core/auth', authRoutes);
app.use('/api/core/companies', companyRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`CORE API running on http://localhost:${PORT}`);
});

module.exports = app;
