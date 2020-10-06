const express = require('express');
const cors = require('cors');

const app = express();

const config = require('./src/config');
const users = require('./src/routes/users');
const orders = require('./src/routes/orders');
const articles = require('./src/routes/articles');
const { logErrors, wrapErrors, errorHandler } = require('./src/util/middleware/errorHandler');

const { port } = config.general;

app.use(cors());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
users(app);
orders(app);
// orders('/api/orders', orders);
articles(app);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening at http://localhost:${port}`);
});
