"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiLoginLimiter = exports.apiRegisterLimiter = void 0;

var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const apiRegisterLimiter = (0, _expressRateLimit.default)({
  windowMs: 60 * 60 * 1000,
  // 60 minutes
  max: 7,
  message: {
    message: "Too many accounts created from this IP, please try again after an hour"
  }
});
exports.apiRegisterLimiter = apiRegisterLimiter;
const apiLoginLimiter = (0, _expressRateLimit.default)({
  windowMs: 5 * 60 * 1000,
  // 5 minutes
  max: 5,
  message: {
    message: "Too many attempted logins from this IP, please try again after 15 minutes"
  }
});
exports.apiLoginLimiter = apiLoginLimiter;