const { verifyToken } = require('../modules/core/services/authService');

module.exports = function authMiddleware(req, res, next) {
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
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
