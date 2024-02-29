const JwtStrategy = require("passport-jwt").Strategy;
const prisma = require("../../database/prisma");
const cookieExtractor = require("../helpers/cookieExtractor");

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_ACCESS_KEY,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, (payload, done) => {
      prisma.user
        .findUnique({
          where: {
            user_id: payload.id,
          },
          select: {
            user_id: true,
            email: true,
            role: true,
          },
        })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((error) => {
          return done(error, false);
        });
    })
  );
};
