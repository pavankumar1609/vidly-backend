const mongoose = require("mongoose");
const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/vidly")
    .then(() => logger.info("mongodb connected successfully..."));
};
