require("dotenv").config();

const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const DB_PASSWORD = process.env.DB_PASSWORD;

module.exports = {
  PORT,
  SECRET,
  DB_PASSWORD,
};
