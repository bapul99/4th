const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../constants/auth.constant');

const requireAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: '인증 토큰이 제공되지 않았습니다.' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않거나 만료된 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

module.exports = requireAccessToken;
