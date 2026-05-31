const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const Redis = require("ioredis");

// Redis клиент для распределённого rate limiting
const redisClient = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

// Общий лимитер
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 минут
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 запросов
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  ...(redisClient && { store: new RedisStore({ client: redisClient }) }),
});

// Строгий лимитер для аутентификации
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // 5 попыток входа
  message: { error: "Too many login attempts, please try again later." },
  skipSuccessfulRequests: true,
});

// Лимитер для API
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 60, // 60 запросов в минуту
  message: { error: "Rate limit exceeded. Please slow down." },
});

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter,
};
