var mongoose = require("mongoose");
var Mimic = mongoose.model("sites");
var crypto = require("crypto");

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

module.exports = obj;