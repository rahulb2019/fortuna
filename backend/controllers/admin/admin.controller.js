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

const encryption = require('../../utilities/encryption')

const adminQueries = require('../../queries/admin/admin_query')
// var CompanyAdmin = require("../models/company_admin.model");
// var EmailTemplate = require("../models/email_template.model");


/* 
Function: getCAdminDetails
Des: Funtion is use to get company admin Details
*/
// const getCAdminDetails = function (c_admin_id, callback) {
//     if (c_admin_id) {
//         CompanyAdmin.findOne(
//             { _id: c_admin_id },
//             [
//                 "_id",
//                 "organizer_name",
//                 "phone_code",
//                 "phone_number",
//                 "email",
//                 "address",
//                 "city",
//                 "state",
//                 "country",
//                 "post_code"
//             ],
//             function (err, cAdmin) {
//                 if (err) {
//                     callback("error");
//                 } else {
//                     callback(cAdmin);
//                 }
//             }
//         );
//     }
// };

/*
 * Function: loginAdmin
 * Des: Funtion is use to login admin
 */
const loginAdmin = async function (req, res) {
    let data = req.body ? req.body : {};
    try {
        const respData = await adminQueries.checkLogin(data);
        if (respData.status !== 200)
            res.status(200).json({ code: 301, message: "Invalid Credentials", result: respData });
        else {
            delete respData.status;
            res.status(200).json({ code: 200, message: "Login successfully", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Cannot login", result: error.sqlMessage })
    }
};

/**
 * Function: accountSetting
 * Des: Function used to set company admin account/profile details
 * @param req
 * @param res
 */
const accountSetting = async function (req, res) {
    let data = req.body ? req.body : {};
    let token = "";
    try {
        if (data.new_password != "" && data.confirm_password != "") {
            data.salt = crypto.randomBytes(16).toString("hex");
            data.password = crypto
                .pbkdf2Sync(data.new_password, data.salt, 1000, 64, "sha512")
                .toString("hex");
        }
        const respData = await adminQueries.updateAccount(data);
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
 * Function: resetPasswordAdmin
 * Des: Funtion is use to login admin
 */
const resetPasswordAdmin = async function (req, res) {
    let defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";
    let data = req.body ? req.body : {};
    let token = "";
    try {
        const respData = await adminQueries.checkLogin(data.email);
        if (respData.length == 0) {
            res.status(400).json({ code: 400, message: "Unregistered email id", result: respData });
        }
        else {
            let randomString = randomstring.generate(6);
            let password = await encryption.hashPassword(randomString);
            data.password = password;
            const respData = await adminQueries.resetPwdAdmin(data);
            let message = "<div>Your password is successfully changed on cincom app, Please use below mentioned credentials to get loggedIn <br>Email : " + data.email + "<br>Password : " + randomString + "<br><br><b>Note : You can change your password from account settings section</b></div>"
            let mailerin = new mailer();
            mailerin.sendMail(data.email, "Reset Password", message, null);
            res.status(200).json({ code: 200, message: "Please check your inbox for new password", result: respData });
        }
    } catch (error) {
        res.status(404).json({ code: 404, message: "Unable to add data", result: error.sqlMessage })
    }
};

exports.resetPasswordAdmin = resetPasswordAdmin;
exports.loginAdmin = loginAdmin;
exports.accountSetting = accountSetting;
