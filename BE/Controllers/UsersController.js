const jwt = require("jsonwebtoken");
const secretkey = "secretkey";
const Student = require("../Models/Student");
const User = require("../Models/User");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const Subject = require("../Models/Subject");
var ObjectId = require("mongoose").Types.ObjectId;
const saltrounds = 10;
async function getAllUsers(request, response) {
  try {
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");

    const decoded = jwt.verify(request.cookies.token, secretkey);
    if (decoded.role !== "admin") {
      response.status(401).send();
    } else {
      const users = await User.findAll({
        where: {
          role: "student",
        },
        offset: (request.query.page - 1) * 10,
        limit: 10,
      });

      const userIds = users.map((user) => user.id);

      const students = await Student.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
      });

      const finalUserData = users.map((user) => {
        const student = students.find((s) => s.id === user.id);

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          username: student ? student.username : null,
          subjects: student ? student.subjects : null,
          isActivated: student ? student.isActivated : null,
        };
      });

      response.status(200).send({ users: finalUserData });
    }
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}
async function deleteUser(request, response) {
  try {
    const decoded = jwt.verify(request.cookies.token, secretkey);
    if (decoded.role !== "admin") {
      response.status(401).send();
    } else {
      const delQuery = await User.destroy({ where: { id: request.body.id } });
      const delQuerySt = await Student.destroy({
        where: { id: request.body.id },
      });
      response.status(200).send();
    }
  } catch (err) {}
}
async function putUser(request, response) {
  try {
    const decoded = jwt.verify(request.cookies.token, secretkey);
    if (decoded.role !== "admin") {
      response.status(401).send();
    } else {
      const user = await User.findOne({ where: { id: request.body.id } });
      const studentObject = {};
      const userObject = {};
      if (request.body.email) {
        const rsltQUery = await User.update(
          { email: request.body.email },
          { where: { id: request.body.id } }
        );
      }
      if (request.body.username) {
        const rsltQUery = await Student.update(
          {
            username: request.body.username,
            isActivated: request.body.isActivated,
          },
          { where: { id: request.body.id } }
        );
      }
      console.log(request.body.isActivated);
      if (request.body.isActivated) {
        const rsltQUery = await Student.update(
          { isActivated: request.body.isActivated },
          { where: { id: request.body.id }, returning: true }
        );
        console.log(rsltQUery);
      }
      response.status(201).send();
    }
  } catch (err) {
    response.status(500).send();
    console.log(err);
  }
}
async function postCreateUser(request, response) {
  try {
    const decoded = jwt.verify(request.cookies.token, secretkey);
    if (decoded.role !== "admin") {
      response.status(401).send();
    } else {
      const saltrounds = 10;
      const hashedPassword = await bcrypt.hash(
        request.body.password,
        saltrounds
      );
      const rsltQuery = await User.create({
        password: hashedPassword,
        email: request.body.email,
      });
      const userPlain = rsltQuery.get({ plain: true });
      if (rsltQuery) {
        const studentRsltQUery = await Student.create({
          id: userPlain.id,
          username: request.body.username,
          isActivated: request.body.isActivated,
        });
        if (studentRsltQUery) {
          const { password, ...rest } = userPlain;
          const studentPlain = studentRsltQUery.get({ plain: true });
          response.status(200).send({ ...rest, ...studentPlain });
        }
      } else response.status(400).send();
    }
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}
async function getUserInfo(request, response) {
  try {
    const decoded = jwt.verify(request.cookies.token, secretkey);
    if (decoded.role === "admin") {
      response.status(401).send();
    } else {
      console.log(decoded);
      const user = { id: decoded.id, email: decoded.email };
      const student = await Student.findOne({ where: { id: user.id } });
      const studentPlain = student.get({ plain: true });
      if (student) response.status(200).send({ ...studentPlain, ...user });
      else response.status(400).send();
    }
  } catch (err) {
    response.status(500).send();
  }
}
module.exports = {
  getAllUsers,
  deleteUser,
  putUser,
  postCreateUser,
  getUserInfo,
};
