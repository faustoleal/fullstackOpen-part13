const Sequelize = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const { DB_PASSWORD } = require("./config");

const sequelize = new Sequelize(
  "fullstack-part13",
  "postgres",
  `${DB_PASSWORD}`,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

const migrationConf = {
  migrations: {
    glob: "migrations/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize, rollbackMigration };
