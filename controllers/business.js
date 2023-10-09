var businessModel = require('../models/business').businessModel;
var sessionModel = require('../models/business').sessionModel;
var salesModel = require('../models/salesOpportunity').salesModel;
var companySizeModel = require('../models/seekerDropDownList').companySizeModel;
var notificationModel = require('../models/chat').notificationModel;
var favoriteModel = require('../models/favorite');
var roomModel = require('../models/chat').roomModel;
var InterestModel = require('../models/notInterest');
var ObjectId = require('objectid');
var message = require('../codes/messages');
var codes = require('../codes/codes');
var methods = require('../methods/methods');
var uniqid = require('uniqid');
const seekerModel = require('../models/seekers');
var moment = require('moment');
const { busSubScriptionModel } = require('../models/subscription');
const offerModel = require('../models/offerApply');

class businessServices {
    async businessSignUp(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var req_data = req.body;
            if (!req_data.firstName || !req_data.lastName || !req_data.email || !req_data.password) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var mail = (req_data.email).toLowerCase();

            var business = await businessModel.findOne({ 'email': mail });
            if (business) {
                return res.json({ code: codes.badRequest, message: messages.AlreadyExists });
            } else {
                var token = methods.authToken();
                var password = methods.password_auth(req_data.password);
                var data = {
                    'firstName': req_data.firstName,
                    'companyName': req_data.companyName,
                    'lastName': req_data.lastName,
                    'email': mail,
                    'password': password,
                    'uniqueId': uniqid(),
                    'createdAt': new Date()
                };

                var addBusiness = await new businessModel(data).save();
                var session = await new sessionModel({ 'type': 'business', 'userId': addBusiness._id, 'token': token, 'createdAt': new Date() }).save();
                data.token = token;
                data._id = addBusiness._id;
                data.type = 'business';
                var verify_link = 'https://succeednode.herokuapp.com/api/v1/business/verifyUserEmail?uniqueId=' + data.uniqueId;
                var obj_data = {
                    'email': mail,
                    'message': '',
                    'html': '<html><body>'+ '<div style="text-align: center;"><img src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630398215/fq5dzljxzz6jkwjb5hnw.png">'+ 
                    '<p>Welcome to Sale Succeed! Commission – based revenue acceleration platform.'+'<br>'+
                    'Hi '+req_data.firstName+','+'<br>' +
                        'Thanks for getting started with Sale Succeed! Simply click the button below to verify your email address'+'\n\n'+
                        '.</p> <a href = ' + verify_link + ' ><button class="btn" style="padding: 6px 8px; border-radius: 7px; cursor: pointer; border-color: blue; color: white; background-color:blue;">Verify Link</button></a><p>' +
                        'Need help? Please contact us on <a href="mailto: support@salesucceed.com">support@salesucceed.com</a>'+'<br>'+
                        '10 Anson Road'+'<br>'+
                        '#10-11, International Plaza'+'<br>'+
                        'Singapore 079903</p>'+'</div>' + '<hr>' +
                        '<div style="text-align: center;">' + '<img style="width: 36px;margin-right: 8px;"src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630412432/xliqswzngttckhck8jew.png">' + '<img style="width: 36px;margin-right: 8px;" src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630412489/zq06hplswzb2d1m2bw1v.png">' + '<img style="width: 36px;margin-right: 8px;"src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630413364/bei8hgwi4vjbnryko061.png">' + '<img style="width: 36px;margin-right: 8px;" src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630413393/omnvnjoagu03srik1u8s.png">' + '</div>' + '<hr>' +
                        '</body></html>',
                    'subject': 'Link for verifying email for Sales-Succeed'
                };
                methods.send_email(obj_data);
                return res.json({ code: codes.success, message: messages.success, result: data });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async resendEmail(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var data = req.body;
            if(data.type=='seeker'){
                var chck = await seekerModel.findOne({'email':data.email});
            }else{
                var chck  =await businessModel.findOne({'email':data.email});

            }
            if(chck){
                var verify_link = 'https://succeednode.herokuapp.com/api/v1/business/verifyUserEmail?uniqueId=' + chck.uniqueId
                var obj_data = {
                    'email': chck.email,
                    'message': '',
                    'html': '<html><body>'+ '<div style="text-align: center;"><img src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630398215/fq5dzljxzz6jkwjb5hnw.png">'+ 
                    '<p>Welcome to Sale Succeed! Commission – based revenue acceleration platform.'+'<br>'+
                    'Hi '+chck.firstName+','+'<br>' +
                        'Thanks for getting started with Sale Succeed! Simply click the button below to verify your email address'+'\n\n'+
                        '.</p> <a href = ' + verify_link + ' ><button class="btn" style="padding: 6px 8px; border-radius: 7px; cursor: pointer; border-color: blue; color: white; background-color:blue;">Verify Link</button></a><p>' +
                        'Need help? Please contact us on <a href="mailto: support@salesucceed.com">support@salesucceed.com</a>'+'<br>'+
                        '10 Anson Road'+'<br>'+
                        '#10-11, International Plaza'+'<br>'+
                        'Singapore 079903</p>'+'</div>' + '<hr>' +
                        '<div style="text-align: center;">' + '<img style="width: 36px;margin-right: 8px;"src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630412432/xliqswzngttckhck8jew.png">' + '<img style="width: 36px;margin-right: 8px;" src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630412489/zq06hplswzb2d1m2bw1v.png">' + '<img style="width: 36px;margin-right: 8px;"src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630413364/bei8hgwi4vjbnryko061.png">' + '<img style="width: 36px;margin-right: 8px;" src="https://res.cloudinary.com/tecorbprashant/image/upload/v1630413393/omnvnjoagu03srik1u8s.png">' + '</div>' + '<hr>' +
                        '</body></html>',
                    'subject': 'Link for verifying email for Sales-Succeed'
                };
            methods.send_email(obj_data);
            return res.json({code:codes.success,message:messages.success})
        }else{
            return res.json({code:codes.badRequest,message:messages.notFound})

        }
        }catch(error){
            console.log(error)
        }
    }   


    async businessLogin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var req_data = req.body;
            if (!req_data.email || !req_data.password) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
              var mail = (req_data.email).toLowerCase();
            var business = await businessModel.findOne({ 'email':mail});
            if (business) {
                if(business.password){
                var password_status = methods.compare_pass({ 'password': req_data.password, 'user_pass': business.password });
                if (password_status == false) {
                    return res.json({ code: codes.badRequest, message: messages.invalidPass });
                }
                var token = methods.authToken();
                var session = await new sessionModel({ 'type': 'business', 'userId': business._id, 'token': token, 'createdAt': new Date() }).save();
                var data = {
                    '_id': business._id,
                    'firstName': business.firstName,
                    'lastName': business.lastName,
                    'email': business.email,
                    'emailVerify': business.emailVerify,
                    'createdAt': business.createdAt,
                    'companyName': business.companyName,
                    'image': business.image,
                    'token': token,
                    'type': 'business',
                    'sector':business.sector,
                    'profilePer': business.profilePer
                }
                return res.json({ code: codes.success, message: messages.success, result: data });
            }else{
                return res.json({ code: codes.badRequest, message: messages.invalidPass });

            }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notExists });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async businessSocialLogin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var req_data = req.body;
            if (!req_data.firstName || !req_data.lastName || !req_data.email || !req_data.loginType) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var business = await businessModel.findOne({ $or: [{ 'email': req_data.email }, { 'socialId': req_data.socialId }] });
            if (business) {

               // if (business.socialType == req_data.loginType) {
                    var token = methods.authToken();
                    await sessionModel.deleteOne({ 'userId': business._id });
                    var session = await new sessionModel({ 'type': 'business', 'userId': business._id, 'token': token }).save();

                    await businessModel.updateOne({ '_id': business._id }, { $set: { 'socialId': req_data.socialId, 'socialType': req_data.socialType } });

                    var data = {
                        'userDetail':business,
                        'token': token,
                        'type': 'business'
                    }
                    return res.json({ code: codes.success, message: messages.login, result: data });
                // } else {
                //     return res.json({ code: codes.badRequest, message: messages.AnotherAccount });
                // }
            } else {
                var token = methods.authToken();
                var data = {
                    'firstName': req_data.firstName,
                    'lastName': req_data.lastName,
                    'companyName': req_data.companyName,
                    'email': req_data.email,
                    'socialType': req_data.loginType,
                    'socialId':req_data.socialId,
                    'createdAt': new Date()
                };

                var addBusiness = await new businessModel(data).save();
                var session = await new sessionModel({ 'type': 'business', 'userId': addBusiness._id, 'token': token }).save();
                data.token = token;
                data._id = addBusiness._id;
                data.emailVerify = addBusiness.emailVerify;
                data.profilePer = addBusiness.profilePer;
                data.sector = addBusiness.sector
                return res.json({ code: codes.success, message: messages.success, result: data });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async forgotPassword(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var email = req.body.email;
            // var uniqueId = uniqid();
            var number = Math.floor(Math.random() * 900000) + 100000;

            if (!email) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var newPwd = (number).toString()
           // var chckbusiness = await businessModel.findOne({ 'email': email });

            var business = await businessModel.findOne({ 'email': email });
            if (business) {
                methods.send_email({
                    'email': email,
                    'subject': 'Forgot password',
                    'message': 'Hi' + ' ' + business.firstName + ',' + ' ' +
                    'A password reset request was requested for the Sale Succeed account linked to this email address.'+ //' + ' ' + newPwd + ' ' +
                    'Simply enter the below OTP on SaleSucceed Portal in order to reset the password.' + ' ' +
                    'Your OTP is' + ' ' + newPwd + ' . ' +
                        'The Sales Succeed Team'
                });
                var password = methods.password_auth(newPwd);
                var Update = await businessModel.updateOne({ '_id': business._id }, { $set: { 'password': password } });
                return res.json({ code: codes.success, message: messages.success });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async logout(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var businessId = req.obj.result.userId;
            if (!businessId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var session = await sessionModel.deleteOne({ 'userId': businessId });
            return res.json({ code: codes.success, message: messages.success });
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async verifyUserEmail(req, res) {
        try {
            var usr = await businessModel.updateOne({ 'uniqueId': req.query.uniqueId }, { $set: { 'emailVerify': true } });
            res.send('Email verify succesfully');
        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

    async changePassword(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var req_data = req.body;
            if (!userId || !req_data.password || !req_data.oldPassword) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
           var usr = await businessModel.findOne({ '_id': userId });
            if (usr) {
                var password_status = methods.compare_pass({ 'password': req_data.oldPassword, 'user_pass': usr.password });
                console.log(password_status)
                if (password_status == false) {
                    return res.json({ code: codes.badRequest, message: messages.invalidPass });
                } else {
                    var password = methods.password_auth(req_data.password);
                    await businessModel.updateOne({ '_id': usr._id }, { $set: { 'password': password } });
                    return res.json({ code: codes.success, message: messages.success });
                }

            } else {
                return res.json({ code: codes.badRequest, message: messages.notExists });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async resetPassword(req, res) {
        try {
            var messages = message.messages(req.header('language'));

            var req_data = req.body;
            if (!req_data.email || !req_data.password || !req_data.oldPassword) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }

            var usr = await businessModel.findOne({ 'email': req_data.email })

            if (usr) {
                var password_status = methods.compare_pass({ 'password': req_data.oldPassword, 'user_pass': usr.password });
                if (password_status == false) {
                    return res.json({ code: codes.badRequest, message: messages.invalidPass });
                } else {
                    var password = methods.password_auth(req_data.password);
                    await businessModel.updateOne({ '_id': usr._id }, { $set: { 'password': password } });

                    return res.json({ code: codes.success, message: messages.success });
                }

            } else {
                return res.json({ code: codes.badRequest, message: messages.notExists });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async editProfile(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var businessId = req.obj.result.userId;
            var req_data = req.body;
            if (!businessId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var business = await businessModel.findOne({ '_id': businessId })//.populate([{ path: 'industry', select: 'name' },{path:'sector'},{path:'numOfCustomer'}])
            if (business) {
                var image = business.image;
                if (req.file && req.file.path) {
                   var image = req.file.path;
                }
                if(req.body.companySize){        

                    var size =JSON.parse(req_data.companySize)//JSON.parse(req_data.companySize)
                }else{
                    var size = business.companySize
                }
                var data = {
                    'type':'business',
                    'firstName': req_data.firstName ? req_data.firstName : business.firstName,
                    'lastName': req_data.lastName ? req_data.lastName : business.lastName,
                    'email': req_data.email ? req_data.email : business.email,
                    'companyName':req_data.companyName ? req_data.companyName : business.companyName,
                    'industry': req_data.industry ? req_data.industry : business.industry,
                    'sector': req_data.sector ? req_data.sector : business.sector,
                    'countryCode': req_data.countryCode ? req_data.countryCode : business.countryCode,
                    'businessNumber': req_data.businessNumber ? req_data.businessNumber : business.businessNumber,
                    'businessActivity': req_data.businessActivity ? req_data.businessActivity : business.businessActivity,
                    'operationYear': req_data.operationYear ? req_data.operationYear : business.operationYear,
                    'range': req_data.range ? req_data.range : business.range,
                    'companySize': size,//JSON.parse(req_data.companySize) ? JSON.parse(req_data.companySize) : business.companySize,
                    'numOfCustomer': req_data.numOfCustomer ? req_data.numOfCustomer : business.numOfCustomer,
                    'webUrl': req_data.webUrl ? req_data.webUrl : business.webUrl,
                    'linkedinUrl': req_data.linkedinUrl ? req_data.linkedinUrl : business.linkedinUrl,
                    'blogUrl': req_data.blogUrl ? req_data.blogUrl : business.blogUrl,
                    'country': req_data.country ? req_data.country : business.country,
                    "city": req_data.city ? req_data.city : business.city,
                    'image': image,
                    'signupProgressBar': req_data.signupProgressBar ? req_data.signupProgressBar : business.signupProgressBar

                }
                var upload = await businessModel.updateOne({ '_id': businessId }, { $set: data });
                var businessDetails = await businessModel.findOne({ '_id': businessId }, { 'password': 0 }).populate([{ path: 'industry' }, { path: 'sector' },  { path: 'range' },{path:'companySize'},{path:'numOfCustomer'}]);
                return res.json({ code: codes.success, message: messages.success, result: businessDetails });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getAllBusiness(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;

            var business = await businessModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (business && business.length) {
                return res.json({ code: codes.success, message: messages.success, result: business });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }

        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });

        }
    }

    //////Admin Api's//////

    async businessListingForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var pageNo = req.body.pageNo ? req.body.pageNo : 1
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var arr = []
            if (req.body.search && req.body.filter && req.body.fromDate && req.body.toDate) {
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                    'isActive': req.body.filter,
                    'firstName': { '$regex': req.body.search, '$options': 'i' }
                }
            } else if (req.body.fromDate && req.body.toDate && req.body.search) {
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                    'firstName': { '$regex': req.body.search, '$options': 'i' }
                }
            } else if (req.body.fromDate && req.body.toDate && req.body.filter) {
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                    'isActive': req.body.filter,
                }
            } else if (req.body.search && req.body.filter) {
                var obj = {
                    'isActive': req.body.filter,
                    'firstName': { '$regex': req.body.search, '$options': 'i' }
                }
            } else if (req.body.fromDate && req.body.toDate) {
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },

                }
            } else if (req.body.filter == true) {
                var obj = {
                    'isActive': true,
                }
            } else if (req.body.filter == false) {
                var obj = {
                    'isActive': false,
                }


            } else if (req.body.search) {
                var obj = {
                    'firstName': { '$regex': req.body.search, '$options': 'i' }
                }
            } else {
                var obj = {}
            }
            var count = await businessModel.countDocuments(obj)
            var chck = await businessModel.find(obj).skip(perPage * (pageNo - 1)).limit(perPage);
            // var index  = await salesModel.ensureIndex({'tittle':1})
            // console.log(index,"231")
            if (chck && chck.length) {
                for (var i = 0; i < chck.length; i++) {
                    var posted = await salesModel.countDocuments({ 'businessId': chck[i]._id, 'jobStatus': 'Posted', 'saveAsDraft': false,'isDelete': false })
                    var closed = await salesModel.countDocuments({ 'businessId': chck[i]._id, 'jobStatus': 'Closed', 'saveAsDraft': false,'isDelete': false })
                    var draft = await salesModel.countDocuments({ 'businessId': chck[i]._id, 'saveAsDraft': true,'isDelete': false })
                    var ongoing = await salesModel.countDocuments({ 'businessId': chck[i]._id, 'jobStatus': 'Ongoing', 'saveAsDraft': false,'isDelete': false })
                    var subs = await busSubScriptionModel.findOne({ 'businessId': chck[i]._id })
                    if (subs) {
                        var member = subs.createdAt
                        var status = subs.subStatus
                    } else {
                        var member = "not yet"
                        var status = true
        
                    }
                    var obj_data = {
                        '_id': chck[i]._id,
                        'firstName': chck[i].firstName,
                        'lastName': chck[i].lastName,
                        'companyName':chck[i].companyName,
                        'industry': chck[i].industry,
                        'sector': chck[i].sector,
                        'countryCode': chck[i].countryCode,
                        'businessNumber': chck[i].businessNumber,
                        'companySize': chck[i].companySize,
                        'isActive': chck[i].isActive,
                        'subscription':status,
                        'posted': posted,
                        'closed': closed,
                        'drafted': draft,
                        'ongoing': ongoing
                    }
                    arr.push(obj_data)
                }

                return res.json({ code: codes.success, message: messages.success, result: arr, Total: count })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async updateBusinessStatusForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.status || !req_data.businessId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            if (req_data.status == 'Active') {
                var obj_data = {
                    'isActive': true
                }
            }
            if (req_data.status == 'Deactive') {
                var obj_data = {
                    'isActive': false
                }
            }
            var chck = await businessModel.findOne({ '_id': req_data.businessId })
            if (chck) {
                var updte = await businessModel.updateOne({ '_id': chck._id }, { $set: obj_data })
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async addBusinessForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var adminId = req.obj.result.userId;
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            if (!adminId || !req_data.email) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var chck = await businessModel.findOne({ 'email': req_data.email })
            if (chck) {
                return res.json({ code: codes.alreadyExists, message: messages.AlreadyExists })
            } else {
                var token = methods.authToken();
                var password = methods.password_auth(req_data.password);
                if (req.file && req.file.secure_url) {
                    image = req.file.secure.path;
                }
                var data = {
                    'firstName': req_data.firstName,
                    'lastName': req_data.lastName,
                    'email': req_data.email,
                    'password': password,
                    'industry': req_data.industry,
                    'sector': req_data.sector,
                    'businessNumber': req_data.businessNumber,
                    'businessActivity': req_data.businessActivity,
                    'operationYear': req_data.operationYear,
                    'range': req_data.range,
                    'companySize': req_data.companySize,
                    'numOfCustomer': req_data.numOfCustomer,
                    'webUrl': req_data.webUrl,
                    'linkedinUrl': req_data.linkedinUrl,
                    'blogUrl': req_data.blogUrl,
                    'image': image,
                    'createdAt': moment().tz(timeZone).format()
                }
                var upload = await businessModel(data).save();
                var session = await new sesssionModel({ 'type': 'business', 'userId': upload._id, 'token': token, 'createdAt': new Date() }).save();
                var businessDetails = await businessModel.findOne({ '_id': upload._id }, { 'password': 0 });
                return res.json({ code: codes.success, message: messages.success, result: businessDetails });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async checkSession(req, res) {
        var messages = message.messages(req.header('language'))
        var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata'
        var userId = req.obj.result.userId;
        var tokn = await sessionModel.findOne({ 'userId': userId })
        if (tokn.type == 'business') {
            var chck = await businessModel.findOne({ '_id': userId })
            if (chck) {
                var data = {
                    '_id': chck._id,
                    'firstName': chck.firstName,
                    'lastName': chck.lastName,
                    'email': chck.email,
                    'emailVerify': chck.emailVerify,
                    'createdAt': chck.createdAt,
                    'companyName': chck.companyName,
                    'token': tokn.token,
                    'tokenType': tokn.type,
                    'sector':chck.sector,
                    'signupProgressBar': chck.signupProgressBar,
                    'profilePer': chck.profilePer
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.somethingWrong })
            }
        } else {
            var chck = await seekerModel.findOne({ '_id': userId })
            if (chck) {
                var data = {
                    '_id': chck._id,
                    'firstName': chck.firstName,
                    'lastName': chck.lastName,
                    'fullName': chck.fullName,
                    'email': chck.email,
                    'tokenType': tokn.type,
                    'sector':chck.sector,
                    'token': tokn.token
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.somethingWrong })
            }
        }
        return res.json({ code: codes.success, message: messages.success, result: data })
    }



    async businessCSV(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var arr = [];
            let bus = await businessModel.find({}).sort({ 'createdAt': -1 })
            if (bus) {
                for (var i = 0; i < bus.length; i++) {
                    var createDte = moment(bus[i].createdAt).format()
                    var dte2 = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                    var createtym = moment(bus[i].createdAt).format('hh:mm a')
                    var busdetail = {
                        'firstName': bus[i].firstName,
                        'lastName': bus[i].lastName,
                        'email': bus[i].email,
                        'industry': bus[i].industry,
                        'sector': bus[i].sector,
                        'businessNumber': bus[i].businessNumber,
                        'businessActivity': bus[i].businessActivity,
                        'operationYear': bus[i].operationYear,
                        'range': bus[i].range,
                        'companySize': bus[i].companySize,
                        'numOfCustomer': bus[i].numOfCustomer,
                        'webUrl': bus[i].webUrl,
                        'linkedinUrl': bus[i].linkedinUrl,
                        'blogUrl': bus[i].blogUrl,
                        'createdAt': dte2
                    }
                    arr.push(busdetail)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }


    async businessDetailForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var adminId = req.obj.result.userId;
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';

            var chck = await businessModel.findOne({ '_id': req.body.businessId }).populate([{ path: 'industry' }, { path: 'sector', match: { _id: { $ne: null } } }, { path: 'range' },{ path: 'regionId', match: { _id: { $ne: null } } }])
            if (chck) {
                var job = await salesModel.countDocuments({'businessId':req.body.businessId});
                var ongoing = await salesModel.countDocuments({'businessId':req.body.businessId,'jobStatus':'Ongoing'});
                var complete = await salesModel.countDocuments({'businessid':req.body.businessId,'jobStatus':'Completed'});
                var draft = await salesModel.countDocuments({'businessId':req.body.businessId,'saveAsDraft':true});
                var hire = await offerModel.countDocuments({'businessId':req.body.businessId,'offerAccept':true});
                var subscription = await busSubScriptionModel.findOne({'businessId':req.body.businessId});
                if(subscription && subscription.subsType == 'yearly'){
                    var resubs = moment(subscription.renewed).format()
                var dte = (new Date(resubs).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                var renew = dte
                var price = subscription.price
                var type = subscription.subsType
                }else if(subscription && subscription.subsType){
                  //  var renew = 'LifeTime Subscribed'
                }else{
                     var renew = "not subscribed"
                }
                if (chck.isActive == true) {
                    var status = 'Active'
                } else {
                    var status = 'Deactive'
                }
                if(chck.companyName ==null || chck.companyName ==''){
                    var company = 'N/A'

                }else{
                    var company = chck.companyName
                }
                if(chck.industry ==null || chck.industry ==''){
                    var nme = 'N/A'

                }else{
                    var nme = chck.industry.name
                }
                if(chck.sector !=null){
                    var sector = chck.industry.name
                }else{
                    var sector = 'N/A'
                }
                if(chck.range !=null){
                    var range = chck.range.name
                }else{
                    var range = 'N/A'
                }
                var createDte = moment(chck.createdAt).format()
                var dte = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                var data = {
                    'firstName': chck.firstName, 
                    'lastName': chck.lastName,
                    'companyName': company,
                    'email': chck.email,
                    'industry': nme,
                    'sector': sector,
                    'job':job,
                    'ongoing':ongoing,
                    'complete':complete,
                    'draft':draft,
                    'businessNumber': chck.businessNumber,
                    'businessActivity': chck.businessActivity,
                    'operationYear': chck.operationYear,
                    'range': range,
                    'country':chck.country,
                    'companySize': chck.companySize,
                    'numOfCustomer': chck.numOfCustomer,
                    'webUrl': chck.webUrl,
                    'linkedinUrl': chck.linkedinUrl,
                    'blogUrl': chck.blogUrl,
                    'image': chck.image,
                    'status': status,
                    'seeker':hire,
                    'subscription': price,
                    'subType':type,
                    'subRenewal':renew,
                    'createdAt': dte
                }
                return res.json({ code: codes.success, message: messages.success, result: data });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async businessCountForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var adminId = req.obj.result.userId;
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var reg = await businessModel.countDocuments({});
            var pay  = await busSubScriptionModel.countDocuments({});
            var totlAmount = await busSubScriptionModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                }
               ])
               var totlAnnual = await busSubScriptionModel.aggregate([
                   {$match:{'subsType':'yearly'}},
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                }
               ])
               
               var totlOtp = await busSubScriptionModel.aggregate([
                {$match:{'subsType':'oneTime'}},
             {
                 $group: {
                     _id: null,
                     total: { $sum: "$price" }
                 }
             }
            ])
            var totlActive = await salesModel.countDocuments({'status':true});
            var totlDraft = await salesModel.countDocuments({'saveAsDraft':true});
            var totlDeactive = await businessModel.countDocuments({'isActive':false});
            var seeker = await seekerModel.countDocuments({});

            var payPercent = (reg*pay/100).toFixed(2)
            // if (chck) {
                var data = {
                    'registered':reg,
                    'payment':payPercent,
                   'totlAmount':totlAmount,
                   'totlAnnual':totlAnnual,
                   'totlOtp':totlOtp,
                   'totlActive':totlActive,
                   'totlDraft':totlDraft,
                   'totlDeactive':totlDeactive,
                   'seeker':seeker,
                   'revenue':0,
                   'commission':0
                }
                return res.json({ code: codes.success, message: messages.success, result: data });
            // } else {
            //     return res.json({ code: codes.badRequest, message: messages.notFound })
            // }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }


    async deleteSession(req,res){
        try{
            const messages = message.messages(req.header('language'));
            let userId = req.obj.result.userId;
            let type = req.body.type;
            if(!userId || !type){
                return res.json({code:codes.badRequest,message:messages.BadRequest})
            }
            let chck = await sessionModel.findOne({'userId':userId})
            if(chck){
                if(chck.type==='seekers'){
                    var detail = await seekerModel.findOne({'_id':userId});
                }else{
                    var detail = await businessModel.findOne({'_id':userId})
                }
                   if(chck.type===type){
                       var obj_data ={
                           'token':chck.token,
                           'type':chck.type,
                           'userDetail':detail
                       }
                       return res.json({code:codes.success,message:messages.success,result:obj_data})
                   }else{
                       await sessionModel.deleteMany({'userId':userId});
                       return res.json({code:codes.badRequest,message:messages.BadRequest})
                   }
            }else{
                return res.json({code:codes.badRequest,message:messages.notFound})
            }
        }catch(error){
            console.log(error)
        }
    }

    async deleteBusinessAccount(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            if(!userId){
                return res.json({code:codes.badRequest,message:messages.BadRequest})
            }else{
                var usr = await Promise.all([
                     businessModel.deleteOne({'_id':userId}),
                     salesModel.deleteMany({'businessId':userId}),
                     offerModel.deleteMany({'businessId':userId}),
                     notificationModel.deleteMany({'businessId':userId}),
                     favoriteModel.deleteMany({'businessId':userId}),
                     roomModel.deleteMany({'businessId':userId})
                ])
                return res.json({code:codes.success,message:messages.success})
            }
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:messages.serverError})
        }
    }


    async notInterestedSeeker(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var salesId = req.body.salesId;
            var userId = req.obj.result.userId;
            if(!salesId || !userId){
                return res.json({code:codes.badRequest,messsage:messages.BadRequest})
            }
            var obj = {
                'salesId':salesId,
                'seekerId':req.body.seekerId
            }
            var usr = await InterestModel(obj).save()
            if(usr){
                return res.json({code:codes.success,message:messages.success,result:usr})
            }else{
                return res.json({code:codes.badRequest,message:messages.somethingWrong})
            }
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:messages.serverError})
        }
    }
}

module.exports = businessServices;