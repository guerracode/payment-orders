const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
// const jwt = require('jsonwebtoken');
const UsersService = require('../services/users');
const validationHandler = require('../util/middleware/validationHandler');
// const config = require('../config');
const { createUserSchema } = require('../util/schemas/users');

// Basic strategy
require('../util/auth/basic');

const router = express.Router();

// TODO test sign-in
// sing-in route
router.post('/sign-in', async (req, res, next) => {
  passport.authenticate('basic', (error, user) => {
    try {
      if (error || !user) {
        next(boom.unauthorized());
      }
      // Request login
      req.login(user, { session: false }, async (err) => {
        if (err) {
          next(err);
        }

        // const { id, username } = user;

        // const payload = {
        //   id,
        //   username,
        // };
        // Create json web token with the payload data
        // const token = jwt.sign(payload, config.auth_jwt_secret, {
        //   expiresIn: '24h',
        // });

        // Response
        res.status(200).json({ user });
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

// sign-up route
router.post('/sign-up', validationHandler(createUserSchema), async (req, res, next) => {
  const { body: user } = req;

  // User logic
  const usersService = new UsersService();

  try {
    // Store user in the DB and return user
    const createdUser = await usersService.createUser(user);

    if (!createdUser) {
      next(boom.unauthorized('User already Exist'));
    }

    // Response
    await res.status(201).json({
      message: `user ${createdUser} created`,
    });
  } catch (error) {
    next(boom.unauthorized('User already Exist'));
  }
});

module.exports = router;
