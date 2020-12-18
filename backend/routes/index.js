module.exports = (app, router) => {
    var userRoute = require("./admin/users.route.js")(app, router);
    var adminRoute = require("./admin/admin.route.js")(app, router);
    var mimicRoute = require("./admin/mimics.route.js")(app, router);
};
