"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const account = (sequelize, DataTypes) => {
  class Account extends _sequelize.default.Model {}

  Account.init({
    name: DataTypes.TEXT,
    email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    underscored: true,
    sequelize,
    modelName: "account"
  });

  Account.associations = models => {
    Account.hasOne(models.VerificationToken);
  };

  return Account;
};

var _default = account;
exports.default = _default;