const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      level: "info",
      db: process.env.LOGGING_MONGO_DB,
      options: { useUnifiedTopology: true },
      collection: "logs",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

module.exports = logger;
