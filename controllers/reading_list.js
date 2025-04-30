const readingListRouter = require("express").Router();

const { ReadingList, User } = require("../models");
const { tokenExtractor } = require("../utils/middelware");

readingListRouter.post("/", async (request, response) => {
  const { blogId, userId } = request.body;
  const readingList = await ReadingList.create({ blogId, userId });

  response.json(readingList);
});

readingListRouter.put("/:id", tokenExtractor, async (request, response) => {
  const readingList = await ReadingList.findByPk(request.params.id);
  if (!request.decodedToken || request.decodedToken.id !== readingList.userId) {
    return response.status(400).json({
      error: "You are not the author of the post, so you can not delete it",
    });
  } else {
    readingList.read = request.body.read;
    readingList.save();

    response.json(readingList);
  }
});

module.exports = readingListRouter;
