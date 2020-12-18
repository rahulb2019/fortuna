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

const userQueries = require('../../queries/admin/user_query')


/*
 * Function: fetchUsersData
 * Des: Funtion is use to login admin
 */
const fetchUsersData = async function (req, res) {
    let data = req.body ? req.body : {};
    // let searchVal = req.body.options && req.body.options.search ? req.body.options.search : "";
    try {
        const respData = await userQueries.getAllUsers(data);
        res.status(200).json({ code: 200, message: "Records fetched successfully", result: respData });
    } catch (error) {
        res.status(404).json({ code: 404, message: "Cannot login", result: error.sqlMessage })
    }
};



/*
 * Function: uploadImage
 * Des: Funtion is use to upload images
 */
const uploadImage = async function (req, res) {
    let response = {};
    let defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";

    let filePath, filePathThumb;
    if (req.body) {
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
        if (req.body.status == "user_image") {
            response.key = "user_image" + Math.round(+new Date() / 1000) + "." + type;
            filePath = constant.imageUrl.userImageOriginal + response.key;
            filePathThumb = constant.imageUrl.userImageThumb + response.key;
        }
        // else if (req.body.status == "attendee_image") {
        //     response.key = "attendee_image" + Math.round(+new Date() / 1000) + "." + type;
        //     filePath = constant.imageUrl.attendeeImageOriginal + response.key;
        //     filePathThumb = constant.imageUrl.attendeeImageThumb + response.key;
        // } else if (req.body.status == "event_logo") {
        //     response.key = "event_logo" + Math.round(+new Date() / 1000) + "." + type;
        //     filePath = constant.imageUrl.eventLogoOriginal + response.key;
        //     filePathThumb = constant.imageUrl.eventLogoThumb + response.key;
        // } else if (req.body.status == "event_banner") {
        //     response.key = "event_banner" + Math.round(+new Date() / 1000) + "." + type;
        //     filePath = constant.imageUrl.eventBannerOriginal + response.key;
        //     filePathThumb = constant.imageUrl.eventBannerThumb + response.key;
        // }
        if (filePath) {
            fs.writeFile(filePath, response.data, function (err) {
                if (err) throw err;

                //crop image
                easyimg.rescrop({
                    src: filePath,
                    dst: filePathThumb,
                    width: 200,
                    height: 200,
                    cropwidth: 200,
                    cropheight: 200,
                    x: 0,
                    y: 0
                }).then(function (result) {
                }, function (err) {
                    throw err;
                });
                res.json({
                    status: "Success",
                    code: 200,
                    message: constant.message[defaultLang].image_upload_success,
                    data: response.key
                });
            });
        }
    }
};

/*
 * Function: fetchUsersData
 * Des: Funtion is use to login admin
 */
const addUser = async function (req, res) {
    let data = req.body ? req.body : {};
    try {
        data.salt = crypto.randomBytes(16).toString("hex");
        data.email_verification_token = crypto.randomBytes(16).toString("hex");
        let randomString = randomstring.generate(6);
        data.password = crypto
            .pbkdf2Sync(randomString, data.salt, 1000, 64, "sha512")
            .toString("hex");
        const respData = await userQueries.addUserData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to add data", result: respData });
        else {
            if (respData.code == '304') {
                res.status(200).json({ code: 304, message: "Email already exist", result: respData });
            }
            else {
                let message = "<div>Your registration is successfull on Fortuna app, Please use below mentioned credentials to get loggedIn <br>Email : " + data.email + "<br>Password : " + randomString + "<br><br><b>Note : You can change your password from profile settings section</b></div>"
                let mailerin = new mailer();
                mailerin.sendMail(data.email, "Registration Successfull", message, null);
                res.status(200).json({ code: 200, message: "Record added successfully", result: respData });
            }
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to add data", result: error.sqlMessage })
    }
};

/*
 * Function: fetchUsersData
 * Des: Funtion is use to login admin
 */
const updateUser = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await userQueries.updateUserData(data);
        console.log(respData);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to update data", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record updated successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to update data", result: error.sqlMessage })
    }
};

/*
 * Function: getUserDetail
 * Des: Funtion is use to login admin
 */
const getUserDetail = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await userQueries.getUserData(data);
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

/*
 * Function: deleteUser
 * Des: Funtion is use to login admin
 */
const deleteUser = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await userQueries.deleteUserData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to delete data", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record(s) deleted successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to delete data", result: error.sqlMessage })
    }
};

/*
 * Function: changeActivation
 * Des: Funtion is use to login admin
 */
const changeActivation = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await userQueries.changeActivationUserData(data);
        if (respData.length == 0)
            res.status(400).json({ code: 301, message: "Unable to update record", result: respData });
        else {
            res.status(200).json({ code: 200, message: "Record updated successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to update record", result: error.sqlMessage })
    }
};


exports.fetchUsersData = fetchUsersData;
exports.uploadImage = uploadImage;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.getUserDetail = getUserDetail;
exports.deleteUser = deleteUser;
exports.changeActivation = changeActivation;
