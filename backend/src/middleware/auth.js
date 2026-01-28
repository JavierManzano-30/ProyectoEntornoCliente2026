const jwt = require('jsonwebtoken');
const { envelopeError } = require('../utils/envelope');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json(envelopeError('UNAUTHORIZED', 'Token requerido'));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res
      .status(500)
      .json(envelopeError('CONFIG_ERROR', 'JWT_SECRET no configurado'));
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json(envelopeError('UNAUTHORIZED', 'Token invalido'));
  }
}

module.exports = { requireAuth };
