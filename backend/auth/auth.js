var mongoose = require("mongoose");
var CompanyAdmin = require("../models/company_admin.model");
var Company = require("../models/company.model");
var cAdminCtrl = require("../controllers/admin.controller");
var attAdminCtrl = require("../controllers/attendee_admin/attendee_admin.controller");

module.exports = {
  auth: (req, res, next) => {
    if (
      !req.headers["authorization"] ||
      req.headers["authorization"] === "undefined"
    ) {
      return res.json({
        status: "Failure",
        code: 401,
        msg: "Invalid request - Token Not found."
      });
    }

    let token =
      req.headers["authorization"].split(" ")[0] === "Bearer"
        ? req.headers["authorization"].split(" ")[1]
        : req.headers["authorization"];
    var cAdmin = new CompanyAdmin();
    cAdmin.verifyToken(token, function(valid) {
      if (!valid) {
        return res.json({
          status: "Failure",
          code: 401,
          msg: "Invalid tokens please login again."
        });
      } else {
        cAdminCtrl.getCAdminDetails(valid._id, function(cAdminData) {
          if (!cAdminData) {
            return res.json({
              status: "Failure",
              code: 401,
              msg: "Invalid tokens please login again."
            });
          }
          else {
            req.cAdminData = cAdminData;
            req.user_params = cAdminData;
            next();
          }
        });
      }
    });
  },
  attendeeAuth: (req, res, next) => {
    if (
      !req.headers["authorization"] ||
      req.headers["authorization"] === "undefined"
    ) {
      return res.json({
        status: "Failure",
        code: 401,
        msg: "Invalid request - Token Not found."
      });
    }
    let token =
      req.headers["authorization"].split(" ")[0] === "Bearer"
        ? req.headers["authorization"].split(" ")[1]
        : req.headers["authorization"];
    var company = new Company();
    company.verifyToken(token, function(valid) {
      if (!valid) {
        return res.json({
          status: "Failure",
          code: 401,
          msg: "Invalid tokens please login again."
        });
      } else {
        let validId = {
          company_id: valid._id
        }
        attAdminCtrl.getAttendeeDetail(validId, function(attendeeData) {
          if (!attendeeData) {
            return res.json({
              status: "Failure",
              code: 401,
              msg: "Invalid tokens please login again."
            });
          }
          else {
            req.attendeeData = attendeeData;
            req.attendee_params = attendeeData;
            next();
          }
        });
      }
    });
  }
};
