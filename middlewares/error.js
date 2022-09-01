require("winston-mongodb");
const winston = require("winston");
const { createLogger, transports, format } = winston;
const { combine, timestamp, prettyPrint, colorize, metadata } = format;

function error(err, req, res, next) {
  const logger = createLogger({
    format: combine(timestamp(), prettyPrint(), metadata()),
    transports: [
      new transports.Console({ format: colorize({ all: true }) }),
      new transports.File({ filename: "logs/logfile.log" }),
      new transports.MongoDB({
        db: "mongodb://127.0.0.1:27017/vidly",
        options: { useUnifiedTopology: true },
      }),
    ],
  });

  logger.error({ message: err.message, stack: err.stack });

  res.status(500).send("Something failed.");
}

module.exports = error;
