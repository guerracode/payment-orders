const boom = require('@hapi/boom');

function validate(data, schema) {
  const { error } = schema.validate(data);
  return error;
}

function validationHandler(schema, check = 'body') {
  return (req, res, next) => {
    const error = validate(req[check], schema);

    // eslint-disable-next-line no-unused-expressions
    error ? next(boom.badRequest(error)) : next();
  };
}

module.exports = validationHandler;