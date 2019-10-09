"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const expense = (sequelize, DataTypes) => {
  class Expense extends _sequelize.default.Model {}

  Expense.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    description: DataTypes.TEXT,
    date: DataTypes.DATEONLY
  }, {
    underscored: true,
    sequelize,
    modelName: "expense"
  });

  Expense.associate = models => {
    Expense.belongsTo(models.Account, {
      foreignKey: {
        name: "account_id",
        allowNull: false
      },
      onDelete: "CASCADE"
    });
    Expense.belongsTo(models.Category, {
      foreignKey: {
        name: "category_id"
      }
    });
  };

  return Expense;
};

var _default = expense;
exports.default = _default;