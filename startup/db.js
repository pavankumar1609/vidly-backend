const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

module.exports = function () {
  const db = config.get("db");
  mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
};
