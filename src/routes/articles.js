const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const ArticlesService = require('../services/articles');
const validationHandler = require('../util/middleware/validationHandler');
const { createArticlesSchema } = require('../util/schemas/articles');

// JWT Strategy
require('../util/auth/jwt');

function articlesApi(app) {
  const router = express.Router();
  app.use('/api/articles', router);

  const articlesService = new ArticlesService();

  router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const articleId = req.query.id;

    try {
      let article;
      if (articleId) {
        article = await articlesService.getArticle(articleId);
      } else {
        article = await articlesService.getAllArticles();
      }
      // Get article by ID
      // Response
      res.status(200).json({
        data: article,
        message: `article obtained`,
      });
    } catch (error) {
      next(boom.unauthorized(error));
    }
  });

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    validationHandler(createArticlesSchema),
    async (req, res, next) => {
      const { body: article } = req;

      try {
        // Store article in the DB and return it
        const createdArticle = await articlesService.createArticle(article);
        // Response
        res.status(201).json({
          data: createdArticle,
          message: `article ${createdArticle.name} created`,
        });
      } catch (error) {
        next(boom.unauthorized(error));
      }
    }
  );

  router.put(
    '/',
    passport.authenticate('jwt', { session: false }),
    validationHandler(createArticlesSchema),
    async (req, res, next) => {
      const { body: article } = req;
      try {
        // Update article in the DB and return it
        await articlesService.updateArticle(article);
        // Response
        res.status(200).json({
          message: `article updated`,
        });
      } catch (error) {
        next(boom.unauthorized(error));
      }
    }
  );

  router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const articleId = req.query.id;

    try {
      // Delete article by ID
      const article = await articlesService.deleteArticle(articleId);
      // Response
      res.status(200).json({
        message: `article with id ${article} deleted successfully`,
      });
    } catch (error) {
      next(boom.unauthorized(error));
    }
  });

  router.get(
    '/frequent/:number',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      const { number } = req.params;

      try {
        const frequent = await articlesService.getFrequent(number);

        // Get article by ID
        // Response
        res.status(200).json({
          data: frequent,
          message: `frequent article obtained`,
        });
      } catch (error) {
        next(boom.unauthorized(error));
      }
    }
  );
}

module.exports = articlesApi;
