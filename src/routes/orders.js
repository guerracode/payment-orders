const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');

const OrdersService = require('../services/orders');
const validationHandler = require('../util/middleware/validationHandler');
const { createOrdersSchema } = require('../util/schemas/orders');

// JWT Strategy
require('../util/auth/jwt');

function ordersApi(app) {
  const router = express.Router();
  app.use('/api/orders', router);

  const ordersService = new OrdersService();

  router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const orderId = req.query.id;

    try {
      let order;
      if (orderId) {
        order = await ordersService.getOrder(orderId);
      } else {
        order = await ordersService.getAllOrders();
      }
      // Get order by ID
      // Response
      res.status(200).json({
        data: order,
        message: `order obtained`,
      });
    } catch (error) {
      next(boom.unauthorized(error));
    }
  });

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    validationHandler(createOrdersSchema),
    async (req, res, next) => {
      const { body: order } = req;

      // Add the current date and user_id to the order
      if (!order.date) {
        order.date = new Date();
      }
      if (!order.user_id) {
        order.id_user = req.user.id;
      }

      try {
        // Store event in the DB and return it
        const createdOrder = await ordersService.createOrder(order);
        // Response
        res.status(201).json({
          data: createdOrder,
          message: 'order created',
        });
      } catch (error) {
        next(boom.unauthorized(error));
      }
    }
  );

  router.put(
    '/',
    passport.authenticate('jwt', { session: false }),
    validationHandler(createOrdersSchema),
    async (req, res, next) => {
      const { body: order } = req;
      try {
        // Update order in the DB and return it
        await ordersService.updateOrder(order);
        // Response
        res.status(200).json({
          message: `order updated`,
        });
      } catch (error) {
        next(boom.unauthorized(error));
      }
    }
  );

  router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const orderId = req.query.id;

    try {
      // Delete order by ID
      const order = await ordersService.deleteOrder(orderId);
      // Response
      res.status(200).json({
        message: `order with id ${order} deleted successfully`,
      });
    } catch (error) {
      next(boom.unauthorized(error));
    }
  });

  router.get('/date', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    let param;
    let value;
    if (req.query.after) {
      param = req.query.after;
      value = 'after';
    } else if (req.query.before) {
      param = req.query.before;
      value = 'before';
    } else if (req.query.start && req.query.end) {
      param = { start: req.query.start, end: req.query.end };
      value = 'between';
    }

    try {
      const dates = await ordersService.getDates(param, value);

      // Get order by ID
      // Response
      res.status(200).json({
        data: dates,
        message: `order obtained`,
      });
    } catch (error) {
      next(boom.unauthorized(error));
    }
  });
}

module.exports = ordersApi;
