const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");

const JWT_SECRET =
  process.env.JWT_SECRET || "okuyim-super-secret-key-change-in-production-2024";
const TOKEN_EXPIRY = "7d";

// Генерация токена
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY },
  );
}

// Проверка токена
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Сессия истекла, войдите снова" });
    }
    return res.status(401).json({ error: "Недействительный токен" });
  }
}

// Проверка роли администратора
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Доступ запрещен. Требуются права администратора." });
  }
  next();
}

// Проверка владельца ресурса
function requireOwnership(req, res, next) {
  const userId = parseInt(req.params.userId) || parseInt(req.body.userId);
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ error: "Доступ запрещен" });
  }
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  requireAdmin,
  requireOwnership,
};
