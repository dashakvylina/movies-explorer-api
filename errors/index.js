const BadRequestError = require('./BadRequestError');
const DefaultError = require('./DefaultError');
const NotFoundError = require('./NotFoundError');
const UnauthorizedError = require('./UnauthorizedError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');

module.exports = {
  BadRequestError,
  DefaultError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
};
