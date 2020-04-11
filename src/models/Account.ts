import Sequelize from "sequelize";

const account = (sequelize, DataTypes) => {
  class Account extends Sequelize.Model {}
  Account.init(
    {
      name: DataTypes.TEXT,
      email: DataTypes.TEXT,
      password: DataTypes.TEXT,
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      username: DataTypes.TEXT,
    },
    {
      underscored: true,
      sequelize,
      modelName: "account",
    }
  );

  //@ts-ignore
  Account.associations = (models) => {
    Account.hasOne(models.VerificationToken);
  };

  return Account;
};

export default account;
