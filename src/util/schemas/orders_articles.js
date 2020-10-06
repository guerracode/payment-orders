const joi = require('joi');

// Schema to validate the data received from the user
const createOrdersArticlesSchema = joi.object({
  id_order: joi.number(),
  id_article: joi.number(),
  articles_number: joi.number(),
});

module.exports = {
  createOrdersArticlesSchema,
};
