import Sequelize from "sequelize";

const expense = (sequelize, DataTypes) => {
  class Expense extends Sequelize.Model {}

  Expense.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      date: DataTypes.DATEONLY,
    },
    {
      underscored: true,
      sequelize,
      modelName: "expense",
    }
  );

  //@ts-ignore
  Expense.associate = (models) => {
    Expense.belongsTo(models.Account, {
      foreignKey: {
        name: "account_id",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });

    Expense.belongsTo(models.Category, {
      foreignKey: {
        name: "category_id",
      },
    });
  };

  return Expense;
};

export default expense;
