const authorsRouter = require("express").Router();
const { Blog } = require("../models");
const { sequelize } = require("../utils/db");

authorsRouter.get("/", async (request, response) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
      [sequelize.fn("COUNT", sequelize.col("id")), "articles"],
    ],
    group: ["author"],
    order: [["likes", "DESC"]],
  });

  response.json(authors);
});

module.exports = authorsRouter;
