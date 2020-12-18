/*var schedule = require('node-schedule');
var Product = require('../models/product.model');
var generateSiteMapXml = require('../config/generateSiteMap');

var j = schedule.scheduleJob('0 1 * * *', function(){
    var condition = {};
    console.log("executing cron job =====>>>>>");
    condition["version_one.is_deleted"] = false
    Product.find(condition)
    .select({ version_one: 1, productId: 1, productCode: 1 })
    .populate('version_one.venueId', 'version_one.location')
    .populate('version_one.spaceType', 'name')
    .lean()
    .exec(async function (err, products) {
        if(err) {
            console.log('Something went wrong',err);
        }
        if(!products) {
            console.log('Products not found');
        }
        else {
            let result = await generateSiteMapXml.addUrl(products);
            console.log(result);
        }
    })
});*/