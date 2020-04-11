import { Sequelize, Model } from "sequelize";

const verificationToken = (sequelize, DataTypes) => {
  class VerificationToken extends Model {}
  VerificationToken.init(
    {
      token: DataTypes.TEXT,
    },
    {
      underscored: true,
      sequelize,
      modelName: "verification_token",
    }
  );

  //@ts-ignore
  VerificationToken.associate = (models) => {
    VerificationToken.belongsTo(models.Account, {
      foreignKey: {
        name: "account_id",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };

  return VerificationToken;
};

export default verificationToken;
