require('dotenv').config();

module.exports = {
  general: {
    dev: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    auth_jwt_secret: process.env.JWT_SECRET,
  },
  mysql: {
    host: process.env.HOST_AWS,
    user: process.env.USER_AWS,
    password: process.env.PASSWORD_AWS,
    database: process.env.DATABASE_AWS,
  },
};
