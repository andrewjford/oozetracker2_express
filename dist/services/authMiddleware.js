"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const authMiddleware = {
  validateToken(req, res, next) {
    let token = req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    if (token) {
      _jsonwebtoken.default.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: "Token is not valid"
          });
        } else {
          req.accountId = decoded.id;
          next();
        }
      });
    } else {
      return res.status(401).send({
        success: false,
        message: "No valid token provided"
      });
    }
  }

};
var _default = authMiddleware;
exports.default = _default;