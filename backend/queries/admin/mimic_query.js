var mongoose = require("mongoose");
var Mimic = mongoose.model("sites");
var SIC = mongoose.model("site_image_categories");
var siteImage = mongoose.model("site_images");
var siteBlock = mongoose.model("site_blocks");
var siteSchedule = mongoose.model("site_schedules");
var siteData = mongoose.model("site_datas");
var siteSummary = mongoose.model("site_summaries");
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
        Mimic.findOneAndUpdate({ _id: data.id }, { $set: { mimic_data: data.mimic_data } }, async function (
            err,
            response
        ) {
            if (err) {
                reject(301);
            } else {
                // Add site blocks code to be written here
                let pumpsAddedOnSite = 0, noOfSiteBlocksToBeAdded = [];
                data.mimic_data.forEach(element => {
                    if (element.category === "Pumps") {
                        pumpsAddedOnSite++;
                    }
                });
                let checkForBlocks = await checkIfBlockExists(data.id);
                if (checkForBlocks.length < pumpsAddedOnSite) {
                    for (i = checkForBlocks.length; i < pumpsAddedOnSite; i++) {
                        noOfSiteBlocksToBeAdded.push({
                            details: [{
                                name: "",
                                value: "",
                                slave_id: "",
                                register_address: "",
                                data_type: "",
                                unit: "",
                                register_type: "",
                                division_factor: "",
                            }], siteId: data.id, pumpValue: i + 1
                        });
                    }
                    let updateSiteBlocks = await addBlockDataAtMimicSave(noOfSiteBlocksToBeAdded);
                    resolve(200);
                } else {
                    resolve(200);
                }
            }
        });
    })
}


obj.getMimicData = (data) => {
    return new Promise((resolve, reject) => {
        Mimic.findById(data.mimicId, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
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

obj.addMimicBlockData = (data, siteId, pumpData) => {
    return new Promise(function (resolve, reject) {
        let respArr = [];
        function forEachLoop(i) {
            if (i < data.length) {
                let dataToSave = {
                    details: data[i].details,
                    site_id: siteId,
                    pumpData: pumpData
                }
                if (dataToSave) {
                    siteBlock.create(dataToSave)
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

function checkIfBlockExists(siteId) {
    return new Promise((resolve, reject) => {
        let aggregateQuery = [];
        let query = { site_id: ObjectId(siteId) };
        aggregateQuery.push({ $match: query });

        siteBlock.aggregate(aggregateQuery).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}
function addBlockDataAtMimicSave(data) {
    return new Promise(function (resolve, reject) {
        let respArr = [];
        function forEachLoop(i) {
            if (i < data.length) {
                let dataToSave = {
                    details: data[i].details,
                    site_id: data[i].siteId,
                    pumpValue: data[i].pumpValue
                }
                if (dataToSave) {
                    siteBlock.create(dataToSave)
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

obj.getSiteBlocksData = (data) => {
    return new Promise((resolve, reject) => {
        let aggregateQuery = [];
        let query = { is_deleted: false, site_id: ObjectId(data.mimicId) };
        aggregateQuery.push({ $match: query });

        siteBlock.aggregate(aggregateQuery).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}



obj.deleteBlocksData = (siteId) => {
    return new Promise((resolve, reject) => {
        let query = { site_id: ObjectId(siteId) };
        siteBlock.deleteMany(query).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}

obj.updateBlocksArchData = (data) => {
    return new Promise((resolve, reject) => {
        siteBlock.deleteOne({ site_id: ObjectId(data.siteId), pumpValue: data.pumpNumberDel }, async function (err, result) {
            if (err) {
                resolve({
                    status: "Failure",
                    code: 301
                });
            } else {
                let updateCountForPumps = await updateExtraPumpFnc(data)
                resolve(result);
            }
        })
    })
}

function updateExtraPumpFnc(data) {
    return new Promise(function (resolve, reject) {
        let updatedArr = [];
        siteBlock.updateMany(
            { site_id: ObjectId(data.siteId), pumpValue: { $gt: data.pumpNumberDel } },
            { $inc: { pumpValue: -1 } }, async function (err, result) {
                if (err) {
                    resolve({
                        status: "Failure",
                        code: 301
                    });
                } else {
                    resolve(result);
                }
            }
        )
    });
}


obj.saveMimicSettingsData = (data) => {
    return new Promise((resolve, reject) => {
        data._id = ObjectId(data._id);
        let requestPostObj = { mimic_settings: data.mimic_settings };
        Mimic.update(
            {
                _id: ObjectId(data._id)
            },
            { $set: requestPostObj },
            function (err, result) {
                if (err) {
                    resolve({
                        status: "Failure",
                        code: 301
                    });
                } else {
                    resolve(result);
                }
            }
        );
    })
}




obj.addMimicScheduleData = (data, siteId) => {
    return new Promise(function (resolve, reject) {
        let respArr = [];
        function forEachLoop(i) {
            if (i < data.length) {
                let dataToSave = {
                    schedule_blocks: data[i].schedule_blocks,
                    pumpValue: data[i].pumpValue,
                    site_id: siteId
                }
                if (dataToSave) {
                    siteSchedule.create(dataToSave)
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

obj.deleteScheduleData = (siteId) => {
    return new Promise((resolve, reject) => {
        let query = { site_id: ObjectId(siteId) };
        siteSchedule.deleteMany(query).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}

obj.getSiteSchedulesData = (data) => {
    return new Promise((resolve, reject) => {
        let aggregateQuery = [];
        let query = { site_id: ObjectId(data.mimicId) };
        aggregateQuery.push({ $match: query });
        siteSchedule.aggregate(aggregateQuery).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}

obj.saveMetersDataDataFnc = (mimic_data, siteId) => {
    return new Promise((resolve, reject) => {
        let requestPostObj = { mimic_data: mimic_data };
        Mimic.update(
            {
                _id: ObjectId(siteId)
            },
            { $set: requestPostObj },
            function (err, result) {
                if (err) {
                    resolve({
                        status: "Failure",
                        code: 301
                    });
                } else {
                    resolve(result);
                }
            }
        );
    })
}

obj.deleteDataMeterBlocks = (siteId) => {
    return new Promise((resolve, reject) => {
        let requestPostObj = { meter_data: [] };
        Mimic.update(
            {
                _id: ObjectId(siteId)
            },
            { $set: requestPostObj },
            function (err, result) {
                if (err) {
                    resolve({
                        status: "Failure",
                        code: 301
                    });
                } else {
                    resolve(result);
                }
            }
        );

    })
}
obj.addDataMeterBlockFnc = (meter_data, siteId) => {
    return new Promise((resolve, reject) => {
        let requestPostObj = { meter_data: meter_data };
        Mimic.update(
            {
                _id: ObjectId(siteId)
            },
            { $set: requestPostObj },
            function (err, result) {
                if (err) {
                    resolve({
                        status: "Failure",
                        code: 301
                    });
                } else {
                    resolve(result);
                }
            }
        );
    })
}


obj.deleteImageData = (data) => {
    return new Promise((resolve, reject) => {
        siteImage.remove({ _id: ObjectId(data._id) }, function (err, result) {
            if (err) {
                resolve({
                    status: "Failure",
                    code: 301
                });
            } else {
                resolve(result);
            }
        });
    })
}


obj.getAllCumulative = (data) => {
    return new Promise((resolve, reject) => {
        let aggregateQuery = [];
        let query = { is_deleted: false, site_id: ObjectId(data.selectedSite) };
        if (data.options && data.options.date) {
            let dateQuery = {
                date: {
                    $gte: new Date(data.options.fromDate),
                    $lt: new Date(data.options.toDate)
                }
            };
            query = { $and: [query, dateQuery] };
        }
        if (data.options && data.options.fromTime) {
            let timeQuery = {
                time: {
                    $gte: data.options.fromTime,
                    $lt: data.options.toTime
                }
            };
            query = { $and: [query, timeQuery] };
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
            aggregateQuery.push({ $sort: { date: -1 } });
        }
        if (data.options && data.options.offSet && data.options.limit) {
            let offSet = Number(data.options.offSet);
            let skip = (Number(offSet) - 1) * data.options.limit;
            aggregateQuery.push({ $skip: skip }, { $limit: data.options.limit });
        }
        siteData.aggregate(aggregateQuery).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}


obj.getAllSummary = (data) => {
    return new Promise((resolve, reject) => {
        let aggregateQuery = [];
        let query = { is_deleted: false, site_id: ObjectId(data.selectedSite) };
        if (data.options && data.options.date) {
            let dateQuery = {
                date: {
                    $gte: new Date(data.options.fromDate),
                    $lt: new Date(data.options.toDate)
                }
            };
            query = { $and: [query, dateQuery] };
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
            aggregateQuery.push({ $sort: { date: -1 } });
        }
        if (data.options && data.options.offSet && data.options.limit) {
            let offSet = Number(data.options.offSet);
            let skip = (Number(offSet) - 1) * data.options.limit;
            aggregateQuery.push({ $skip: skip }, { $limit: data.options.limit });
        }
        siteSummary.aggregate(aggregateQuery).then(async result => {
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