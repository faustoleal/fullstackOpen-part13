const { DataTypes, Model } = require("sequelize");

const { sequelize } = require("../utils/db");

class DisabledJwt extends Model {}

DisabledJwt.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "disabledJwt",
  }
);

module.exports = DisabledJwt;
