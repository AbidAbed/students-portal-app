const { Router } = require("express");
const { errors } = require("celebrate");

const router = Router();

const LoginRouter = require("./LoginRouter");

const SignupRouter = require("./SignupRouter");
const UsersRouter = require("./UsersRouter");
const { SubjectsRouter } = require("./SubjectsRoute");
const ChatRouter = require("./ChatRouter");

router.use(LoginRouter);

router.use(SignupRouter);

router.use(UsersRouter);

router.use(SubjectsRouter);

router.use(ChatRouter);

async function errorsHandler(err, request, response, next) {
  try {
    response.status(400);

    const { details } = err;
    const error = {};

    details.forEach((element) => {
      const errorData = element.details[0];
      const { path, message } = errorData;
      error[path] = message.replaceAll('"', "");
    });
    response.json(error);
  } catch (err) {
    response.status(500).send({ error: "Internal Server Error" });
  }
}
router.use(errorsHandler);

module.exports = router;
