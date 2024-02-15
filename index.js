const express = require("express");
require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");

const meetupRouter = require("./routes/meetupRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Meetup API",
      version: "0.1.0",
    },
    servers: [
      {
        url: `/api`,
      },
    ],
  },
  apis: ["./docs/swagger.yaml"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(express.json());
app.use("/api", meetupRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) =>
  res
    .status(200)
    .json({
      "try this link":
        "https://meetup-api-c2965ab81300.herokuapp.com/api/docs/",
    })
);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
