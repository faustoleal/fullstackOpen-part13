const blogsRouter = require("express").Router();
const { Blog, User } = require("../models");
const { tokenExtractor } = require("../utils/middelware");
const { Op } = require("sequelize");

blogsRouter.get("/", async (request, response) => {
  let where = {};

  if (request.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: request.query.search,
          },
        },
        {
          author: {
            [Op.substring]: request.query.search,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    order: [["likes", "DESC"]],
    where,
  });

  response.json(blogs);
});

blogsRouter.post("/", tokenExtractor, async (request, response, next) => {
  try {
    const user = await User.findByPk(request.decodedToken.id);
    console.log(user);
    const blog = await Blog.create({ ...request.body, userId: user.id });
    response.json(blog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", tokenExtractor, async (request, response) => {
  const blog = await Blog.findByPk(request.params.id);

  if (!request.decodedToken || request.decodedToken.id !== blog.userId) {
    return response.status(400).json({
      error: "You are not the author of the post, so you can not delete it",
    });
  } else {
    await blog.destroy();
    response.json(blog);
    response.status(200).end;
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findByPk(request.params.id);
    blog.likes = request.body.likes;
    await blog.save();

    response.json(blog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
