const usersRouter = require("express").Router();
const { User, Blog, ReadingList } = require("../models");
const { Op } = require("sequelize");

usersRouter.get("/", async (request, response) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  const where = {
    id,
  };

  if (request.query.read === "true") {
    where["$readings.readingLists.read$"] = true;
  } else if (request.query.read === "false") {
    where["$readings.readingLists.read$"] = false;
  }

  const user = await User.findOne({
    attributes: ["name", "username"],
    where,
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "createAt", "updateAt"] },
        through: {
          attributes: [],
        },
        include: [
          {
            model: ReadingList,
            attributes: ["read", "id"],
          },
        ],
      },
    ],
  });

  response.json(user);
});

usersRouter.post("/", async (request, response, next) => {
  try {
    const user = await User.create(request.body);
    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:username", async (request, response, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: request.params.username,
      },
    });
    user.name = request.body.name;
    await user.save();

    response.json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:id", async (request, response) => {
  const user = await User.findByPk(request.params.id);

  if (user) {
    await user.destroy();
    response.json(user);
    response.status(200).end();
  }
});

module.exports = usersRouter;
