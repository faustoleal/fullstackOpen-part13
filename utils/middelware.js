const logger = require("./logger");
const jwt = require("jsonwebtoken");

const { SECRET } = require("./config");
const { DisabledJwt, User } = require("../models");

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return response.status(400).send({ error: error.message });
  } else if ((error.name = "SequelizeDatabaseError")) {
    return response.status(400).json({ error: "likes must be a number" });
  }
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      const token = authorization.substring(7);
      const disabledToken = await DisabledJwt.findOne({
        where: {
          token: token,
        },
      });

      const decodedToken = jwt.verify(token, SECRET);
      const user = await User.findByPk(decodedToken.id);

      if (disabledToken) {
        response.status(401).json({ error: "enabled token" });
      } else if (!user.enabled) {
        response.status(401).json({ error: "disabled user" });
      } else {
        request.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      }
    } catch (error) {
      response.status(401).json({ error: "invalid token" });
    }
  } else {
    response.json({ error: "missing token" });
  }

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  unknownEndpoint,
};
