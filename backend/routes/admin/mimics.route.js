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
  route.post("/getAllCategories", mimicsCtrl.getAllCategories);
  route.post("/uploadMimicImages", mimicsCtrl.uploadMimicImages);
  route.post("/addImages", mimicsCtrl.addImages);
  route.post("/getAllImages", mimicsCtrl.getAllImages);
  route.post("/saveBlocksData", mimicsCtrl.saveBlocksData);
  route.post("/getBlocksData", mimicsCtrl.getBlocksData);
  route.post("/updateBlocksArch", mimicsCtrl.updateBlocksArch);
  route.post("/saveMimicSettings", mimicsCtrl.saveMimicSettings);
  route.post("/saveMimicSchedule", mimicsCtrl.saveMimicSchedule);
  route.post("/getScheduleData", mimicsCtrl.getScheduleData);
  route.post("/saveMetersData", mimicsCtrl.saveMetersData);
  route.post("/addDataMeterBlock", mimicsCtrl.addDataMeterBlock);
  route.post("/deleteImage", mimicsCtrl.deleteImage);
  route.post("/fetchCumulativeData", mimicsCtrl.fetchCumulativeData);
  route.post("/fetchSummaryData", mimicsCtrl.fetchSummaryData);
 
  app.use("/mimics", route);
};
