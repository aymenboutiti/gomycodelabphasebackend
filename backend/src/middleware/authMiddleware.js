export const authenticateUser = (req, res, next) => {
  // Middleware logic to authenticate user
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  // Verify token logic here (e.g., using JWT)
  // If valid, attach user info to request object
  // req.user = decodedUser;

  next();
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions.' });
    }
    next();
  };
};