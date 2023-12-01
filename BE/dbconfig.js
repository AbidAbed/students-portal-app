const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "StudentsPortalDB",
  "admin@studentsPortal",
  "1234",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

module.exports = sequelize;

/* 
CREATE TABLE IF NOT EXISTS public.students (
  id SERIAL PRIMARY KEY,
  subjects JSONB[] NOT NULL DEFAULT ARRAY[],
  isActivated BOOLEAN NOT NULL DEFAULT false,
  username VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS public.subjects (
  id BIGINT PRIMARY KEY,
  passmark DOUBLE PRECISION NOT NULL,
  name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS public.users (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL DEFAULT 'student'
);


*/