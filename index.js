const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const swaggerConfig = require("./src/configs/swaggerConfig");
const router = require("./src/loader/routing");

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig, { explorer: true })
);

app.use(passport.initialize());
require("./src/common/middleware/passport")(passport);

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
