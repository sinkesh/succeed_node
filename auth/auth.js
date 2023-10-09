var sessionModel = require('../models/business').sessionModel;
var businessModel = require('../models/business').businessModel;
var seekerModel = require('../models/seekers');
var codes = require('../codes/codes');
var message = require('../codes/messages');

var auth = (req, res, next) => {
    var token = req.header('x-auth');
    var header = req.header('timezone');
    var messages = message.messages(req.header('language'));
    // console.log('timezone', header);
    sessionModel.findOne({ 'token': token }, (err, session) => {
        if (session) {
            businessModel.findOne({ '_id': session.userId }, { 'status': 1 }, (err, usr) => {
                if (usr && usr.status == false) {
                    return res.json({ code: codes.loginAgain, message: messages.deactive });
                } else if(!usr){
                    seekerModel.findOne({ '_id': session.userId }, { 'status': 1 }, (err, seeker) => {
                        if (seeker && seeker.isActive == false) {
                            return res.json({ code: codes.loginAgain, message: messages.deactive });
                        } else {
                            var obj = {
                                code: 200,
                                message: 'success',
                                result: session,
                                token: token
                            }
                            req.obj = obj;
                            next();
                        }
                    });
                }else if (!usr && !seeker) {
                    adminModel.findOne({ '_id': session.userId }, { 'isActive': 1 }, (err, admin) => {
                        if (admin && admin.isActive == false) {
                            return res.json({ code: codes.loginAgain, message: messages.deactive });
                        } else {
                            var obj = {
                                code: 200,
                                message: 'success',
                                result: session,
                                token: token
                            }
                            req.obj = obj;
                            next();
                        }
                    });
                } else {
                    var obj = {
                        code: 200,
                        message: 'success',
                        result: session,
                        token: token
                    }

                    req.obj = obj;
                    next();

                }
            });
        } else {
            return res.json({ code: codes.loginAgain, message: messages.loginAgain });
        }
    });
};

module.exports = auth;