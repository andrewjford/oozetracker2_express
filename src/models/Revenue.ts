import Sequelize from "sequelize";

class Revenue extends Sequelize.Model {
  public associate(models) {
    Revenue.belongsTo(models.Account, {
      foreignKey: {
        name: "account_id",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  }
}

const getRevenue = (sequelize, DataTypes) => {
  Revenue.init(
    {
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      date: DataTypes.DATE,
    },
    {
      underscored: true,
      sequelize,
      modelName: "Revenue",
    }
  );

  return Revenue;
};

export default getRevenue;
