const logoutRouter = require("express").Router();
const { DisabledJwt } = require("../models");

logoutRouter.post("/", async (request, response) => {
  const authorization = request.get("authorization");
  const token = authorization.substring(7);

  const enabledToken = await DisabledJwt.create({ token });

  response.status(200).json(enabledToken);
});

module.exports = logoutRouter;
