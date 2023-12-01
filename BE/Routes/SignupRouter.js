const { Router } = require("express");

const { postSignup } = require("../Controllers/SignupController");

const postSignupValidator = require("../validators/postSignupValidator");

const SignupRouter = Router();

SignupRouter.post("/signup", postSignupValidator, postSignup);

module.exports = SignupRouter;
