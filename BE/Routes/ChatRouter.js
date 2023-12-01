const { Router } = require("express");
const getChatPeopleValidator = require("../validators/Chat/getChatPeopleValidator");
const {
  getChatPeople,
  getChatForUser,
  addChatToUser,
} = require("../Controllers/ChatController");
const getChatForUserValidator = require("../validators/Chat/getChatForUserValidator");
const postAddChatToUserValidator = require("../validators/Chat/postAddChatToUserValidator");
const ChatRouter = Router();

ChatRouter.get("/users/chat", getChatPeopleValidator, getChatPeople);
ChatRouter.get("/user/chat", getChatForUserValidator, getChatForUser);
ChatRouter.post("/user/chat", postAddChatToUserValidator, addChatToUser);
module.exports = ChatRouter;
