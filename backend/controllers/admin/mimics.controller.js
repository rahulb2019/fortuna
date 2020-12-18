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


exports.fetchMimicsData = fetchMimicsData;
exports.addMimic = addMimic;
exports.updateMimic = updateMimic;
exports.getMimicDetail = getMimicDetail;
exports.deleteMimic = deleteMimic;
exports.changeActivation = changeActivation;
exports.updateMimicArch = updateMimicArch;
