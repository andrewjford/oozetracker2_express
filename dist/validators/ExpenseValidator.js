"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const ExpenseValidator = {
  onSearch(req) {
    const errors = [];

    if (req.query.startDate && !req.query.endDate || !req.query.startDate && req.query.endDate) {
      errors.push("A start date and end date must be paired");
    }

    return errors;
  }

};
var _default = ExpenseValidator;
exports.default = _default;