require("express-async-errors");
const winston = require("winston");
const { createLogger, transports, format } = winston;
const { combine, timestamp, prettyPrint, colorize, metadata } = format;

module.exports = function () {
  createLogger({
    format: combine(timestamp(), prettyPrint(), metadata()),
    transports: [
      new transports.Console({ format: colorize({ all: true }) }),
      new transports.File({ filename: "logs/uncaughtExceptions.log" }),
    ],
    exceptionHandlers: [
      new transports.Console(),
      new transports.File({ filename: "logs/uncaughtExceptions.log" }),
    ],
  });
};
