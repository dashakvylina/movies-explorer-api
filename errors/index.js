const BadRequestError = require('./BadRequestError');
const DefaultError = require('./DefaultError');
const NotFoundError = require('./NotFoundError');
const UnauthorizedError = require('./UnauthorizedError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');
const {
  UNKNOWN_ERROR_TEXT,
} = require('../constants');

const commonError = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: UNKNOWN_ERROR_TEXT });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};

module.exports = {
  BadRequestError,
  DefaultError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  commonError,
};
