const express = require('express');
const passport = require('passport');
// const OrdersService = require('../services/orders');
// const validationHandler = require('../util/middleware/validationHandler');
// const { createEventSchema } = require('../utils/schemas/event');
const Database = require('../lib/db/mysql');

// JWT Strategy
// require('../utils/auth/strategies/jwt');

const router = express.Router();

// const eventService = new OrdersService();
// const database = new Database();

router.get('/', (req, res) => {
  // database.getUser('luis');
  res.send('OK Orders');
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  // validationHandler(createEventSchema),
  async (req, res, next) => {
    const { body: event } = req;

    // Add the current user_id to the event
    if (!event.user_id) {
      event.user_id = req.user.id;
    }

    try {
      // Store event in the DB and return it
      //   const createdEvent = await eventService.createEvent(event);
      // Response
      res.status(201).json({
        // data: createdEvent,
        message: 'event created',
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
