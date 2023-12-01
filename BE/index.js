const express = require("express");

const sequalize = require("./dbconfig");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

const cors = require("cors");

const bodyParser = require("body-parser");

const router = require("./Routes/Router");

const app = express();

app.use(morgan("dev"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// sequalize.sync({ force: true });

app.use(cors({ credentials: true, origin: true }));

app.listen(3000, () => {
  sequalize
    .authenticate()
    .then((rslt) => {
      console.log("DB connected");
    })
    .catch((err) => {
      console.log("Error connecting to the db");
    });
});

app.use(router);
