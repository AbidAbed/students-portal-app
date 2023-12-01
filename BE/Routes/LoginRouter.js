const { Router } = require("express");

const {
  postLogin,
  postAuth,
  postLogout,
} = require("../Controllers/LoginController");

const postLoginValidator = require("../validators/postLoginValidator");

const postAuthValidator = require("../validators/postAuthValidator");
const LoginRouter = Router();

LoginRouter.post("/login", postLoginValidator, postLogin);

LoginRouter.post("/auth", postAuthValidator, postAuth);

LoginRouter.post("/logout", postAuthValidator, postLogout);
module.exports = LoginRouter;
