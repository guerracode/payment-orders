const express = require('express');

const config = require('./src/config');
const users = require('./src/routes/users');
const orders = require('./src/routes/orders');
const articles = require('./src/routes/articles');
const { logErrors, wrapErrors, errorHandler } = require('./src/util/middleware/errorHandler');

const app = express();
const { port } = config.general;

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/users', users);
app.use('/api/orders', orders);
app.use('/api/articles', articles);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening at http://localhost:${port}`);
});
