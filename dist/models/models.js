"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.sequelize = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sequelize = new _sequelize.default(process.env.DATABASE_URL, {
  dialect: 'postgres'
});
exports.sequelize = sequelize;
const models = {
  Account: sequelize.import('./Account'),
  VerificationToken: sequelize.import('./VerificationToken'),
  Category: sequelize.import('./Category'),
  Expense: sequelize.import('./Expense')
};
Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});
var _default = models;
exports.default = _default;