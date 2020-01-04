import rateLimit from "express-rate-limit";

export const apiRegisterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 7,
  message: {
    message:
      "Too many accounts created from this IP, please try again after an hour"
  }
});

export const apiLoginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: {
    message:
      "Too many attempted logins from this IP, please try again after 15 minutes"
  }
});

export const fiveAttemptsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: {
    message: "Too many attempts, please try again after 5 minutes"
  }
});
