const joi = require('joi');

// Schema to validate the data received from the user
const createUserSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

module.exports = {
  createUserSchema,
};
