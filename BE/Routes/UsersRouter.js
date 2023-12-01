const { Router } = require("express");
const {
  getAllUsers,
  deleteUser,
  putUser,
  postCreateUser,
  getUserInfo,
} = require("../Controllers/UsersController");
const getAllUsersValidator = require("../validators/users/getAllUsersValidator");
const deleteUserValidator = require("../validators/users/deleteUserValidator");
const putUserValidator = require("../validators/users/putUserValidator");
const postCreateUserValidator = require("../validators/users/postCreateUserValidator");
const postAuthValidator = require("../validators/postAuthValidator");

const UsersRouter = Router();

UsersRouter.get("/users", getAllUsersValidator, getAllUsers);
UsersRouter.delete("/user", deleteUserValidator, deleteUser);
UsersRouter.put("/user", putUserValidator, putUser);
UsersRouter.post("/admin/user", postCreateUserValidator, postCreateUser);
UsersRouter.get("/user", postAuthValidator, getUserInfo);
module.exports = UsersRouter;
