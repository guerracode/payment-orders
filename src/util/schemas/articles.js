const joi = require('joi');

// Schema to validate the data received from the user
const createArticlesSchema = joi.object({
  id: joi.number(),
  name: joi.string().min(3).max(60),
  description: joi.string(),
});

module.exports = {
  createArticlesSchema,
};
