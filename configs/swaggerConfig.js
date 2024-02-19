const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Meetup API",
      version: "0.2.0",
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

module.exports = specs;
