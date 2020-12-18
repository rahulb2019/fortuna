var nodemailer = require('nodemailer');
var email = require('../config/email');
var constant = require('../config/constants');
var loadsh = require('lodash');
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;


var mailer = function (req, res) {
    var self = this;
    self.sendMail = function (to, subject, message, attachmentData) {

        if (!attachmentData) { attachmentData = [] };
        
        var fromEmail = email.admin.email;
        var toEmail = to;    
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'rahulb.sdei@gmail.com',
                pass: 'rahulb2019',
            }
        });
        transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            subject: subject,
            html: message,
            attachments: attachmentData
        }, function (error, response) {
            if (error) {
                // console.log('mail error');
                console.log('Failed in sending mail : ', error);
                return;
            } else {
                console.log('Successful in sending email');
                return;
            }
        });
    }


};

module.exports = mailer;
