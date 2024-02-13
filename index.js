const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const meetupRouter = require("./routes/meetupRoutes");

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
        url: `http://127.0.0.1:${PORT}/api`,
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

app.use(express.json());
app.use("/api", meetupRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
