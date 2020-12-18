"use strict";

module.exports = function(app, route) {
  var mimicsCtrl = require("../../controllers/admin/mimics.controller");
  //var auth = require("../../auth/auth");

  route.post("/fetchMimicsData", mimicsCtrl.fetchMimicsData);
  route.post("/addMimic", mimicsCtrl.addMimic);
  route.post("/updateMimic", mimicsCtrl.updateMimic);
  route.post("/getMimicDetail", mimicsCtrl.getMimicDetail);
  route.post("/deleteMimic", mimicsCtrl.deleteMimic);
  route.post("/changeMimicActivation", mimicsCtrl.changeActivation);
  route.post("/updateMimicArch", mimicsCtrl.updateMimicArch);
 
  app.use("/mimics", route);
};
