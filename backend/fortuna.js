const express = require("express");
const router = express.Router();
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./config/db");
const models = require("./models/index.model");
const passport = require("passport");

const http = require('http');
// const connection = require('./config/connection')

//let executeCronJob = require('./config/cronJob');
//const swaggerJSDoc = require("swagger-jsdoc");
//const swaggerUi = require("swagger-ui-express");

const cors = require("cors");
const app = express();

// swagger definition

// const options = {
//   swaggerDefinition: {
//     info: {
//       title: "FreightCamp",
//       version: "1.0.0",
//       description: "Here the list of all the RestApis"
//     }
//   },
//   apis: ["./routes/*.js"],
//   deepLinking: true
// };

// initialize swagger-jsdoc
//const swaggerSpec = swaggerJSDoc(options);
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
const jsonParser = bodyParser.json({
  limit: 1024 * 1024 * 20,
  type: "application/json"
});

const urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: 1024 * 1024 * 20,
  type: "application/x-www-form-urlencoding"
});

app.use(jsonParser);
app.use(urlencodedParser);
app.use(logger("dev"));

const indexRouter = require("./routes/index")(app, router);

app.use("/", express.static(path.join(__dirname, "/dist/admin/sofbox-dashboard-angular")));

/*admin routes for staging*/
app.use("/admin", express.static(path.join(__dirname, "/dist/admin/sofbox-dashboard-angular")));
app.use("/admin/*", express.static(path.join(__dirname, "/dist/admin/sofbox-dashboard-angular")));

/*gymowner routes for staging*/
//app.use('/gymowner', express.static(path.join(__dirname, '/gymowner/dist')));
//app.use('/gymowner/*', express.static(path.join(__dirname, '/gymowner/dist')));



app.use(cookieParser());


// app.get("/", function(req, res) {
//   return res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
// });
// app.get("/!*", function(req, res) {
//   return res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
// });
// app.get("/admin/!*", function(req, res) {
//   return res.sendFile(path.join(__dirname, "/admin/dist/index.html"));
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;
