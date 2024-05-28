

const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../constants/auth.constant');

const requireRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: '리프레시 토큰이 제공되지 않았습니다.' });
  }

  jwt.verify(refreshToken, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않거나 만료된 리프레시 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

module.exports = requireRefreshToken;
