'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authMiddleware = {
  validateToken: function validateToken(req, res, next) {
    var token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (token) {
      _jsonwebtoken2.default.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.accountId = decoded.id;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token not provided'
      });
    }
  }
};
exports.default = authMiddleware;