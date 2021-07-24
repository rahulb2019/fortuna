"use strict";
const request = require("request"); // For hitting third party URLs
const mongoose = require("mongoose"); // ORM for MongoDB
const ObjectId = require("mongoose").Types.ObjectId; // For converting uniqueIds of collection with the object one
const crypto = require("crypto");
const handlebars = require("handlebars");
const mailer = require("../../mailer/mailer"); // For sending mails, an external js file
const constant = require("../../config/constants"); // For getting constants defined to be used across application
const loadsh = require("lodash");
const validator = require("email-validator"); // for check valid emails
const fs = require("fs");
const async = require("async");
const randomstring = require("randomstring");
const moment = require("moment");
const path = require("path");
var mime = require('mime-types');
const easyimg = require("easyimage");

const encryption = require('../../utilities/encryption')

const mimicQueries = require('../../queries/admin/mimic_query')


const fetchMimicsData = async function (req, res) {
    let data = req.body ? req.body : {};
    // let searchVal = req.body.options && req.body.options.search ? req.body.options.search : "";
    try {
        const respData = await mimicQueries.getAllMimics(data);
        res.status(200).json({ code: 200, message: "Records fetched successfully", result: respData });
    } catch (error) {
        res.status(404).json({ code: 404, message: "Records not fetched", result: error.sqlMessage })
    }
};


const addMimic = async function (req, res) {
    let data = req.body ? req.body : {};
    try {
        const respData = await mimicQueries.addMimicData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to add data", result: respData });
        else {
            if (respData.code == '304') {
                res.status(200).json({ code: 304, message: "Email already exist", result: respData });
            }
            else {
                res.status(200).json({ code: 200, message: "Record added successfully", result: respData });
            }
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to add data", result: error.sqlMessage })
    }
};


const updateMimic = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.updateMimicData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to update data", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record updated successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to update data", result: error.sqlMessage })
    }
};

const updateMimicArch = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.updateMimicArchData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to update data", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record updated successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to update data", result: error.sqlMessage })
    }
};


const getMimicDetail = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.getMimicData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to update data", result: respData });
        else {
            let resp=[];
            resp.push(respData)
            res.status(200).json({ code: 200, message: "Record updated successfully", result: resp });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to update data", result: error.sqlMessage })
    }
};


const deleteMimic = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.deleteMimicData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to delete data", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record(s) deleted successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to delete data", result: error.sqlMessage })
    }
};


const changeActivation = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.changeActivationMimicData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to update record", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record updated successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to update record", result: error.sqlMessage })
    }
};

const getAllCategories = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.getAllCategories(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to update data", result: respData });
        else {
            let resp=[];
            resp.push(respData)
            res.status(200).json({ code: 200, message: "Record updated successfully", result: resp });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to update data", result: error.sqlMessage })
    }
};

const uploadMimicImages = async function (req, res) {
    let response = {};
    let filePath, filePathThumb;
    if (req.body) {
        let inputIteration = req.body.inputIteration;
        let imageName = req.body.imageName;
        let image = req.body.inputImage.image;
        let type = req.body.inputImage.imageType.split("/")[1];
        let matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches.length !== 3) {
            let error = new Error("Invalid image");
            error.code = config.statusCode.invalid;
            throw error;
        }
        response.contentType = matches[1];
        response.data = new Buffer(matches[2], "base64");
        if (req.body.status == "mimic_image") {
            // response.key = inputIteration +"_"+ Math.round(+new Date().getTime() / 1000) +"_"+ imageName + "." + type;
            response.key = inputIteration +"_"+ imageName + "." + type;
            filePath = constant.imageUrl.mimicImageOriginal + response.key;
            if (fs.existsSync(filePath)) {
                inputIteration++;
                response.key = inputIteration +"_"+ imageName + "." + type;
                filePath = constant.imageUrl.mimicImageOriginal + response.key;
            }
            filePathThumb = constant.imageUrl.mimicImageThumb + response.key;
        }
        if (filePath) {
            fs.writeFile(filePath, response.data, function (err) {
                if (err) throw err;
                res.json({
                    status: "Success",
                    code: 200,
                    data: response.key
                });
            });
        }
    }
};


const addImages = async function (req, res) {    
    let data = req.body ? req.body : {};
    try {
        let respData = await mimicQueries.addMimicImages(data);
        if (data.mimic_images.length == respData.length){
            res.status(200).json({ code: 200, message: "Images added successfully" });
        } else {
            res.status(400).json({ code: 301, message: "Unable to add images", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to add images", result: error.sqlMessage })
    }
};


const getAllImages = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.getAllImages(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to fetch data", result: respData });
        else {
            let resp=[];
            resp.push(respData)
            res.status(200).json({ code: 200, message: "Record fetched successfully", result: resp });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to fetch data", result: error.sqlMessage })
    }
};

const saveBlocksData = async function (req, res) { 
    let data = req.body ? req.body.blocksData : {};
    let siteId = req.body ? req.body.site_id : {};
    let pumpData = req.body ? req.body.pumpData : [];
    try {
        let delData = await mimicQueries.deleteBlocksData(siteId);
        let respData = await mimicQueries.addMimicBlockData(data, siteId, pumpData);
        if (respData){
            res.status(200).json({ code: 200, message: "Data added successfully" });
        } else {
            res.status(400).json({ code: 301, message: "Unable to add data", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to add data", result: error.sqlMessage })
    }
};

const getBlocksData = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.getSiteBlocksData(data);
        if (respData.length == 0)
            res.status(200).json({ code: 200, message: "No data saved yet", result: respData });
        else {
            let resp=[];
            resp.push(respData)
            res.status(200).json({ code: 200, message: "Record fetched successfully", result: resp });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to fetch data", result: error.sqlMessage })
    }
};

const updateBlocksArch = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.updateBlocksArchData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to update data", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record updated successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to update data", result: error.sqlMessage })
    }
};

const saveMimicSettings = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.saveMimicSettingsData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to update data", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record updated successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to update data", result: error.sqlMessage })
    }
};



const saveMimicSchedule = async function (req, res) { 
    let schedulesData = req.body ? req.body.schedulesData : {};
    let siteId = req.body ? req.body.site_id : {};
    try {
        let delData = await mimicQueries.deleteScheduleData(siteId);
        let respData = await mimicQueries.addMimicScheduleData(schedulesData, siteId);
        if (respData){
            res.status(200).json({ code: 200, message: "Data added successfully" });
        } else {
            res.status(400).json({ code: 301, message: "Unable to add data", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to add data", result: error.sqlMessage })
    }
};

const getScheduleData = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.getSiteSchedulesData(data);
        if (respData.length == 0)
            res.status(200).json({ code: 200, message: "No data saved yet", result: respData });
        else {
            let resp=[];
            resp.push(respData)
            res.status(200).json({ code: 200, message: "Record fetched successfully", result: resp });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to fetch data", result: error.sqlMessage })
    }
};

const saveMetersData = async function (req, res) { 
    let mimic_data = req.body ? req.body.mimic_data : {};
    let siteId = req.body ? req.body.site_id : {};
    try {
        let respData = await mimicQueries.saveMetersDataDataFnc(mimic_data, siteId);
        if (respData){
            res.status(200).json({ code: 200, message: "Data added successfully" });
        } else {
            res.status(400).json({ code: 301, message: "Unable to add data", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to add data", result: error.sqlMessage })
    }
};

// function save meter blocks details positioned on running mimic
const addDataMeterBlock = async function (req, res) { 
    let meter_details = req.body ? req.body.meter_data : {};
    let siteId = req.body ? req.body.siteId : {};
    try {
        let delData = await mimicQueries.deleteDataMeterBlocks(siteId);
        let respData = await mimicQueries.addDataMeterBlockFnc(meter_details, siteId);
        if (respData){
            res.status(200).json({ code: 200, message: "Data added successfully" });
        } else {
            res.status(400).json({ code: 301, message: "Unable to add data", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to add data", result: error.sqlMessage })
    }
};

const deleteImage = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await mimicQueries.deleteImageData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to delete data", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record(s) deleted successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to delete data", result: error.sqlMessage })
    }
};

const fetchCumulativeData = async function (req, res) {
    let data = req.body ? req.body : {};
    // let searchVal = req.body.options && req.body.options.search ? req.body.options.search : "";
    try {
        const respData = await mimicQueries.getAllCumulative(data);
        res.status(200).json({ code: 200, message: "Records fetched successfully", result: respData });
    } catch (error) {
        res.status(404).json({ code: 404, message: "Records not fetched", result: error.sqlMessage })
    }
};

const fetchSummaryData = async function (req, res) {
    let data = req.body ? req.body : {};
    // let searchVal = req.body.options && req.body.options.search ? req.body.options.search : "";
    try {
        const respData = await mimicQueries.getAllSummary(data);
        res.status(200).json({ code: 200, message: "Records fetched successfully", result: respData });
    } catch (error) {
        res.status(404).json({ code: 404, message: "Records not fetched", result: error.sqlMessage })
    }
};



exports.fetchMimicsData = fetchMimicsData;
exports.addMimic = addMimic;
exports.updateMimic = updateMimic;
exports.getMimicDetail = getMimicDetail;
exports.deleteMimic = deleteMimic;
exports.changeActivation = changeActivation;
exports.updateMimicArch = updateMimicArch;
exports.getAllCategories = getAllCategories;
exports.uploadMimicImages = uploadMimicImages;
exports.addImages = addImages;
exports.getAllImages = getAllImages;
exports.saveBlocksData = saveBlocksData;
exports.getBlocksData = getBlocksData;
exports.updateBlocksArch = updateBlocksArch;
exports.saveMimicSettings = saveMimicSettings;
exports.saveMimicSchedule = saveMimicSchedule;
exports.getScheduleData = getScheduleData;
exports.saveMetersData = saveMetersData;
exports.addDataMeterBlock = addDataMeterBlock;
exports.deleteImage = deleteImage;
exports.fetchCumulativeData = fetchCumulativeData;
exports.fetchSummaryData = fetchSummaryData;