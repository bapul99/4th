const requireRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '이 작업을 수행할 권한이 없습니다.' });
    }
    next();
  };
};

module.exports = requireRoles;
