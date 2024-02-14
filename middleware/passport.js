const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const db = require("../db");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, (payload, done) => {
      try {
        db.query(
          `SELECT "user_id", "email" FROM "user"  WHERE user_id = $1`,
          [payload.id],
          (error, results) => {
            if (error) {
              done(error, false);
            }
            const user = results.rows[0];
            if (user) {
              done(null, user);
            } else {
              done(null, false);
            }
          }
        );
      } catch (e) {
        console.log(e);
      }
    })
  );
};
