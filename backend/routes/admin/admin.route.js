"use strict";

module.exports = function(app, route) {
  var adminCtrl = require("../../controllers/admin/admin.controller");
  //var auth = require("../../auth/auth");

  route.post("/loginAdmin", adminCtrl.loginAdmin);
  route.post("/accountSetting", adminCtrl.accountSetting);
  route.post("/resetPasswordAdmin", adminCtrl.resetPasswordAdmin);
 
  app.use("/admin", route);
};
