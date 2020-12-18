"use strict";

module.exports = function(app, route) {
  var usersCtrl = require("../../controllers/admin/users.controller");
  //var auth = require("../../auth/auth");

  route.post("/fetchUsersData", usersCtrl.fetchUsersData);
  route.post("/addUser", usersCtrl.addUser);
  route.post("/updateUser", usersCtrl.updateUser);
  route.post("/uploadImage", usersCtrl.uploadImage);
  route.post("/getUserDetail", usersCtrl.getUserDetail);
  route.post("/deleteUser", usersCtrl.deleteUser);
  route.post("/changeActivation", usersCtrl.changeActivation);
 
  app.use("/users", route);
};
