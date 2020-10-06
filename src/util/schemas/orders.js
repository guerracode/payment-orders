const joi = require('joi');

// Schema to validate the data received from the user
const createOrdersSchema = joi.object({
  id: joi.number(),
  name: joi.string().min(3).max(60),
  description: joi.string(),
  date: joi.date(),
  articles: joi.array().items(
    joi.object({
      id: joi.number().required(),
      number: joi.number().required(),
    })
  ),
});

module.exports = {
  createOrdersSchema,
};
