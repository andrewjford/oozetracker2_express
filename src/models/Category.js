import Sequelize from 'sequelize';

const category = (sequelize, DataTypes) => {
  class Category extends Sequelize.Model {}
  Category.init({
    name: DataTypes.TEXT,
  }, {
    underscored: true,
    sequelize,
    modelName: "category",
  });

  Category.associate = models => {
    Category.belongsTo(models.Account, {
      foreignKey: {
        name: 'account_id',
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
  }

  return Category;
}

export default category;