const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const UserService = require('../../services/users');

passport.use(
  new BasicStrategy(async (email, password, cb) => {
    
    try {
      // user logic
      const userService = new UserService();

      // find if user is on the DB and return it
      const user = await userService.getUser(email);

      // if no user, return error unauthorized
      if (!user) {
        return cb('No user', false);
      }

      // Check if password passed matches the password stored in the DB.
      if (!(await bcrypt.compare(password, user.password))) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })
);
