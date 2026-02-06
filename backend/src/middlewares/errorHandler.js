const { envelopeError } = require('../utils/envelope');

function notFoundHandler(req, res) {
  res.status(404).json(envelopeError('NOT_FOUND', 'Ruta no encontrada'));
}

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json(envelopeError('INTERNAL_ERROR', 'Error interno'));
}

module.exports = { notFoundHandler, errorHandler };
