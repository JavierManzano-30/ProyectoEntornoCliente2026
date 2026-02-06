const jwt = require('jsonwebtoken');
const { envelopeError } = require('../utils/envelope');
const { verifyToken } = require('../modules/core/services/authService');

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
    console.error('JWT verification error:', err);
    return res.status(401).json(envelopeError('UNAUTHORIZED', 'Token invalido'));
  }
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authorization token missing or invalid' });
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      userId: payload.userId,
      companyId: payload.companyId,
      roleId: payload.roleId
    };
    return next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth, authMiddleware };
