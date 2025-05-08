require("dotenv").config();

const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;

module.exports = {
  PORT,
  SECRET,
  DB_PASSWORD,
  DB_NAME,
  DB_USER,
};
