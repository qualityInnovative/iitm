const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
  )
);

// Daily rotating transport
const dailyRotateTransport = new DailyRotateFile({
  filename: path.join(__dirname, "../logs/app-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d", // keep logs for 14 days
});

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console(),
    dailyRotateTransport
  ],
});

module.exports = logger;
