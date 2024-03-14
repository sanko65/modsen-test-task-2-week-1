const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const session = require("express-session");
const swaggerConfig = require("./src/configs/swaggerConfig");
const router = require("./src/loader/routing");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig, { explorer: true })
);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./src/common/middleware/passport")(passport);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  done(null, id);
});

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
