import rateLimit from "express-rate-limit";

function createRateLimit({ windowMinutes, max, message }) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });
}

export const authLimiter = createRateLimit({
  windowMinutes: 15,
  max: 30,
  message: "Too many authentication requests. Please try again later.",
});

export const loginLimiter = createRateLimit({
  windowMinutes: 15,
  max: 10,
  message: "Too many login attempts. Please try again after 15 minutes.",
});

export const registerLimiter = createRateLimit({
  windowMinutes: 60,
  max: 10,
  message: "Too many registration attempts. Please try again later.",
});

export const refreshLimiter = createRateLimit({
  windowMinutes: 15,
  max: 60,
  message: "Too many token refresh requests. Please try again later.",
});

export const reviewLimiter = createRateLimit({
  windowMinutes: 15,
  max: 30,
  message: "Too many review requests. Please slow down.",
});