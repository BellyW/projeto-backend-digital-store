import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Token não informado' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}
