const JwtStrategy = require("passport-jwt").Strategy;
const Strategy = require("passport-google-oauth20");
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

  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3333/api/auth/google/callback",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, cb) => {
        cb(null, profile);
      }
    )
  );
};
