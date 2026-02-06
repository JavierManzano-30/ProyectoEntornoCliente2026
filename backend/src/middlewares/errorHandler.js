const { envelopeError } = require('../utils/envelope');

function notFoundHandler(req, res) {
  res.status(404).json(envelopeError('NOT_FOUND', 'Ruta no encontrada'));
}

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) return next(err);
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error interno'));
  }

  const details = [];
  if (err?.code) details.push({ code: err.code });
  if (err?.message) details.push({ message: err.message });
  if (err?.details) details.push({ details: err.details });
  if (err?.hint) details.push({ hint: err.hint });
  if (err?.table) details.push({ table: err.table });

  return res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error interno', details));
}

module.exports = { notFoundHandler, errorHandler };
