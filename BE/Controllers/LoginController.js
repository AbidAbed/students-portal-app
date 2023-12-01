const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../Models/Student");
const Subject = require("../Models/Subject");

const saltrounds = 10;
const secretkey = "secretkey";
async function postLogin(request, response) {
  try {
    const query = await User.findOne({ where: { email: request.body.email } });
    if (query)
      bcrypt.compare(
        request.body.password,
        query.password,
        function (err, res) {
          console.log(err, res);
          if (err) {
            response.status(500).send();
          }
          if (res) {
            //gen JWT
            console.log({ id: query.id, role: query.role, email: query.email });
            const token = jwt.sign(
              { id: query.id, role: query.role, email: query.email },
              secretkey
            );
            response.cookie("token", token);
            response.status(200).send();
          } else {
            response.status(401).send();
          }
        }
      );
    else response.status(404).send();
  } catch (err) {
    console.log(err);
  }
}
async function postAuth(request, response) {
  try {
    console.log(request.cookies);
    const decoded = await jwt.verify(request.cookies.token, secretkey);
    console.log(decoded);
    if (decoded.role !== "admin") {
      const student = await Student.findOne({ where: { id: decoded.id } });
      const studentPlain = student.get({ plain: true });
      const subjectIds = studentPlain.subjects.map((subject) => subject.id);

      const subjects = await Subject.findAll({
        where: {
          id: subjectIds,
        },
      });

      const plainSubjects = subjects.map((sub) => {
        const plainSub = sub.get({ plain: true });
        return plainSub;
      });

      const finalSubjects = plainSubjects.reduce((prevSub, currSub) => {
        const studentSubject = studentPlain.subjects.find(
          (subj) => subj.id === currSub.id
        );
        return [...prevSub, { ...currSub, ...studentSubject }];
      }, []);

      console.log(finalSubjects);
      response.status(200).send({
        role: decoded.role,
        id: decoded.id,
        email: decoded.email,
        ...studentPlain,
        subjects: [...finalSubjects],
      });
    } else response.status(200).send({ role: decoded.role, id: decoded.id });
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}
async function postLogout(request, response) {
  try {
    response.cookie("token", "", { maxAge: 0, httpOnly: true });
    response.status(200).send();
  } catch (err) {
    response.status(500).send();
  }
}
module.exports = { postLogin, postAuth, postLogout };
