const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const swaggerConfig = require("./configs/swaggerConfig");

const meetupRouter = require("./routes/meetupRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig, { explorer: true })
);

app.use(passport.initialize());
require("./middleware/passport")(passport);

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
