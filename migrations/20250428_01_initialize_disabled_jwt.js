const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("disabled_jwts", {
      token: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("disabled_jwts");
  },
};
