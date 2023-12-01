const jwt = require("jsonwebtoken");
const secretkey = "secretkey";
const Student = require("../Models/Student");
const User = require("../Models/User");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const Subject = require("../Models/Subject");
var ObjectId = require("mongoose").Types.ObjectId;
const saltrounds = 10;

async function getChatPeople(request, response) {
  try {
    const decoded = jwt.verify(request.cookies.token, secretkey);
    if (decoded.role !== "admin") {
      const student = await Student.findOne({
        where: { id: request.query.id },
      });
      const studentPlain = student.get({ plain: true });

      const subject_ids = studentPlain.subjects.map((sub) => sub.id);

      const chatPeopleIds = await Subject.findAll({
        attributes: ["studentsIds"],
        where: { id: subject_ids },
      });

      const chatPeopleIdsPlain = chatPeopleIds.reduce((prevVal, curVal) => {
        const personPlain = curVal.get({ plain: true });
        return [...prevVal, ...personPlain.studentsIds];
      }, []);

      console.log(chatPeopleIdsPlain);
      const chatPeople = await Student.findAll({
        attributes: ["username", "id"],
        where: {
          id: {
            [Op.not]: request.query.id,
            [Op.in]: chatPeopleIdsPlain,
          },
        },
        offset: (request.query.page - 1) * 10,
        limit: 10,
      });

      const admins = await User.findAll({
        attributes: ["id"],
        where: { role: "admin" },
      });
      const adminsFinal = admins.map((admin) => {
        const plainAdmin = admin.get({ plain: true });
        return { ...plainAdmin, username: "admin" };
      });
      if (chatPeople) {
        response.status(200).send([...adminsFinal, ...chatPeople]);
      }
    } else {
      const admins = await User.findAll({
        attributes: ["id"],
        where: {
          id: {
            [Op.ne]: request.query.id,
          },
          role: "admin",
        },
        offset: (Number(request.query.page) - 1) * 10,
        limit: 10,
      });
      console.log();
      const users = await User.findAll({
        attributes: ["id"],
        where: { role: "student" },
      });
      const usersPlain = users.map((usr) => {
        const usrPlain = usr.get({ plain: true });
        return usrPlain;
      });
      const adminsPlain = admins.map((admin) => {
        const adminPlain = admin.get({ plain: true });
        return { ...adminPlain, username: "admin" };
      });
      console.log(adminsPlain, usersPlain);
      const usersIds = usersPlain.map((usr) => usr.id);
      const students = await Student.findAll({
        attributes: ["id", "username"],
        where: { id: usersIds },
        offset: (Number(request.query.page) - 1) * 10,
        limit: 10,
      });
      const studentsPlain = students.map((student) => {
        const studentPlain = student.get({ plain: true });
        return studentPlain;
      });
      response.status(200).send([...studentsPlain, ...adminsPlain]);
    }
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}
async function getChatForUser(request, response) {
  try {
    const userChat = await User.findOne({
      attributes: ["chat"],
      where: { id: request.query.user_id },
    });
    const userChatPlain = userChat.get({ plain: true });

    const requestedChat = Object.entries(userChatPlain.chat).reduce(
      (prevObj, curObj) => {
        if (Number(curObj[0]) === Number(request.query.chat_with_id)) {
          return [...prevObj, curObj[1]];
        } else return [...prevObj];
      },
      []
    );
    console.log(requestedChat);
    const sortedMessages = requestedChat.sort((a, b) => a.time - b.time);

    response.status(200).send(...sortedMessages);
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}
async function addChatToUser(request, response) {
  try {
    console.log(request.query.page);
    const user = await User.findOne({ where: { id: request.body.id } });
    const userPlain = user.get({ plain: true });

    if (userPlain.chat[request.body.chat_with_id] === undefined) {
      userPlain.chat[request.body.chat_with_id] = [];
    }
    console.log(userPlain.chat[request.body.chat_with_id]);
    userPlain.chat = {
      ...userPlain.chat,
      [request.body.chat_with_id]: [
        ...userPlain.chat[request.body.chat_with_id],
        {
          id: request.body.sender_id,
          msg: request.body.msg,
          time: request.body.time,
        },
      ],
    };
    const rsltQuery = await User.update(
      { ...userPlain },
      { where: { id: request.body.id } }
    );
    if (rsltQuery) response.status(200).send();
    else response.status(400).send();
  } catch (err) {
    response.status(500).send();
    console.log(err);
  }
}
module.exports = { getChatPeople, getChatForUser, addChatToUser };
