const boom = require('@hapi/boom');
const chalk = require('chalk');
const config = require('../../config');

// Check, if its development return the error.
function withErrorStack(error, stack) {
  if (config.general.env === 'development') {
    return { ...error, stack };
  }

  return error;
}

// Log error into the console
function logErrors(err, req, res, next) {
  console.log(chalk.red(err));
  next(err);
}

// If error is a boom error
function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
}

// Handle error with status and the error
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // eslint-disable-line
  const {
    output: { statusCode, payload },
  } = err;
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler,
};
