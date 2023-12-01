const User = require("../Models/User");
const Student = require("../Models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltrounds = 10;
const secretkey = "secretkey";

async function postSignup(request, response) {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, saltrounds);

    const query = await User.create({
      email: request.body.email,
      password: hashedPassword,
      role: "student",
    });

    const studentQuery = await Student.create({
      id: query.id,
      username: request.body.username,
      isActivated: false,
      subjects: [],
    });

    response.status(201).send();
  } catch (err) {
    console.log(err);
  }
}
module.exports = { postSignup };
