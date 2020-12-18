var constant = require('../config/constants');

var mandrill = require('mandrill-api/mandrill');
var ConstantEmail = require('../config/email');

var mailer = function () {
    var self = this;

    self.sendMail = function (template_name, template_content, subject, toEmail, recName, mergeVars, CC='') {

        var mandrill_client = new mandrill.Mandrill(constant.mandrillKey.KEY);
        var async = false;
        
        if(CC==''){
            var ToArr = [{
                "email": toEmail,
                "name": recName,
                "type": "to"
            },
            {
                "email": ConstantEmail.supportEmail.email,
                "name": "Support Team",
                "type": "cc"
            }
            ]
        }
        else {
            var ToArr = [{
                "email": toEmail,
                "name": recName,
                "type": "to"
            },
            {
                "email": ConstantEmail.supportEmail.email,
                "name": "Support Team",
                "type": "cc"
            },
            CC
            ]
        }
        
        var message = {
            "subject": subject,
            "from_email": constant.support_emailAccount.fromEmail,
            "from_name": constant.support_emailAccount.fromName,
            "to": ToArr,
            "headers": {
                "Reply-To": constant.support_emailAccount.replyTo
            },
            "merge": true,
            "merge_language": "mailchimp",
            "global_merge_vars": mergeVars,
            "merge_vars": [{
                "rcpt": "recipient.email@example.com",
                "vars": [{
                    "name": "merge2",
                    "content": "merge2 content"
                }]
            }]
        };

        mandrill_client.messages.sendTemplate({ "template_name": template_name, "template_content": template_content, "message": message, "async": async }, function (result) {

        console.log(result);

        }, function (e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        });
    }
}
module.exports = mailer;