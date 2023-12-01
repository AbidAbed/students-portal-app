const { Router } = require("express");
const SubjectsRouter = Router();
const postSubjectValidator = require("../validators/Subjects/postSubjectValidator");
const postAssignSubjectValidator = require("../validators/Subjects/postAssignSubjectValidator");
const getAllSubjectsValidator = require("../validators/Subjects/getAllSubjectsValidator");
const deleteUserSubjectValidator = require("../validators/Subjects/deleteUserSubjectValidator");
const {
  postSubject,
  postAssignSubject,
  getAllSubjects,
  deleteUserSubject,
  postUserMark,
} = require("../Controllers/SubjectController");
const postUserMarksValidator = require("../validators/Subjects/postUserMarksValidator");

SubjectsRouter.post("/subjects", postSubjectValidator, postSubject);
SubjectsRouter.post(
  "/subject/assign",
  postAssignSubjectValidator,
  postAssignSubject
);
SubjectsRouter.get("/subjects", getAllSubjectsValidator, getAllSubjects);
SubjectsRouter.delete(
  "/subject/assign",
  deleteUserSubjectValidator,
  deleteUserSubject
);
SubjectsRouter.post("/subject/mark", postUserMarksValidator, postUserMark);
module.exports = { SubjectsRouter };
