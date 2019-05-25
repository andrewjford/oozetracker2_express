import Sequelize from 'sequelize';

const verificationToken = (sequelize, DataTypes) => {
  class VerificationToken extends Sequelize.Model {}
  VerificationToken.init({
    token: DataTypes.TEXT,
  }, {
    underscored: true,
    sequelize,
    modelName: "verification_token",
  });

  VerificationToken.associate = models => {
    VerificationToken.belongsTo(models.Account, {
      foreignKey: {
        name: 'account_id',
        allowNull: false,
      },
    });
  }

  return VerificationToken;
}

export default verificationToken;