// Глобальный обработчик ошибок
function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  // Логирование ошибки в файл
  const fs = require("fs");
  const log = `${new Date().toISOString()} - ${err.message}\n`;
  fs.appendFileSync("./logs/errors.log", log, { flag: "a" });

  // Отправка ответа
  res.status(err.status || 500).json({
    error: err.message || "Внутренняя ошибка сервера",
    requestId: req.id,
  });
}

// Перехват непойманных исключений
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  fs.appendFileSync(
    "./logs/critical.log",
    `${new Date().toISOString()} - UNCAUGHT: ${error.message}\n`,
  );
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  fs.appendFileSync(
    "./logs/critical.log",
    `${new Date().toISOString()} - UNHANDLED: ${error.message}\n`,
  );
});

module.exports = errorHandler;
