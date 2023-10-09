var seekerModel = require('../models/seekers');
var sessionModel = require('../models/business').sessionModel;
var salesModel = require('../models/salesOpportunity').salesModel;
var businessModel = require('../models/business').businessModel;
var offerModel = require('../models/offerApply');
var averageDealModel = require('../models/seekerDropDownList').averageDealModel;
var messageModel = require('../models/chat').messageModel;
var roomModel = require('../models/chat').roomModel;
var notificationModel = require('../models/chat').notificationModel;
var favoriteModel = require('../models/favorite');
var RatingModel = require('../models/rating');
var offerModel = require('../models/offerApply');
const ObjectId = require('mongodb').ObjectID;
var InterestModel = require('../models/notInterest');
var codes = require('../codes/codes');
var methods = require('../methods/methods')
var moment = require('moment-timezone');
var message = require('../codes/messages');
var uniqid = require('uniqid');
var moment = require('moment-timezone');


class seekerService {
    async signUp(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            if (!req_data.firstName || !req_data.lastName || !req_data.email || !req_data.password) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var mail = (req_data.email).toLowerCase();

            var chck = await seekerModel.findOne({ 'email': mail})
            if (chck) {
                return res.json({ code: codes.badRequest, message: messages.AlreadyExists })
            } else {
                var token = methods.authToken();

                var password = methods.password_auth(req_data.password);

                var obj = {
                    'firstName': req_data.firstName,
                    'lastName': req_data.lastName,
                    'fullName': req_data.firstName + ' ' + req_data.lastName,
                    'email': mail,
                    'password': password,
                    'uniqueId': uniqid(),
                    'createdAt': moment(new Date()).tz(timeZone).format()
                }
                var save = await new seekerModel(obj).save();

                var sessionData = {
                    'userId': save._id,
                    'token': token,
                    'type': 'seekers'

                }
                var session = await new sessionModel(sessionData).save();

                var data = {
                    '_id': save._id,
                    'firstName': save.firstName,
                    'lastName': save.lastName,
                    'fullName': save.fullName,
                    'email': save.email,
                    'uniqueId': save.uniqueId,
                    'token': token,
                    'type':'seekers'
                }
                var verify_link = 'https://succeednode.herokuapp.com/api/v1/business/verifyUserEmail/' + data.uniqueId

                var obj_data = {
                    'email': save.email,
                    'message': '',
                    'html': '<html><body><p>You are receiving this because you need  verify your email address for your account on Sales-Succeed.\n\n' +
                        'Please click on the link given below for verifying your email:</p> <a href = ' + verify_link + ' >Verify Link</a><p>' +
                        'If you did not request this, please ignore this email.\n</p><p>\n\n' +
                        'thanks</p><p>\n\n' + 'Sales-Succeed Team</p></body></html>',
                    'subject': 'Link for verifying email for Sales-Succeed'
                };
                methods.send_email(obj_data);

                return res.json({ code: codes.success, message: messages.signUp, result: data })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async social_login(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var data = req.body
            if (!data.socialId || !data.socialType) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var token = methods.authToken();
            let usr = await seekerModel.findOne({ $or: [{ 'email': data.email }, { 'socialId': data.socialId }] })
            if (usr) {
                await sessionModel.deleteOne({ 'userId': usr._id });
                await new sessionModel({ 'userId': usr._id, 'token': token, 'type': 'seekers' }).save();

                await seekerModel.updateOne({ '_id': usr._id }, { $set: { 'socialId': data.socialId, 'socialType': data.socialType } });
                var userDetails = {
                    'userDetail':usr,
                    'token': token,
                    'type':'seekers'
                }
                return res.json({ code: codes.success, message: messages.login, result: userDetails });
            } else {
                //var password = methods.password_auth(req_data.password);

                var req_data = {
                    'firstName': data.firstName,
                    'lastName': data.lastName,
                    'fullName': data.firstName + ' ' + data.lastName,
                    'email': data.email,
                    'socialId': data.socialId,
                    //'password': password,
                    'socialType': data.socialType,
                    'uniqueId': uniqid(),
                    'createdAt': moment(new Date()).tz(req.header('timezone')).format(),
                    'timezone': req.header('timezone')
                }
                let usr = await new seekerModel(req_data).save();
                if (usr) {
                    await new sessionModel({ 'userId': usr._id, 'token': token, 'type': 'seekers' }).save();
                    var userDetails = {
                        '_id': usr._id,
                        'firstName': usr.firstName,
                        'lastName': usr.lastName,
                        'fullName': usr.fullName,
                        'email': usr.email,
                        'socialId': usr.socialId,
                        'socialType': usr.socialType,
                        'uniqueId': usr.uniqueId,
                        'type':'seekers',
                        'token': token
                    }
                }
                return res.json({ code: codes.success, message: messages.signUp, result: userDetails });
            }
        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

    
    async login(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            if (!req_data.email || !req_data.password) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var mail = (req_data.email).toLowerCase();

            var chck = await seekerModel.findOne({ 'email':mail })
            if (chck) {
                if(chck.password){
                var password_status = methods.compare_pass({ 'password': req_data.password, 'user_pass': chck.password });
                if (password_status == false) {
                    return res.json({ code: codes.badRequest, message: messages.invalidPass });
                } else {
                    await sessionModel.deleteOne({ 'userId': chck._id });
                    var token = methods.authToken();
                    var sessionData = {
                        'userId': chck._id,
                        'token': token,
                        'type': 'seekers'
                    }
                    await new sessionModel(sessionData).save();
                    var data = {
                        '_id': chck._id,
                        'firstName': chck.firstName,
                        'lastName': chck.lastName,
                        'fullName': chck.fullName,
                        'email': chck.email,
                        'token': token,
                        'image':chck.image,
                        'sector':chck.sector,
                        'countryIndex':chck.countryIndex,
                        'type':'seekers'
                    }
                    return res.json({ code: codes.success, message: messages.login, result: data })
                }
             } else{
                    return res.json({ code: codes.badRequest, messages: messages.invalidPass })

                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
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
            var usr = await seekerModel.findOne({ '_id': userId });
            if (usr) {
                var password_status = methods.compare_pass({ 'password': req_data.oldPassword, 'user_pass': usr.password });
                if (password_status == false) {
                    return res.json({ code: codes.badRequest, message: messages.invalidPass });
                } else {
                    var password = methods.password_auth(req_data.password);
                    await seekerModel.updateOne({ '_id': userId }, { $set: { 'password': password } });
                    return res.json({ code: codes.success, message: messages.success });
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notExists });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: message.messages.serverError })
        }
    }
    
    async resetPassword(req, res) {
        try {
            var messages = message.messages(req.header('language'));

            var req_data = req.body;
            if (!req_data.email || !req_data.password || !req_data.oldPassword) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }

            var usr = await seekerModel.findOne({ 'email': req_data.email })

            if (usr) {
                var password_status = methods.compare_pass({ 'password': req_data.oldPassword, 'user_pass': usr.password });
                if (password_status == false) {
                    return res.json({ code: codes.badRequest, message: messages.invalidPass });
                } else {
                    var password = methods.password_auth(req_data.password);
                        await seekerModel.updateOne({ '_id': usr._id }, { $set: { 'password': password } });
          
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

    async forgotpassword(req, res) {
        try {
            var messages = message.messages(req.header('language'));
           // var userId = req.obj.result.userId;
            var data = req.body;
            if (!data.email) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var number = Math.floor(Math.random() * 900000) + 100000;
            var newPwd = (number).toString()
            var password = methods.password_auth(newPwd);
            var chck = await seekerModel.findOne({'email':data.email,'isActive':true});
            if(chck){
            var seeker = await seekerModel.updateOne({ 'email': data.email}, { $set: { 'password': password } });
               
            if (seeker) {
                var mail = {    
                    'subject': ' Forgot password',
                    'message': 'Hi' + ' ' + seeker.firstName + ',' + ' ' +
                    'A password reset request was requested for the Sale Succeed account linked to this email address.'+ //' + ' ' + newPwd + ' ' +
                    'Simply enter the below OTP on SaleSucceed Portal in order to reset the password.' + ' ' +
                    'Your OTP is' + ' ' + newPwd + ' . ' +
                    'The Sales Succeed Team',
                   // 'html': '',
                    'email': data.email
                }
                methods.send_email(mail);
                return res.json({ code: codes.success, message: messages.forgotMail });
            } else {
                return res.json({ code: codes.badRequest, message: messages.somethingWrong });
            }
        }else{
            return res.json({ code: codes.badRequest, message: messages.notFound });

        }
        } catch (error) {
            console.log(error.message);
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

    async verifyUserEmail(req, res) {
        try {
            var usr = await seekerModel.updateOne({ 'uniqueId': req.params.uniqueId }, { $set: { 'emailVerify': true } });
            console.log(usr)
            res.send('Email verify succesfully');
        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }


    async setUpProfile(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var usr = await seekerModel.findOne({ '_id': userId, 'isActive': true })
            if (usr) {
                var obj_data = {
                    'describeBest': req_data.describeBest ? req_data.describeBest : usr.describeBest,
                    'lookingFor': req_data.lookingFor ? req_data.lookingFor : usr.lookingFor,
                    'country': req_data.country ? req_data.country : usr.country,
                    'city': req_data.city ? req_data.city : usr.city,
                    'countryIndex':req_data.countryIndex ? req_data.countryIndex : usr.countryIndex

                }
                var updte = await seekerModel.updateOne({ '_id': userId }, { $set: obj_data })
                if (updte) {
                    var data = await seekerModel.findOne({ '_id': userId }).populate([ { path: 'lookingFor', match: { _id: { $ne: null } } }])
                    var obj = {
                        'type':'seekers',
                        'describeBest': data.describeBest,
                        'lookingFor': data.lookingFor,
                        'country': data.country,
                        'city': data.city,
                        'countryIndex':data.countryIndex,
                        'userDetail':data
                    }
                    return res.json({ code: codes.success, message: messages.success, result: obj })
                } else {
                    return res.json({ code: codes.badRequest, message: messages.somethingWrong })
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async aboutYouProfile(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var usr = await seekerModel.findOne({ '_id': userId, 'isActive': true })
            if (usr) {        

                var img = usr.image;
                if (req.file) {
                    img = req.file.path;
                }
                if (req_data.language) {
                    var lang = JSON.parse(req_data.language);   
                }
                var obj_data = {
                    'type':'seekers',
                    'firstName': req_data.firstName ? req_data.firstName : usr.firstName,
                    'lastName': req_data.lastName ? req_data.lastName : usr.lastName,
                    'image': img,
                    'headLine': req_data.headLine ? req_data.headLine : usr.headLine,
                    'language': lang ? lang : usr.language,
                    'countryCode': req_data.countryCode ? req_data.countryCode : usr.countryCode,
                    'phone': req_data.phone ? req_data.phone : usr.phone,
                    'summary': req_data.summary ? req_data.summary : usr.summary,
                    'websiteUrl': req_data.websiteUrl ? req_data.websiteUrl : usr.websiteUrl,
                    'linkedInUrl': req_data.linkedInUrl ? req_data.linkedInUrl : usr.linkedInUrl,
                    'blogUrl': req_data.blogUrl ? req_data.blogUrl : usr.blogUrl,
                    'aboutYouPage': req_data.aboutYouPage ? req_data.aboutYouPage : usr.aboutYouPage
                   //    'profileStatusPercentage':count

                }
                
                var updte = await seekerModel.updateOne({ '_id': userId }, { $set: obj_data })
                if (updte) {
                    var data = await seekerModel.findOne({ '_id': userId }).populate([{ path: 'language.proficiency' }, { path: 'language.language' }])
                    var obj = {
                        'type':'seekers',
                        'firstName': data.firstName,
                        'lastName': data.lastName,
                        'image': data.image,
                        'headLine': data.headLine,
                        'language': data.language,
                        'countryCode': data.countryCode,
                        'phone': data.phone,
                        'summary': data.summary,
                        'websiteUrl': data.websiteUrl,
                        'linkedInUrl': data.linkedInUrl,
                        'blogUrl': data.blogUrl,
                        'countryIndex':data.countryIndex,
                        'aboutYouPage': data.aboutYouPage,
                        'profileStatusPercentage':data.profileStatusPercentage
                    }
                    return res.json({ code: codes.success, message: messages.success, result: obj })
                } else {
                    return res.json({ code: codes.badRequest, message: messages.somethingWrong })
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async deleteLanguageFromSeeker(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var req_data = req.body;
            if (!userId || !req_data.languageId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var usr = await seekerModel.findOne({ '_id': userId, 'isActive': true })
            if (usr) {
                var updte = await seekerModel.updateOne({ '_id': userId }, { $pull: { 'language': { "_id": req_data.languageId } } });
                if (updte) {
                    return res.json({ code: codes.success, message: messages.success })
                } else {
                    return res.json({ code: codes.badRequest, message: messages.somethingWrong })
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async deleteTrainingAndProductSeeker(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var req_data = req.body;
            if (!userId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var usr = await seekerModel.findOne({ '_id': userId, 'isActive': true })
            if (usr) {
                if (req_data.trainingId) {
                    var updte = await seekerModel.update({ '_id': userId }, { $pull: { 'training': { "_id": req_data.trainingId } } });
                    return res.json({ code: codes.success, message: messages.success })
                } else {
                    var updte = await seekerModel.update({ '_id': userId }, { $pull: { 'productAndService': { "_id": req_data.productId } } });
                    return res.json({ code: codes.success, message: messages.success })
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async experienceProfile(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var usr = await seekerModel.findOne({ '_id': userId, 'isActive': true })

            if (usr) {
                var obj_data = {
                    'experience': req_data.experience ? req_data.experience : usr.experience,
                    'sector': req_data.sector ? req_data.sector : usr.sector,
                    //'productAndService': req_data.productAndService ? req_data.productAndService : usr.productAndService,
                    'industry': req_data.industry ? req_data.industry : usr.industry,
                    'service': req_data.service ? req_data.service : usr.service,
                    'sellingPreferred': req_data.sellingPreferred ? req_data.sellingPreferred : usr.sellingPreferred,
                    'avgDeal': req_data.avgDeal ? req_data.avgDeal : usr.avgDeal,
                    'highestDegree': req_data.highestDegree ? req_data.highestDegree : usr.highestDegree,
                    'training': req_data.training ? req_data.training : usr.training,
                    'experiencePage': req_data.experiencePage ? req_data.experiencePage : usr.experiencePage
                  // 'profileStatusPercentage':count.toFixed(2)
                }
                var updte = await seekerModel.updateOne({ '_id': userId }, { $set: obj_data })
                if (updte) {
                    var data = await seekerModel.findOne({ '_id': userId }).populate([{ path: 'experience' }, { path: 'sector' }, { path: 'service' }, { path: 'sellingPreferred' }, { path: 'avgDeal' }, { path: 'highestDegree' }])
                    var obj = {
                        'experience': data.experience,
                        'sector': data.sector,
                        //  'productAndService': data.productAndService,
                        'industry': data.industry,
                        'service': data.service,
                        'sellingPreferred': data.sellingPreferred,
                        'avgDeal': data.avgDeal,
                        'highestDegree': data.highestDegree,
                        'training': data.training,
                        'experiencePage': data.experiencePage,
                        'profileStatusPercentage':data.profileStatusPercentage
                    }

                    return res.json({ code: codes.success, message: messages.success, result: obj })
                } else {
                    return res.json({ code: codes.badRequest, message: messages.somethingWrong })
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async deleteTrainingFromSeeker(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var req_data = req.body;
            if (!userId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var usr = await seekerModel.findOne({ '_id': userId, 'isActive': true })
            if (usr) {
                var updte = await seekerModel.updateOne({ '_id': userId }, { $pull: { 'training':  req_data.training  } });
                if (updte) {
                    return res.json({ code: codes.success, message: messages.success })
                } else {
                    return res.json({ code: codes.badRequest, message: messages.somethingWrong })
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async networkProfileWhenChecked(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var usr = await seekerModel.findOne({ '_id': userId, 'isActive': true })
   
            if (usr) {
                var obj_data = {
                    'alreadyHaveNetwork':req_data.alreadyHaveNetwork,
                    'industryNetwork': req_data.industryNetwork ? req_data.industryNetwork : usr.industryNetwork,
                    'serviceNetwork': req_data.serviceNetwork ? req_data.serviceNetwork : usr.serviceNetwork,
                    'sizeNetwork': req_data.sizeNetwork ? req_data.sizeNetwork : usr.sizeNetwork,
                    'regionNetwork': req_data.regionNetwork ? req_data.regionNetwork : usr.regionNetwork,
                    'countryNetwork': req_data.countryNetwork ? req_data.countryNetwork : usr.countryNetwork,
                    'function': req_data.function ? req_data.function : usr.function,
                    'seniority': req_data.seniority ? req_data.seniority : usr.seniority,
                     'networkPage': req_data.networkPage ? req_data.networkPage : usr.networkPage
                   // 'profileStatusPercentage':prcnt
                }
                var updte = await seekerModel.updateOne({ '_id': userId }, { $set: obj_data })
                var chck = await seekerModel.findOne({'_id':userId})

           
                    var data = await seekerModel.findOne({ '_id': userId }).populate([ { path: 'serviceNetwork' }, { path: 'sizeNetwork' }, { path: 'function' }, { path: 'seniority' }])
                    var obj = {
                        'alreadyHaveNetwork':data.alreadyHaveNetwork,
                        'industryNetwork': data.industryNetwork,
                        'serviceNetwork': data.serviceNetwork,
                        'sizeNetwork': data.sizeNetwork,
                        'regionNetwork': data.regionNetwork,
                        'countryNetwork': data.countryNetwork,
                        'function': data.function,
                        'seniority': data.seniority,
                        'networkPage': data.networkPage,
                        'profileStatusPercentage':data.profileStatusPercentage

                    }
                    return res.json({ code: codes.success, message: messages.success, result: obj })
          
                
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async networkProfileWhenNotChecked(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var usr = await seekerModel.findOne({ '_id': userId, 'isActive': true })
            if (usr) {
                var obj_data = {
                    'countryTerritory': req_data.countryTerritory ? req_data.countryTerritory : usr.countryTerritory,
                    'regionId': req_data.regionId ? req_data.regionId : usr.regionId,
                    'otherDetail': req_data.otherDetail ? req_data.otherDetail : usr.otherDetail,
                   // 'profileStatusPercentage':usr.profileStatusPercentage,
                    'territoriesPage': req_data.territoriesPage ? req_data.territoriesPage : usr.territoriesPage

                }
                
                var updte = await seekerModel.updateOne({ '_id': userId }, { $set: obj_data })
      
                    var data = await seekerModel.findOne({ '_id': userId });
                    var obj = {
                        'countryTerritory': data.countryTerritory,
                        'regionId': data.regionId,
                        'otherDetail': data.otherDetail,
                      //  'profileStatusPercentage':data.profileStatusPercentage,
                        'territoriesPage': data.territoriesPage
                    }
                    return res.json({ code: codes.success, message: messages.success, result: obj })
                // } else {
                //     return res.json({ code: codes.badRequest, message: messages.somethingWrong })
                // }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }



    async progressBarReport(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var chck = await seekerModel.findOne({'_id':userId});
            if(chck){
                var count = 0
                if(chck.aboutYouPage==true && chck.experiencePage== true && chck.networkPage== true && chck.territoriesPage ==true){
                     var count1 = (9*5.89).toFixed(2);
                     var count = parseInt(count1)
                     if(chck.industryNetwork.length && chck.industryNetwork !=' '){
                        var count = count + 5.89
                    }
                      if( chck.serviceNetwork.length && chck.serviceNetwork !=' ') {
                        var count = count + 5.89
                    } 
                      if( chck.sizeNetwork.length && chck.sizeNetwork !=' '){
                        var count = count + 5.89
                    }
                      if( chck.regionNetwork.length && chck.regionNetwork !='' ){
                        var count = count + 5.89
                    }
                      if(chck.countryNetwork.length && chck.countryNetwork != ' '){
                        var count = count + 5.89
                    }
                     if(chck.function.length && chck.function !=' ' ){
                        var count = count + 5.89
                    }
                    if  (chck.seniority.length && chck.seniority !=' ' ){
                        var count = count + 5.89
                    }
                    if(chck.otherDetail.length && chck.otherDetail !=''){
                        // var count = count + 3*(5.89)
                        var count = count + 5.89
    
                    }
                }else if(chck.aboutYouPage==true && chck.experiencePage== true && chck.networkPage== true){
                    var count1 = (7*5.89).toFixed(2);
                    var count = parseInt(count1)

                    if(chck.industryNetwork.length && chck.industryNetwork !=' '){
                        var count = count + 5.89
                    }
                      if( chck.serviceNetwork.length && chck.serviceNetwork !=' ') {
                        var count = count + 5.89
                    } 
                      if( chck.sizeNetwork.length && chck.sizeNetwork !=' '){
                        var count = count + 5.89
                    }
                      if( chck.regionNetwork !=' ' && chck.regionNetwork.length ){
                        var count = count + 5.89
                    }
                      if(chck.countryNetwork.length && chck.countryNetwork != ' '){
                        var count = count + 5.89
                    }
                     if(chck.function.length && chck.function !=' ' ){
                        var count = count + 5.89
                    }
                    if  (chck.seniority.length && chck.seniority !=' ' ){
                        var count = count + 5.89
                    }
                }else if(chck.aboutYouPage==true && chck.experiencePage== true){
                    var count1 = (7*5.89).toFixed(2);
                    var count = parseInt(count1)

                }else if(chck.aboutYouPage==true){
                    var count1 = (3*5.89).toFixed(2);
                    var count = parseInt(count1)

                }else if(chck.experiencePage==true){
                    var count1 = (4*5.89).toFixed(2);
                    var count = parseInt(count1)

                }else if(chck.networkPage==true){
                    if(chck.industryNetwork.length && chck.industryNetwork !=' '){
                        var count = count + 5.89
                    }
                      if( chck.serviceNetwork.length && chck.serviceNetwork !=' ') {
                        var count = count + 5.89
                    } 
                      if( chck.sizeNetwork.length && chck.sizeNetwork !=' '){
                        var count = count + 5.89
                    }
                      if( chck.regionNetwork !=' ' && chck.regionNetwork.length ){
                        var count = count + 5.89
                    }
                      if(chck.countryNetwork.length && chck.countryNetwork != ' '){
                        var count = count + 5.89
                    }
                     if(chck.function.length && chck.function !=' ' ){
                        var count = count + 5.89
                    }
                    if  (chck.seniority.length && chck.seniority !=' ' ){
                        var count = count + 5.89
                    }
                }else if(chck.territoriesPage==true){
                    if  (chck.countryTerritory.length && chck.countryTerritory !=' ' ){
                        var count = count + 5.89
                    }
                    if  (chck.regionId.length && chck.regionId !=' ' ){
                        var count = count + 5.89
                    }
                    if  (chck.otherDetail.length && chck.otherDetail !=' ' ){
                        var count = count + 5.89
                    }
                }else{
                    var count =0
                }
                var x =parseInt(count).toFixed(2)
                var updte = await seekerModel.updateOne({'_id':userId},{$set:{'profileStatusPercentage':x}})
               var usr = await seekerModel.findOne({'_id':userId})
                return res.json({code:codes.success,message:messages.success,result:usr})
            }else{
                return res.json({code:codes.badRequest,message:messages.notFound})
            }
          }catch(error){
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });

        }
    }
    async salesDetailForSeekerSection(req, res) {
    try {
            var messages = message.messages(req.header('language'));
            var seekerId = req.obj.result.userId;
            if (!seekerId || !req.body.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let data = await salesModel.findOne({ '_id': req.body.salesId, 'isDelete': false }).populate([
                { path: 'productId' }, { path: 'businessId', populate: [ { path: 'range' },{path:'companySize', match: { _id: { $ne: null } }},{path:'numOfCustomer', match: { _id: { $ne: null } }}] }, { path: 'sellingMethodId' }, { path: 'sector' }, { path: 'industryId' },{ path: 'currency',match: { _id: { $ne: null }}},{path:'experinceRequired'}, { path: 'language', match: { _id: { $ne: null } } },{ path: 'avgSaleCycle', match: { _id: { $ne: null } } },{ path: 'repeatCustomerSpend', match: { _id: { $ne: null } } }
            ]);
            var chck = await seekerModel.findOne({'_id':seekerId});
            var apply =   await offerModel.findOne({ 'salesId':req.body.salesId,'seekerId':seekerId,'isApplied':true })
               if(apply){
                   var applied = true
               }else{
                   var applied = false
               }
            if (data) {
                return res.json({ code: codes.success, message: messages.success, result: data,isApplied:applied,personal_data:chck });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }
    ////Dashboard 


    async activeJobsMyApplicationForSeeker(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var arr =[]
            var req_data = req.body;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            if(req_data.sortBy==true){
                var sort ={
                    'appliedDate':-1
                }
            }else{
                var sort ={
                     'appliedDate':1
                }
            }
            if (req_data.search && req_data.search != null) {
                var obj_data = {
                    $and: [{ 'tittle': { '$regex': req_data.search, '$options': 'i' } }, { 'jobStatus': 'Posted' }] //, { 'jobStatus': 'Active' }]
                }
                var usr = await salesModel.find(obj_data, { 'password': 0 })//.skip(perPage * (pageNo - 1)).limit(perPage);
          
            } else {
                var usr = await salesModel.find({'jobStatus':'Posted'});
            }
            if(usr && usr.length){
            for(var i = 0;i<usr.length;i++){
                var chck = await offerModel.findOne({'seekerId':userId,'salesId':usr[i]._id,'isApplied':true}).sort(sort).populate([{path:'seekerId',select:'firstName lastName image phone'},{path:'salesId'},{path:'businessId',select:'firstName companyName'}]).skip(perPage * (pageNo - 1)).limit(perPage);
                var fav = await favoriteModel.findOne({'seekerId':userId,'salesId':usr[i]._id,'isFavorite':true});
                if(fav){
                    var favsale = true
                }else{
                    var favsale = false
                }
                if(chck){
                    const newTestJson = JSON.parse(JSON.stringify(chck));
                    newTestJson.isFavorite = favsale;
                    chck = newTestJson;
                    // var obj = {
                    //     'salesDetail':chck,
                    //     'isFavorite':favsale
                    // }
                arr.push(chck)
                }
            }
            return res.json({ code: codes.success, message: messages.success, result: arr })
        }else{
            return res.json({code:codes.badRequest,message:messages.notFound})
        }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: message.messages.serverError })
        }
    }

    async closedJobsMyApplicationForSeeker(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var arr =[]
            var req_data = req.body;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            if(req_data.sortBy==true){
                var sort ={
                    'appliedDate':-1
                }
            }else{
                var sort ={
                     'appliedDate':1
                }
            }
            if (req_data.search && req_data.search != null) {
                var obj_data = {
                    $and: [{ 'tittle': { '$regex': req_data.search, '$options': 'i' } }, { 'jobStatus': 'Closed' }] //, { 'jobStatus': 'Active' }]
                }
                var usr = await salesModel.find(obj_data, { 'password': 0 });//.skip(perPage * (pageNo - 1)).limit(perPage);
          
            } else {
                var usr = await salesModel.find({'jobStatus':'Closed'});
            }
            if(usr && usr.length){
            for(var i = 0;i<usr.length;i++){
                var chck = await offerModel.findOne({'seekerId':userId,'salesId':usr[i]._id,'isApplied':true}).sort(sort).populate([{path:'seekerId',select:'firstName lastName image phone'},{path:'salesId'},{path:'businessId',select:'firstName companyName'}]).skip(perPage * (pageNo - 1)).limit(perPage);
                if(chck){
                arr.push(chck)
                }
            }
            return res.json({ code: codes.success, message: messages.success, result: arr })
        }else{
            return res.json({code:codes.badRequest,message:messages.notFound})
        }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: message.messages.serverError })
        }
    }


    async viewProfileDashBoardForSeeker(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var usr = await seekerModel.findOne({ '_id': userId, 'isActive': true }, { 'password': 0 }).populate([{ path: 'language.proficiency' },{ path: 'language.language' }, { path: 'experinceRequired',match: { _id: { $ne: null }}},
            { path: 'serviceNetwork',match: { _id: { $ne: null }}},{ path: 'sizeNetwork',match: { _id: { $ne: null }}},{ path: 'function',match: { _id: { $ne: null }}},{ path: 'seniority',match: { _id: { $ne: null }}},
            { path: 'avgDeal',match: { _id: { $ne: null }}},{ path: 'experience',match: { _id: { $ne: null }}},{ path: 'highestDegree',match: { _id: { $ne: null }}},
            { path: 'sector',match: { _id: { $ne: null }}},{ path: 'sellingPreferred',match: { _id: { $ne: null }}},{ path: 'service',match: { _id: { $ne: null }}},{ path: 'lookingFor',match: { _id: { $ne: null }}}]);
            if (usr) {
                return res.json({ code: codes.success, message: messages.success, result: usr })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: message.messages.serverError })
        }
    }


   async ProgressBarDetail(req,res){
       try{
        var messages = message.messages(req.header('language'));
        var userId = req.obj.result.userId;
        var chck = await seekerModel.findOne({'_id':userId},{'profileStatusPercentage':1});
        if(chck){
          return res.json({code:codes.success,message:messages.success,result:chck});
        }else{
            return res.json({code:codes.badRequest,message:messages.notFound})
        }
       }catch(error){
           console.log(error)
           return res.json({code:codes.serverError,message:messages.serverError})
       }
   }

    async featuredOppurtinityForSeekerDashboard(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var arr =[];
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            if (req_data.search && req_data.search != null) {
                var obj_data = {
                    'tittle': { '$regex': req_data.search, '$options': 'i' } //, { 'jobStatus': 'Active' }]
                }
            }else{
                var obj_data = {'isDelete':false}
            }
            var usr = await salesModel.find(obj_data).sort({ 'jobViews': -1, 'avgRating': -1 }).populate([{path:'businessId',select:'companyName firstName lastName'}]).skip(perPage * (pageNo - 1)).limit(perPage);
            if (usr && usr.length) {
                for(var i =0;i<usr.length;i++){
                    var seeker = await InterestModel.findOne({'seekerId':userId,'salesId':usr[i]._id})
                    if(!seeker){
                    var fav = await favoriteModel.findOne({'seekerId':userId,'salesId':usr[i]._id,'isFavorite':true});
                     if(fav){
                         var favsale = true
                     }else{
                         var favsale = false
                     }
                    var obj = {
                        'salesDetail':usr[i],
                        'isFavorite':favsale
                    }
                    arr.push(obj)
            }   
                }
                return res.json({ code: codes.success, message: messages.success, result: arr })
           // }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async activeInSearchJobScreen(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var arr = []
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            if (req_data.search && req_data.search != null) {
                var obj_data = {
                    $and: [{ 'tittle': { '$regex': req_data.search, '$options': 'i' } }, { 'jobStatus': 'Active' }] //, { 'jobStatus': 'Active' }]
                }
            } else {
                var obj_data = {
                    'jobStatus': 'Active'
                }
            }
            var sales = await salesModel.find(obj_data, { 'password': 0 }).skip(perPage * (pageNo - 1)).limit(perPage);
            if (sales && sales.length) {
                for (var i = 0; i < sales.length; i++) {
                    var offr = await offerModel.findOne({ 'jobId': sales[i]._id, 'seekerId': userId })
                    if (!offr) {
                        arr.push(sales[i])
                    }
                    return res.json({ code: codes.success, message: messages.success, result: arr })
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async sentInSearchJobScreen(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var arr = [];

            if (req_data.search && req_data.search != null) {
                var obj_data = {
                    $and: [{ 'tittle': { '$regex': req_data.search, '$options': 'i' } }, { 'isActive': true }] //, { 'jobStatus': 'Active' }]
                }
                var usr = await salesModel.find(obj_data, { 'password': 0 }).skip(perPage * (pageNo - 1)).limit(perPage);
                if (usr && usr.length) {
                    for (var i = 0; i < usr.length; i++) {
                        var seeker = await offerModel.findOne({ 'jobId': usr[i]._id, 'seekerId': userId, 'isApplied': true }).populate([{ path: 'seekerId' }, { path: 'jobId' }, { path: 'businessId' }]).sort({ "appliedDate": -1 }).skip(perPage * (pageNo - 1)).limit(perPage);
                        if (seeker) {
                            arr.push(seeker)
                        }
                    }
                    return res.json({ code: codes.success, message: messages.success, result: arr })
                } else {
                    return res.json({ code: codes.badRequest, message: messages.notFound })
                }
            } else {
                var apply = await offerModel.find({ 'seekerId': userId, 'isApplied': true }).populate([{ path: 'seekerId' }, { path: 'jobId' }, { path: 'businessId' }]).sort({ "appliedDate": -1 }).skip(perPage * (pageNo - 1)).limit(perPage);
                if (apply && apply.length) {
                    return res.json({ code: codes.success, message: messages.success, result: apply })
                } else {
                    return res.json({ code: codes.badRequest, message: messages.notFound })
                }
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async offerProposal(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var arr =[]
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var offr = await offerModel.find({ 'seekerId': userId, 'sendOfferLetter': true }).sort({'createdAt':-1}).populate([{ path: 'seekerId', select:'firstName lastName'}, { path: 'salesId',select:'tittle' }, { path: 'businessId',select:'firstName companyName' }, { path: 'offerLetterId' }]).skip(perPage * (pageNo - 1)).limit(perPage);
            var offrCount = await offerModel.countDocuments({ 'seekerId': userId, 'sendOfferLetter': true });
            var submitted = await offerModel.find({ 'seekerId': userId, 'isApplied': true }).sort({'createdAt':-1}).populate([{ path: 'seekerId', select:'firstName lastName'}, { path: 'salesId',select:'tittle' }, { path: 'businessId',select:'firstName companyName' }, { path: 'offerLetterId' }]).skip(perPage * (pageNo - 1)).limit(perPage);
            var submittedCount = await offerModel.countDocuments({ 'seekerId': userId, 'isApplied': true });
            var ActiveProposal = await roomModel.find({ 'seekerId': userId }).sort({'createdAt':-1}).skip(perPage * (pageNo - 1)).limit(perPage);
               for(var i=0;i<ActiveProposal.length;i++){
              //  var cout = await messageModel.find({'seekerId':{$ne:ActiveProposal[i].seekerId},'salesId':ActiveProposal[i].salesId,'isApplied':true})

                   var data = await offerModel.findOne({'seekerId':ActiveProposal[i].seekerId,'salesId':ActiveProposal[i].salesId,'isApplied':true})
                   if(!data){
                    var active_data = await messageModel.findOne({'roomId':ActiveProposal[i].roomId}).populate([{ path: 'seekerId', select:'firstName lastName'}, { path: 'salesId',select:'tittle' }, { path: 'businessId',select:'firstName companyName' }])//.skip(perPage * (pageNo - 1)).limit(perPage);
                     if(active_data){
                    arr.push(active_data)
                   }
                }
               }
               var obj_data = {
                   'offer':offr,
                   'offerCount':offrCount,
                   'submitted':submitted,
                   'submittedCount':submittedCount,
                   'activeProposal':arr,
                   'activeCount':arr.length
               }
                return res.json({ code: codes.success, message: messages.success,result:obj_data })
       
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async filterForSeekerJob(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var arr = [];
            var ary =[];
            var obj = {};
            var sort = { 'createdAt': -1 }
            var seekr = await seekerModel.findOne({'_id':userId},{experience:1,firstName:1}).populate([{path:'experience'}])
            if (req_data.sortBy != null && req_data.filter != null) {

                if (req_data.filter == 'Industry' && req_data.sortBy == 'Most Recent') {
                    var obj = {
                        'industryId': req_data.industryId
                        //  $and: [{ 'title': { '$regex': req_data.search, '$options': 'i' } }, { 'isActive': true }] //, { 'jobStatus': 'Active' }]
                    }
                    var sort = {
                        'createdAt': -1
                    }
                }

                if (req_data.filter == 'Industry' && req_data.sortBy == 'commission') {
                    var obj = {
                        'industryId': req_data.industryId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
                if (req_data.filter == 'Sector' && req_data.sortBy == 'Most Recent') {
                    var obj = {
                        'sector': req_data.sectorId
                    }
                    var sort = {
                        'createdAt': -1
                    }
                }
                if (req_data.filter == 'Sector' && req_data.sortBy == 'commission') {
                    var obj = {
                        'sector': req_data.sectorId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
                if (req_data.filter == 'Region' && req_data.sortBy == 'Most Recent') {
                    var obj = {
                        'regionId': req_data.regionId
                    }
                    var sort = {
                        'createdAt': -1
                    }
                } if (req_data.filter == 'Region' && req_data.sortBy == 'commission') {
                    var obj = {
                        'regionId': req_data.regionId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
                if (req_data.filter == 'Product/Services' && req_data.sortBy == 'Most Recent') {
                    var obj = {
                        'productId': req_data.serviceId,

                    }
                    var sort = {
                        'createdAt': -1
                    }
                }
                if (req_data.filter == 'Product/Services' && req_data.sortBy == 'commission') {
                    var obj = {
                        'productId': req_data.serviceId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
                if (req_data.filter == 'Average Deal' && req_data.sortBy == 'Most Recent') {
                    if (req_data.min == '500+') {
                        var obj = {
                            'averagedeal': { $gte: 500 }
                        }
                        var sort = {
                            'createdAt': -1
                        }
                    } else if (req_data.min != undefined && req_data.max != undefined) {
                        var obj = {
                            'averagedeal': { $gte: parseInt(req_data.min), $lte: parseInt(req_data.max) }
                        }
                        var sort = {
                            'createdAt': -1
                        }
                    } else {
                        var obj = {
                            'averagedeal': {}
                        }
                        var sort = {
                            'createdAt': -1
                        }
                    }
                    var chck = await averageDealModel.find(obj)
                    for (var i = 0; i < chck.length; i++) {
                        arr.push(chck[i]._id)
                    }
                }
                if (req_data.filter == 'Average Deal' && req_data.sortBy == 'commission') {
                    if (req_data.min == '500+') {
                        var obj = {
                            'averagedeal': { $gte: '1000' }
                        }
                        var sort = {
                            'comissionPercentage': -1
                        }
                    } else if (req_data.min != undefined && req_data.max != undefined) {
                        var obj = {
                            'averagedeal': { $gte: parseInt(req_data.min), $lte: parseInt(req_data.max) }
                        }
                        var sort = {
                            'comissionPercentage': -1
                        }
                    } else {
                        var obj = {
                            'avgDealValue': {}
                        }
                        var sort = {
                            'comissionPercentage': -1
                        }
                    }
                    var chck = await averageDealModel.find(obj)
                    for (var i = 0; i < chck.length; i++) {
                        arr.push(chck[i]._id)
                    }
                }
                if (req_data.filter == 'Years of experience' && req_data.sortBy == 'Most Recent') {
                    var obj = {
                        'experience': req_data.experienceId
                    }
                    var sort = {
                        'createdAt': -1
                    }
                }
                if (req_data.filter == 'Years of experience' && req_data.sortBy == 'commission') {
                    var obj = {
                        'experience': req_data.experienceId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
                if (req_data.filter == 'language of the oppurtunity' && req_data.sortBy == 'Most Recent') {
                    var obj = {
                        'language': req_data.languageId
                    }
                    var sort = {
                        'createdAt': -1
                    }
                }
                if (req_data.filter == 'language of the oppurtunity' && req_data.sortBy == 'commission') {
                    var obj = {
                        'language': req_data.languageId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
            }
            if (req_data.filter != null) {
                if (req_data.filter == 'Industry') {
                    var obj = {
                        'industryId': req_data.industryId
                    }
                }
                if (req_data.filter == 'Sector') {
                    var obj = {
                        'sector': req_data.sectorId
                    }
                }
                if (req_data.filter == 'Region') {
                    var obj = {
                        'regionId': req_data.regionId
                    }
                }
                if (req_data.filter == 'Product/Services') {
                    var obj = {
                        'productId': req_data.productId
                    }
                }

                if (req_data.filter == 'Average Deal') {
                    if (req_data.min == '500+') {
                        var obj = {
                            'averagedeal': { $gte: 500 }
                        }
                    } else if (req_data.min != undefined && req_data.max != undefined) {
                        var obj = {
                            'averagedeal': { $gte: parseInt(req_data.min), $lte: parseInt(req_data.max) }
                        }
                    } else {
                        var obj = {
                            'averagedeal': {}
                        }
                    }
                }
                if (req_data.filter == 'Years of experience') {
                    var obj = {
                        'experience': req_data.experienceId
                    }
                }
                if (req_data.filter == 'language of the oppurtunity') {
                    var obj = {
                        'language': req_data.languageId
                    }
                }
            }
                if (req_data.sortBy != null) {
                    if (req_data.sortBy == 'Most Recent') {
                        var sort = {
                            'createdAt': -1
                        }
                    }
                    if (req_data.sorBy == 'commission') {
                        var sort = {
                            'comissionPercentage': -1
                        }
                    }
                }
                if(req_data.search && req_data.search !=null){
                    var obj ={
                     $or: [{ 'tittle': { '$regex': req_data.search, '$options': 'i' } }, { 'isActive': true }]
    
                }
            }
                if (req_data.filter == 'Average Deal') {
                    var usr = await salesModel.aggregate(
                        [
                            { $match: { 'avgDealValue': { $in: arr } } },
                            { $sort: sort },
                            { $skip: perPage * (pageNo - 1) },
                            { $limit: perPage }

                        ]
                    );
                    for(var i=0;i<usr.length;i++){
                        var apply = await offerModel.findOne({'salesId':usr[i]._id,'seekerId':userId,'isApplied':true});
                        if(apply ==null){
                            var applied = false
                        }else{
                            var applied = true
                        }
                        var fav = await favoriteModel.findOne({'salesId':usr[i]._id,'seekerId':userId,'isFavorite':true});
                        if(fav == null){
                            var favsale = false
                        }else{
                            var favsale = true
                        }

                        var apply_data ={
                            'userDetail':usr[i],
                            'isApplied':applied,
                            'isFavorite':favsale,
                            'seekerDetail':seekr
                        }
                        ary.push(apply_data)
                    }
                    return res.json({ code: codes.success, message: messages.success, result: ary,totalPages:usr.length })
                } else {
                    var totlPage = await salesModel.countDocuments(obj);
                    var usr = await salesModel.find(obj).sort(sort).populate([{path:'language'},{path:'industry'},{path:'productId'},{path:'industryId'}]).skip(perPage * (pageNo - 1)).limit(perPage);
                    for(var i=0;i<usr.length;i++){
                        var apply = await offerModel.findOne({'salesId':usr[i]._id,'seekerId':userId,'isApplied':true})
                        if(apply ==null){
                            var applied = false
                        }else{  
                            var applied = true
                        }
                        var fav = await favoriteModel.findOne({'salesId':usr[i]._id,'seekerId':userId,'isFavorite':true});
                       if(fav==null){
                           var favsale = false
                       }else{
                           var favsale = true
                       }
                        var apply_data ={
                            'userDetail':usr[i],
                            'isApplied':applied,
                            'isFavorite':favsale,
                            'seekerDetail':seekr
                        }
                        ary.push(apply_data)
                    }
                    if (usr && usr.length) {
                        return res.json({ code: codes.success, message: messages.success, result: ary,totalPages:totlPage })
                    } else {
                        return res.json({ code: codes.badRequest, message: messages.notFound })
                    }
                }
           // }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async viewProfileForBusinessSection(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var chck = await offerModel.findOne({'seekerId':req.body.seekerId,'salesId':req.body.salesId,'businessId':userId,'sendOfferLetter':true})
            var interest = await InterestModel.findOne({'seekerId':req.body.seekerId,'salesId':req.body.salesId});
            if(interest){
                var notInterested = true
            }else{
                var notInterested = false
            }
            if(chck && chck.length !=0){
                var hired = true
            }else{
                var hired = false

            }//,{ path: 'regionId',match: { _id: { $ne: null }}}
            var usr = await seekerModel.findOne({ '_id': req.body.seekerId, 'isActive': true }, { 'password': 0 }).populate([{ path: 'language.proficiency' },{ path: 'language.language' }, { path: 'experinceRequired',match: { _id: { $ne: null }}},{ path: 'industryNetwork',match: { _id: { $ne: null }}},
            { path: 'serviceNetwork',match: { _id: { $ne: null }}},{ path: 'sizeNetwork',match: { _id: { $ne: null }}},{ path: 'function',match: { _id: { $ne: null }}},{ path: 'seniority',match: { _id: { $ne: null }}},
            { path: 'avgDeal',match: { _id: { $ne: null }}},{ path: 'experience',match: { _id: { $ne: null }}},{ path: 'highestDegree',match: { _id: { $ne: null }}},
            { path: 'sector',match: { _id: { $ne: null }}},{ path: 'sellingPreferred',match: { _id: { $ne: null }}},{ path: 'service',match: { _id: { $ne: null }}},{ path: 'regionNetwork',match: { _id: { $ne: null }}}])
            if (usr) {
                return res.json({ code: codes.success, message: messages.success, result: usr,ishired:hired,isInterested:notInterested })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: message.messages.serverError })
        }
    }


    async addTrainingAndBlogs(req,res){
        try{
           var messages = message.messages(req.header('language'));
           var userId = req.obj.result.userId;
           var perPage = req.body.perPage ? req.body.perPage : 10
           var pageNo = req.body.pageNo ? req.body.pageNo : 1
           if(req.body.sortBy =='Latest'){
           var chck = await offerModel.find({'seekerId':userId,'isApplied':true,'sendOfferLetter':true,'offerAccept':false}).sort({'sendOfferLetterDate':-1}).populate([{path:'salesId'}]).skip(perPage * (pageNo - 1)).limit(perPage);
           }else{
            var chck = await offerModel.find({'seekerId':userId,'isApplied':true,'sendOfferLetter':true,'offerAccept':false}).populate([{path:'salesId'}]).skip(perPage * (pageNo - 1)).limit(perPage);
           }
           if(chck && chck.length){
               return res.json({code:codes.success,message:messages.success,result:chck})
           }else{
               return res.json({code:codes.notFound,message:messages.notFound})
           }
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:messages.serverError})
        }
    }

    async getMessageForSeekerDashboardInbox(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var userId = req.obj.result.userId;
            var arr=[];
            if (!userId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var count = 0
                var data  = await roomModel.find({'seekerId':userId}).sort({'createdAt':-1}).populate([{path:'businessId',select:'companyName firstName'},{path:'seekerId',select:'firstName lastName'},{path:'seekerId',populate:{path:'experience'}}]).skip(perPage * (pageNo - 1)).limit(perPage);  
                var count  = await roomModel.countDocuments({'seekerId':userId})
           
            if (data && data.length) {
                for(var i=0;i<data.length;i++){
                    var msg = await messageModel.find({'roomId':data[i].roomId}).sort({'createdAt':-1});
                      console.log(msg,"msg")
                    if(msg && msg.length){
                        var lastMsg = msg[0].message
                    // }else{
                    //     var lastMsg = null
                    // }
                    var obj_data ={
                        'lastMsg':lastMsg,
                        'data':data[i]
                    }
                    arr.push(obj_data)
                }
                }
                return res.json({ code: codes.success, message: messages.success, result: arr,Counts:arr.length });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    //////////Admin Api's/////////

    async seekerListingForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var pageNo = req.body.pageNo ? req.body.pageNo : 1
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var arr = []
            if (req.body.search && req.body.filter && req.body.fromDate && req.body.toDate) {
                if(req.body.filter == 'HiredBy'){
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                    'isHired': true,
                    $or: [{ 'email': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]

                }
            }else{
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                    'profileStatusPercentage':{$gte:0,$lte:99},
                    $or: [{ 'email': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]

                }
            }
            } else if (req.body.fromDate && req.body.toDate && req.body.search) {
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                    $or: [{ 'email': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                }
            } else if (req.body.fromDate && req.body.toDate && req.body.filter) {
                if(req.body.filter == 'HiredBy'){
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                    'isHired': true,
                }
            }else{
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                    'profileStatusPercentage':{$gte:0,$lte:99},
                }
            }
            } else if (req.body.search && req.body.filter) {
                if(req.body.filter == 'HiredBy'){
                var obj = {
                    'isHired': true,
                    $or: [{ 'email': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                }
            }else{
                var obj = {
                    'profileStatusPercentage':{$gte:0,$lte:99},
                    $or: [{ 'email': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                }
            }
            } else if (req.body.fromDate && req.body.toDate) {
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate }
                }
            } else if (req.body.filter == 'HiredBy') {
                var obj = {
                    'isHired': true
                }
            } else if (req.body.filter == 'IncompleteProfile') {
                var obj = {
                    'profileStatusPercentage':{$gte:0,$lte:99}
                }
            } else if (req.body.search) {
                var obj = {
                    $or: [{ 'email': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                }
            } else {
                var obj = {}
            }
            var count = await seekerModel.countDocuments(obj)
            var chck = await seekerModel.find(obj).skip(perPage * (pageNo - 1)).limit(perPage);
            if (chck && chck.length) {
                for (var i = 0; i < chck.length; i++) {
                    var counting = 0;
                    var offr = await offerModel.countDocuments({ 'seekerId': chck[i]._id, 'sendOfferLetter': true })
                    var apply = await offerModel.countDocuments({ 'seekerId': chck[i]._id, 'isApplied': true })
                    var invite = await offerModel.countDocuments({ 'seekerId': chck[i]._id, 'isApplied': true })
                    var complete = await offerModel.find({'seekerId':chck[i]._id,'offerAccept':true}).populate([{path:'businessId',select:'firstName'}]).sort({'acceptDate':-1})
                    if(complete && complete.length){
                       var worksWith = complete[0].businessId.firstName
                    }else{
                        var worksWith = 'notJoined'
                    }
                    for(var j =0; j<complete.length;j++){
                        var cmplteJob = await salesModel.findOne({'_id':complete[j].salesId,'jobStatus':'Closed'})
                        if(cmplteJob !={}){
                            var counting =counting + 1
                        }
                     }
                    var obj_data = {
                        '_id': chck[i]._id,
                        'firstName': chck[i].firstName,
                        'lastName': chck[i].lastName,
                        'workingWith':worksWith,
                        'email': chck[i].email,
                        'phone': chck[i].phone,
                        'profileStatusPercentage':chck[i].profileStatusPercentage,
                        'avgRating': chck[i].avgRating,
                        'isActive': chck[i].isActive,
                        'avgRating':chck[i].avgRating,
                        'offr': offr,
                        'apply': apply,
                        'invite': invite,
                        'completeJob':counting,
                        'createdAt': chck[i].createdAt
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


    async updateStatusForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.status || !req_data.seekerId) {
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
            var chck = await seekerModel.findOne({ '_id': req_data.seekerId })
            if (chck) {
                var updte = await seekerModel.updateOne({ '_id': req_data.seekerId }, { $set: obj_data })
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async seekerCSV(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var arr = [];
            let seeker = await seekerModel.find({}).populate([{path:'sector'}]).sort({ 'createdAt': -1 })
            if (seeker) {
                for (var i = 0; i < seeker.length; i++) {
                   
                    var createDte = moment(seeker[i].createdAt).format()
                    var dte2 = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                    var createtym = moment(seeker[i].createdAt).format('hh:mm a')
                    if(seeker[i].sector){
                        var sector = seeker[i].sector.name
                    }else{
                        var sector = null
                    }
                    var seekerdetail = {
                    'firstName': seeker[i].firstName ,
                    'lastName': seeker[i].lastName ,
                    'countryCode':seeker[i].countryCode,
                    'phone':seeker[i].phone,
                    'email' : seeker[i].email,
                    'industry': seeker[i].industry ,
                    'sector': sector ,
                    'websiteUrl': seeker[i].webUrl ,
                    'status':seeker[i].isActive,
                    'linkedInUrl': seeker[i].linkedinUrl ,
                    'blogUrl': seeker[i].blogUrl ,
                    'createdAt':dte2
                    }
                    arr.push(seekerdetail)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }


    async viewProfilSeekerForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            
            var usr = await seekerModel.findOne({ '_id': req.body.seekerId, 'isActive': true }, { 'password': 0 })
            if (usr) {
                if(usr.isActive == true){
                    var status = 'Active'
                }else{
                    var status = 'Deactive'
                }
                var createDte = moment(usr.createdAt).format()
                var dte = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                    var obj = {
                        'firstName':usr.firstName,
                        'email':usr.email,
                        'profileStatusPercentage':usr.profileStatusPercentage,
                        'isActive':status,
                        'createdAt':dte,
                        'country':usr.country,
                        'phone':usr.phone,
                        'image':usr.image
                    }

                return res.json({ code: codes.success, message: messages.success, result: obj })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: message.messages.serverError })
        }
    }

    async ListingForSeekerView(req,res){
        try{
            var messages = message.messages(req.header('language'))
            var pageNo = req.body.pageNo ? req.body.pageNo : 1
            var perPage = req.body.perPage ? req.body.perPage : 10
            var userId = req.obj.result.userId;
            var arr =[]
            var offr = await offerModel.find({'seekerId':req.body.seekerId,'sendOfferLetter':true}).populate([{path:'businessId',select:'firstName email businessNumber avgRating'},{path:'salesId',select:'tittle totalProposal'}])
            var invite = await offerModel.find({'seekerId':req.body.seekerId,'invited':true}).populate([{path:'businessId',select:'firstName email businessNumber avgRating'},{path:'salesId',select:'tittle totalProposal'}])
            var apply = await offerModel.find({'seekerId':req.body.seekerId,'isApplied':true}).populate([{path:'businessId',select:'firstName email businessNumber avgRating'},{path:'salesId',select:'tittle totalProposal'}])
            var chck = await offerModel.find({'seekerId':req.body.seekerId,'offerAccept':true})//.populate([{path:'businessId',select:'firstName email businessNumber avgRating'}])
                 for(var i =0 ;i<chck.length;i++){
                     var complete_data = await salesModel.findOne({'_id':chck[i].salesId,'jobStatus':'Complete'}).populate({path:'businessId',select:'firstName email businessNumber avgRating'})
                     arr.push(complete_data)
                 }           
            return res.json({code:codes.success,message:messages.success,offer:offr,Invited:invite,Applied:apply,Complete:arr})
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:messages.serverError})
        }
    }
   

  async seekerCountForAdmin(req,res){
       try{
        var messages = message.messages(req.header('language'));
        var userId = req.obj.result.userId;
        var activeAgent = await seekerModel.countDocuments({'isActive':true});
        var inactiveAgent = await seekerModel.countDocuments({'isActive':false});
        var totlAgent = await seekerModel.countDocuments({});
          var obj_data ={
              'totlActiveAgent':activeAgent,
              'totlDeactiveAgent':inactiveAgent,
              'totlAgent':totlAgent
          }
        return res.json({'code':codes.success,message:messages.success,result:obj_data})       
 
       }catch(error){
           return res.json({code:codes.serverError,message:message.messages.serverError})
       }
  }

   async deleteSeekerAccount(req,res){
       try{
           var messages = message.messages(req.header('language'));
           var userId = req.obj.result.userId;
           if(!userId){
               return res.json({code:codes.badRequest,message:messages.BadRequest})
           }else{
               var usr = await Promise.all([
                    seekerModel.deleteOne({'_id':userId}),
                    RatingModel.deleteMany({'seekerId':userId}),
                    offerModel.deleteMany({'seekerId':userId}),
                    notificationModel.deleteMany({'seekerId':userId}),
                    favoriteModel.deleteMany({'seekerId':userId}),
                    roomModel.deleteMany({'seekerId':userId})
               ])
               return res.json({code:codes.success,message:messages.success})
           }
       }catch(error){
           console.log(error)
           return res.json({code:codes.serverError,message:messages.serverError})
       }
   }

}


module.exports = seekerService;