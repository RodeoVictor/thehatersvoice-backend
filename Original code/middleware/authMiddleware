const jwt = require('jsonwebtoken');
const User = require('../models/User');

//auth middleware
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user.isAdmin = user.isAdmin;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

//admin only middleware
const authenticateAdmin = async (req, res, next) => {
  await authenticate(req, res, () => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Admins only' });
    }
    next();
  });
};

module.exports = { authenticate, authenticateAdmin };
