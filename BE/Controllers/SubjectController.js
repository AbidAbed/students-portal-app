const Subject = require("../Models/Subject");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Student = require("../Models/Student");
const secretkey = "secretkey";

async function postSubject(request, response) {
  try {
    const decoded = await jwt.verify(request.cookies.token, secretkey);
    if (decoded.role === "admin") {
      const subject = await Subject.create({
        passmark: request.body.passmark,
        name: request.body.name,
      });
      if (subject) {
        const subjectPlain = subject.get({ plain: true });
        response.status(201).send({ ...subjectPlain });
      } else response.status(400).send();
    } else {
      response.status(400).send();
    }
  } catch (err) {
    response.status(500).send();
    console.log(err);
  }
}

async function postAssignSubject(request, response) {
  try {
    const decoded = await jwt.verify(request.cookies.token, secretkey);
    if (decoded.role !== "admin") response.status(401).send();
    else {
      const user = await Student.findOne({
        where: { id: request.body.user_id },
      });
      console.log(request.body);
      const plainStudent = user.get({ plain: true });

      const subject = await Subject.findOne({
        where: { id: request.body.subject_id },
      });

      const plainSubject = subject.get({ plain: true });

      const regStudents = plainSubject.studentsIds.filter(
        (regSt) => regSt !== plainStudent.id
      );

      regStudents.push(plainStudent.id);

      const updatedSubject = await Subject.update(
        {
          ...plainSubject,
          studentsIds: [...regStudents],
        },
        { where: { id: plainSubject.id } }
      );

      const updatedStudent = await Student.update(
        {
          ...plainStudent,
          subjects: [
            ...plainStudent.subjects,
            { id: plainSubject.id, mark: 0 },
          ],
        },
        {
          where: { id: plainStudent.id },
        }
      );

      if (updatedStudent) response.status(201).send();
      else response.status(400).send();
    }
  } catch (err) {
    response.status(500).send();
    console.log(err);
  }
}

async function getAllSubjects(request, response) {
  try {
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");

    const decoded = jwt.verify(request.cookies.token, secretkey);
    if (decoded.role !== "admin") {
      response.status(401).send();
    } else {
      const subjects = await Subject.findAll({
        offset: (request.query.page - 1) * 10,
        limit: 10,
      });
      if (subjects) response.status(200).send([...subjects]);
      else response.status(400).send();
    }
  } catch (err) {
    response.status(500).send();
  }
}
async function deleteUserSubject(request, response) {
  try {
    const decoded = jwt.verify(request.cookies.token, secretkey);
    if (decoded.role !== "admin") {
      response.status(401).send();
    } else {
      const user = await Student.findOne({
        where: { id: request.body.user_id },
      });
      const plainStudent = user.get({ plain: true });

      const subject = await Subject.findOne({
        where: { id: request.body.subject_id },
      });

      const plainSubject = subject.get({ plain: true });

      const updatedSubjects = plainStudent.subjects.filter(
        (sub) => sub.id !== plainSubject.id
      );

      const rsltQUery = Student.update(
        {
          ...plainStudent,
          subjects: [...updatedSubjects],
        },
        { where: { id: request.body.user_id } }
      );
      if (rsltQUery) response.status(200).send();
      else response.status(400).send();
    }
  } catch (err) {
    response.status(500).send();
    console.log(err);
  }
}
async function postUserMark(request, response) {
  try {
    const decoded = jwt.verify(request.cookies.token, secretkey);
    if (decoded.role !== "admin") {
      response.status(401).send();
    } else {
      const user = await User.findOne({ where: { id: request.body.user_id } });
      const plainUser = user.get({ plain: true });
      const student = await Student.findOne({ where: { id: plainUser.id } });
      const studentPlain = student.get({ plain: true });
      const updatedSubjects = studentPlain.subjects.map((subject) => {
        const updatedSubject = request.body.subjects.find(
          (sub) => Number(sub.id) === Number(subject.id)
        );
        if (updatedSubject)
          return { id: subject.id, mark: updatedSubject.mark };
        else return subject;
      });

      studentPlain.subjects = [...updatedSubjects];
      console.log(studentPlain);
      const rsltQUery = await Student.update(
        {
          subjects: [...updatedSubjects],
        },
        { where: { id: studentPlain.id } }
      );
      if (rsltQUery) response.status(200).send();
      else response.status(400).send();
    }
  } catch (err) {
    response.status(500).send();
    console.log(err);
  }
}
module.exports = {
  postSubject,
  postAssignSubject,
  getAllSubjects,
  deleteUserSubject,
  postUserMark,
};
