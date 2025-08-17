const jwt = require('jsonwebtoken');

const verifyToken = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Role not allowed' });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
};

module.exports = verifyToken;
