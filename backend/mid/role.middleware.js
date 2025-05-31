module.exports = function(requiredRole) {
  return (req, res, next) => {
    const userRole = req.user.role;  // req.user установлен из auth.middleware после верификации JWT

    if (userRole !== requiredRole) {
      return res.status(403).json({ message: 'Access denied: insufficient rights' });
    }
    next();
  }
}
