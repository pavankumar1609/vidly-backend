const config = require("config");
const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();
require("./startup/prod")(app);

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => {
  logger.info(`Listening on port ${port}...`);
});

module.exports = server;
