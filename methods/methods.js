var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var FCM = require('fcm-node');
var moment = require('moment-timezone');
var seekerModel = require('../models/seekers');
var businessModel = require('../models/business').businessModel;


exports.authToken = () => {
    var token = crypto.randomBytes(48).toString('hex');
    return token;
};

exports.password_auth = (password) => {
    var hash = bcrypt.hashSync(password, 10);
    return hash;
};

exports.compare_pass = (obj) => {
    var match = bcrypt.compareSync(obj.password, obj.user_pass);
    return match;
}

exports.randomNumber = () => {
    var number = Math.floor(100000 + Math.random() * 900000);
    return number;
}

exports.send_email = (data) => {
    var smtpTransport = nodemailer.createTransport({
        // host: "ssl0.ovh.net",
        host: 'smtp.gmail.com',

        service: 'gmail',

        port: 465,
        secure: false,
        auth: {
            user: 'sarveshtechorb@gmail.com',
            pass: 'jzskvkanplnkwtpp'
        }

    });
    var mailOptions = {
        to: data.email,
        from: 'sarveshtechorb@gmail.com',
        subject: data.subject,
        text: data.message,
        html: data.html
    };
    smtpTransport.sendMail(mailOptions, function(err) {
        if (err) {
            console.log(err);
        }
    })
};

//notification here 
exports.senNotification = (data1) => {

    var message = {
        to: data1.deviceId,
        notification: {
            title: data1.title,
            body: data1.body,
            desc: data1.desc,
            type: data1.type
        },
        data: {
            title: data1.title,
            body: data1.body,
            desc: data1.desc,
            type: data1.type
        }
    };

    fcm.send(message, function(err, response) {
        if (err) {
            console.log(err);
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

exports.chatNotification = async(obj) => {
    try {     
        if(obj.sentTo=='seeker'){
         var chck = await seekerModel.findOne({'_id':obj.seekerId});
        }else{
         var chck   = await businessModel.findOne({'_id':obj.businessId});
        }
            var obj_data = {
                'email': chck.email,
                'message': '',
                'html': '<html><body><p>'+obj.description +'</p></body></html>',
                'subject': 'Notification Message'
            };
            this.send_email(obj_data);

    } catch (error) {
        console.log(error)
    }
}