"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const category = (sequelize, DataTypes) => {
  class Category extends _sequelize.default.Model {}

  Category.init({
    name: DataTypes.TEXT
  }, {
    underscored: true,
    sequelize,
    modelName: "category"
  });

  Category.associate = models => {
    Category.belongsTo(models.Account, {
      foreignKey: {
        name: 'account_id',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return Category;
};

var _default = category;
exports.default = _default;