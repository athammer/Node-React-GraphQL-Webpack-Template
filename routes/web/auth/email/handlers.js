'use strict';
let db = require('./../../../../db/db')
let userModel = db.sequalize.import('./../../../../db/models/users')
let get = require('lodash/get');
var find = require('lodash/find');

module.exports = {
    verifyEmail: function(req, res) {
        let email = get(req.body, 'email', '');
        let token = req.params.token;
        let name = req.session.name;
        if(!req.session.name) {
            req.session.error = 'Please login then verify token'
            req.session.save()
            res.redirect('/');
        }
        if(req.session.token && token === req.session.token) { //no need for DB query\
            req.session.token = null;
            userModel.update({ token: null, email_verified: true }, { where: { username: req.session.name } })
                .then(result => {
                    req.session.success = 'Email verification successfully updated'
                    res.redirect('/');
                })
                .catch(err => {
                    req.session.error = 'Error updating token and email verified'
                    res.redirect('/');
                })
        } else {
            userModel.findOne({ where: {username: name} })
            .then(user => {
                //NEED TO USE REQ FLASH HERE OR SOMETHING TO NOTIFY USER
                if(user === null) {
                    req.session.error = 'Token user mismatch. Please check you are logged into the right account.'
                    res.redirect('/');
                }
                if(user.token === token) {
                    req.session.token = null;
                    userModel.update({ token: null, email_verified: true }, { where: { username: req.session.name } })
                        .then(result => {
                            req.session.success = 'Email verification successfully updated'
                            res.redirect('/');
                        })
                        .catch(err => {
                            req.session.error = 'Error updating token'
                            res.redirect('/');
                        })
                } else {
                    req.session.error = 'Token mismatch, please verify you are on the right account.'
                    res.redirect('/');
                }
            })
            .catch(err => {
                console.error(err);
                req.session.error = 'An error has occured logging in. Please try again.'
                res.redirect('/');
            });
        }
     },

    registerEmail: function (req, res) {
        const parameters = awsParamStore.getParametersByPathSync('/', { region: 'us-east-1' })
        const SMTP_USERNAME = find(parameters, ['Name', 'SMTP_USERNAME']).Value
        const SMTP_PASSWORD = find(parameters, ['Name', 'SMTP_PASSWORD']).Value
        //https://bootstrapemail.com/docs/introduction
        let email = get(req.body, 'email', '');
        let transporter = nodemailer.createTransport({
            host: 'email-smtp.us-east-1.amazonaws.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: SMTP_USERNAME,
                pass: SMTP_PASSWORD
            }
        });
        let mailOptions = {
            from: '"Buy Pixels" <do-not-reply@buypixels.net>', // sender address
            to: email, // list of receivers
            subject: 'Buy Pixel\'s Email Verification', // Subject line
            text: '', // plain text body
            html: '</head> <!-- Edit the code below this line --> <body style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; margin: 0; padding: 0; border: 0;"><div class="preview" style="display: none; max-height: 0px; overflow: hidden;"> Thank you for registering with Buy Pixels! </div><table valign="top" class="bg-light body" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; margin: 0; padding: 0; border: 0;" bgcolor="#f8f9fa"> <tbody> <tr> <td valign="top" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left" bgcolor="#f8f9fa"> <table class="container" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;"> <tbody> <tr> <td align="center" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;"> <!--[if (gte mso 9)|(IE)]> <table align="center"> <tbody> <tr> <td width="600"> <![endif]--> <table align="center" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%; max-width: 600px; margin: 0 auto;"> <tbody> <tr> <td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left"> <br> <table class="card " border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: separate !important; border-radius: 4px; width: 100%; overflow: hidden; border: 1px solid #dee2e6;" bgcolor="#ffffff"> <tbody> <tr> <td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"> <div style="border-top-width: 5px; border-top-color: rgb(51, 51, 51); border-top-style: solid;"> <table class="card-body" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;"> <tbody> <tr> <td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 20px;" align="left"> <div> <h2 class="text-center" style="margin-top: 0; margin-bottom: 0; font-weight: 500; color: inherit; vertical-align: baseline; font-size: 32px; line-height: 38.4px;" align="center">Welcome to Buy Pixels</h2> <div class="hr " style="width: 100%; margin: 20px 0; border: 0;"> <table border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;"> <tbody> <tr> <td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; height: 1px; width: 100%; margin: 0;" align="left"></td> </tr> </tbody> </table></div> <h4 class="text-center" style="margin-top: 0; margin-bottom: 0; font-weight: 500; color: inherit; vertical-align: baseline; font-size: 24px; line-height: 28.8px;" align="center">Your one stop shop for buying and selling limiteds and robux on a secure, fast, and easy market place!</h4> </div> </td> </tr> </tbody></table> </div> </td> </tr> </tbody></table><table class="s-4 w-100" border="0" cellpadding="0" cellspacing="0" style="width: 100%;"> <tbody> <tr> <td height="24" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left"> </td> </tr> </tbody></table> <table class="card w-100 " border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: separate !important; border-radius: 4px; width: 100%; overflow: hidden; border: 1px solid #dee2e6;" bgcolor="#ffffff"> <tbody> <tr> <td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"> <div style="border-bottom-width: 5px; border-bottom-color: rgb(51, 51, 51); border-bottom-style: solid;"> <table class="card-body" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;"> <tbody> <tr> <td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 20px;" align="left"> <div> <h2 class="text-center" style="margin-top: 0; margin-bottom: 0; font-weight: 500; color: inherit; vertical-align: baseline; font-size: 32px; line-height: 38.4px;" align="center">Verify your email</h2> <div class="hr " style="width: 100%; margin: 20px 0; border: 0;"> <table border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;"> <tbody> <tr> <td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; height: 1px; width: 100%; margin: 0;" align="left"></td> </tr> </tbody> </table></div> <h4 class="text-center" style="margin-top: 0; margin-bottom: 0; font-weight: 500; color: inherit; vertical-align: baseline; font-size: 24px; line-height: 28.8px;" align="center">Verify your email for better security and for more features!</h4> <table class="s-2 w-100" border="0" cellpadding="0" cellspacing="0" style="width: 100%;"> <tbody> <tr> <td height="8" style="border-spacing: 0px; border-collapse: collapse; line-height: 8px; font-size: 8px; width: 100%; height: 8px; margin: 0;" align="left"> </td> </tr> </tbody></table><table class="btn btn-primary btn-lg mx-auto " align="center" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: separate !important; border-radius: 4px; margin: 0 auto;"> <tbody> <tr> <td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; border-radius: 4px; margin: 0;" align="center" bgcolor="#007bff"> <a href="http://buypixels.net:3000/emailVerification/'+token+'" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; text-decoration: none; border-radius: 4.8px; line-height: 30px; display: inline-block; font-weight: normal; white-space: nowrap; background-color: #007bff; color: #ffffff; padding: 8px 16px; border: 1px solid #007bff;">Click to Verify</a> </td> </tr> </tbody></table></div> </td> </tr> </tbody></table></div> </td> </tr> </tbody></table><table class="s-4 w-100" border="0" cellpadding="0" cellspacing="0" style="width: 100%;"> <tbody> <tr> <td height="24" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left"></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></tbody></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></body></html>'
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    }
};
