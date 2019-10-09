"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var EmailValidator = _interopRequireWildcard(require("email-validator"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// requires 8+ password length
// can use any alphanumeric and the standard symbols
const passwordRegex = new RegExp("^[A-Za-zd!@#$%^&*()_+-=].{7,}$");
const AccountValidator = {
  onCreate(req) {
    const errors = [];

    if (!req.body.name || !req.body.email || !req.body.password) {
      errors.push("Missing required param(s)");
    }

    if (!EmailValidator.validate(req.body.email)) {
      errors.push("Invalid email format");
    }

    if (!passwordRegex.test(req.body.password)) {
      errors.push("Password must be at least 8 characters long, and include only alphanumerics and standard symbols");
    }

    return errors;
  },

  onUpdate(req) {
    const errors = [];

    if (!(req.body.name || req.body.oldPassword && req.body.newPassword)) {
      errors.push("Missing required param(s)");
    }

    if (req.body.newPassword && !passwordRegex.test(req.body.newPassword)) {
      errors.push("Password must be at least 8 characters long, and include only alphanumerics and standard symbols");
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      errors.push("new password and confirmed new password must be the same");
    }

    return errors;
  }

};
var _default = AccountValidator;
exports.default = _default;