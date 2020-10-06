const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const UserServices = require('../../services/users');
const config = require('../../config/index');

passport.use(
  new Strategy(
    {
      secretOrKey: config.general.auth_jwt_secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (tokenPayload, cb) => {
      const usersService = new UserServices();

      try {
        const user = await usersService.getUser(tokenPayload.username);
        if (!user) {
          return cb(boom.unauthorized(), false);
        }
        delete user.password;
        return cb(null, { ...user });
      } catch (error) {
        return cb(error);
      }
    }
  )
);
