"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const verificationToken = (sequelize, DataTypes) => {
  class VerificationToken extends _sequelize.default.Model {}

  VerificationToken.init({
    token: DataTypes.TEXT
  }, {
    underscored: true,
    sequelize,
    modelName: "verification_token"
  });

  VerificationToken.associate = models => {
    VerificationToken.belongsTo(models.Account, {
      foreignKey: {
        name: 'account_id',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return VerificationToken;
};

var _default = verificationToken;
exports.default = _default;