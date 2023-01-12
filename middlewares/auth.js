const jwt = require('jsonwebtoken');
const {
  UnauthorizedError,
} = require('../errors');

function auth(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация,');
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'devSecretKey');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload; // {_id: '...'}

  next();
}

module.exports = {
  auth,
};
