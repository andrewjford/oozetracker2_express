import Sequelize from 'sequelize';

const account = (sequelize, DataTypes) => {
  class Account extends Sequelize.Model {}
  Account.init({
    name: DataTypes.TEXT,
    email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    isVerified: DataTypes.BOOLEAN,
  }, {
    underscored: true,
    sequelize,
    modelName: "account",
  });

  Account.associations = models => {
    Account.hasOne(models.VerificationToken);
  }

  return Account;
}

export default account;