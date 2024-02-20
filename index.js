const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const swaggerConfig = require("./src/configs/swaggerConfig");

const meetupRouter = require("./src/routes/meetupRoutes");
const userRouter = require("./src/routes/userRoutes");
const authRouter = require("./src/routes/authRoutes");

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig, { explorer: true })
);

app.use(passport.initialize());
require("./src/middleware/passport")(passport);

app.use(express.json());
app.use("/api", meetupRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) =>
  res.status(200).json({
    "try this link": "https://meetup-api-c2965ab81300.herokuapp.com/api/docs/",
  })
);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
