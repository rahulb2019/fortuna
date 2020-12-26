var mongoose = require("mongoose");
var Mimic = mongoose.model("sites");
var SIC = mongoose.model("site_image_categories");
var siteImage = mongoose.model("site_images");
var crypto = require("crypto");
const ObjectId = require("mongoose").Types.ObjectId;

let obj = {}


obj.getAllMimics = (data) => {
    return new Promise((resolve, reject) => {
        let aggregateQuery = [];
        let query = { is_deleted: false };
        if (data.options && data.options.search) {
            let searchQuery = {
                $or: [
                    { name: { $regex: data.options.search, $options: "i" } },
                    { address: { $regex: data.options.search, $options: "i" } },
                    { city: { $regex: data.options.search, $options: "i" } },
                    { state: { $regex: data.options.search, $options: "i" } },
                    { created_at: { $regex: data.options.search, $options: "i" } },
                ]
            };
            query = { $and: [query, searchQuery] };
        }
        aggregateQuery.push({ $match: query });
        if (data.options && data.options.sort) {
            let sortField = "$" + data.options.sort;
            aggregateQuery.push({
                $addFields: { sortField: { $toLower: sortField } }
            });
            let sortOrder = Number(data.options.order);
            aggregateQuery.push({ $sort: { sortField: sortOrder } });
        } else {
            aggregateQuery.push({ $sort: { created_at: -1 } });
        }
        if (data.options && data.options.offSet && data.options.limit) {
            let offSet = Number(data.options.offSet);
            let skip = (Number(offSet) - 1) * data.options.limit;
            aggregateQuery.push({ $skip: skip }, { $limit: data.options.limit });
        }
        
        Mimic.aggregate(aggregateQuery).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}


obj.addMimicData = (data) => {
    return new Promise((resolve, reject) => {
        let new_mimic = new Mimic(data);
        new_mimic.save(function (err, result) {
            if (err) {
                resolve({
                    status: "Failure",
                    code: 301,
                    Error: "Error on Saving Data."
                });
            } else {
                resolve(result);
            }
        });
    })
}


obj.updateMimicData = (data) => {
    return new Promise((resolve, reject) => {
        let updatedData = Object.assign({}, data);
        delete updatedData.id;
        Mimic.findByIdAndUpdate(data.id, updatedData)
            .then(function (response) {
                resolve(200);
            })
            .catch(function (error) {
                reject(301);
            });
    })
}

obj.updateMimicArchData = (data) => {
    return new Promise((resolve, reject) => {
        Mimic.findOneAndUpdate({ _id: data.id }, { $set: { mimic_data: data.mimic_data } }, function(
            err,
            response
          ) {
            if (err) {
                reject(301);
              } else {
                resolve(200);
              }
          });
    })
}


obj.getMimicData = (data) => {
    return new Promise((resolve, reject) => {
        Mimic.findById(data.mimicId, function (err, data) { 
            if (err){ 
                reject(err); 
            } 
            else{ 
                resolve(data)
            } 
        });
    })
}


obj.deleteMimicData = (data) => {
    return new Promise((resolve, reject) => {
        let deletedData = { is_deleted: true };
        Mimic.update(
            { _id: { $in: data.records } },
            { $set: deletedData },
            { "multi": true }
        ).then(function (response) {
                resolve(200);
            })
            .catch(function (error) {
                reject(301);
            });
    })
}


obj.changeActivationMimicData = (data) => {
    return new Promise((resolve, reject) => {
        let updatedData = { is_blocked: data.is_blocked };
        Mimic.findByIdAndUpdate(data.mimicId, updatedData)
            .then(function (response) {
                resolve(200);
            })
            .catch(function (error) {
                reject(301);
            });
    })
}

obj.getAllCategories = (data) => {
    return new Promise((resolve, reject) => {
        let aggregateQuery = [];
        let query = { is_deleted: false };
        if (data.options && data.options.search) {
            let sortQuery = { $sort: { created_at: -1 } }
            query = { $and: [query, sortQuery] };
        }
        aggregateQuery.push({ $match: query });
        
        SIC.aggregate(aggregateQuery).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}

obj.addMimicImages = (data) => {
    return new Promise(function (resolve, reject) {
        let respArr = [];
        function forEachLoop(i) {
            if (i < data.mimic_images.length) {
                let dataToSave = {
                    site_image_category_id: data.site_image_category_id,
                    state: data.image_state,
                    name: data.mimic_images[i]
                }
                if (dataToSave) {
                    siteImage.create(dataToSave)
                    .then(result => {
                        respArr.push(result);
                        forEachLoop(i + 1);
                    })
                }
            } else {
                return resolve(respArr);
            }
        }
        forEachLoop(0);
    });
}

obj.getAllImages = (data) => {
    return new Promise((resolve, reject) => {
        let aggregateQuery = [];
        let query = { is_deleted: false, site_image_category_id: ObjectId(data.site_image_category_id), state: data.state };
        aggregateQuery.push({ $match: query });
        
        siteImage.aggregate(aggregateQuery).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}

module.exports = obj;