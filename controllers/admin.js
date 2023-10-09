var adminModel = require('../models/admin');
var sessionModel = require('../models/business').sessionModel;
var seekerModel = require('../models/seekers');
var salesModel = require('../models/salesOpportunity').salesModel;
var businessModel = require('../models/business').businessModel;
var offerModel = require('../models/offerApply');
var RatingModel = require('../models/rating');
var busSubScriptionModel = require('../models/subscription').busSubScriptionModel;
var messageModel = require('../models/chat').messageModel;

var message = require('../codes/messages');
var codes = require('../codes/codes');
var methods = require('../methods/methods');
var moment = require('moment');

class adminService{
     async addAdmin(req,res){
         try{
             var messages = message.messages(req.header('language'));
             var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
             var req_data = req.body;
             if(!req_data.phone || !req_data.password || !req_data.name){
                 return res.json({code:codes.badRequest,message:messages.BadRequest})
             }
             var token = methods.authToken();
            var usr = await adminModel.findOne({'email':req_data.email})
            if(usr){
                return res.json({code:codes.alreadyExists,message:messages.AlreadyExists})
            }else{
                var obj_data ={
                    'name':req_data.name,
                    'phone':req_data.phone,
                    'email':req_data.email,
                    'password':methods.password_auth(req_data.password),
                    'createdAt':moment().tz(timeZone).format()
                }
                var save = await new adminModel(obj_data).save();
                 if(save){
                    var obj ={
                        '_id' : save._id,
                        'name':save.name,
                        'phone':save.phone,
                        'email':save.email,
                        'token':token,
                        'password':methods.password_auth(req_data.password),
                        'createdAt':moment().tz(timeZone).format()
                    }
                 }else{
                     return res.json({code:codes.badRequest,message:messages.somethingWrong})
                 }
               var chck =  await new sessionModel({'userId':save._id,'token':token,'type':'admin','createdAt':moment().tz(timeZone).format()}).save();
                return res.json({code:codes.success,message:messages.success,result:obj})
            }
         }catch(error){
             console.log(error);
             return res.json({code:codes.serverError,message:messages.serverError})

         }
     }
     async adminLogin(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var req_data = req.body;
            if (!req_data.email || !req_data.password) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var token = methods.authToken();
            var admin = await adminModel.findOne({ 'email': req_data.email });
            if (admin) {
                if (admin.isActive === false) {
                    return res.json({ code: codes.badRequest, message: 'Your account has been deactvated by Admin' });
                }
                var password_status = methods.compare_pass({ 'password': req_data.password, 'user_pass': admin.password });
                if (admin.otp === req_data.password) {
                    var password_status = true;
                }
                if (password_status == false) {
                    return res.json({ code: codes.badRequest, message: messages.invalidPass });
                } else {
                    var sessionData = {
                        'userId': admin._id,
                        'token': token
                    }
                    await sessionModel.deleteOne({'userId':admin._id})
                    await new sessionModel(sessionData).save();
                    var data = {
                        "name": admin.name,
                        "email": admin.email,
                        "_id": admin._id,
                        "token": token
                    }
                    return res.json({ code: codes.success, message: messages.success, result: data });
                }
            } else {
                return res.json({ code: codes.invalidPhone, message: messages.notFound });
            }
        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }
    
    async logout(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var adminId = req.obj.result.userId;
            console.log(adminId)
            if (!adminId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var token = req.header('x-auth');
            var log = await sessionModel.deleteOne({ 'token': token });
            if (log) {
                return res.json({ code: codes.success, message: messages.logout });
            } else {
                return res.json({ code: codes.badRequest, message: messages.somethingWrong });
            }
        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

     async editAdmin(req,res){
         try{
             var messages = message.messages(req.header('language'));
             var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
             var adminId = req.obj.result.userId;
             var req_data = req.body;
             var usr = await adminModel.findOne({'_id':adminId,'isActive':true});
             if(usr){
               var obj_data = {
                   'name':req_data.name ? req_data.name : usr.name,
                   'phone':req_data.phone ? req_data.phone : usr.phone,
                   'email':req_data.email ? req_data.email : usr.email,
                   'updatedAt':moment().tz(timeZone).format()

               }
               await adminModel.updateOne({'_id':adminId},{$set:obj_data})
               return res.json({code:codes.success,message:messages.success})
             }else{
                 return res.json({code:codes.success,message:messages.notFound})
             }
         }catch(error){
             console.log(error)
             return res.json({code:codes.serverError,message:messages.serverError})
         }
     }

     async updatePassword(req,res){
         try{
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var usr = await adminModel.findOne({ '_id': adminId ,'isActive':true});
            if (usr) {
                var password_status = methods.compare_pass({ 'password': req_data.oldPassword, 'user_pass': usr.password });
                if (password_status == false) {
                    return res.json({ code: codes.badRequest, message: messages.invalidPass });
                } else {
                    var password = methods.password_auth(req_data.password);
                    await adminModel.updateOne({ '_id': adminId }, { $set: { 'password': password } });
                    return res.json({ code: codes.success, message: messages.success });
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notExists });
            }
         }catch(error){
             console.log(error)
             return res.json({code:codes.serverError,message:messages.serverError})
         }
     }

     async forgotpassword(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var adminId = req.obj.result.userId;
            var data = req.body;
            if (!data.email) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var uniqueId = uniqid();
            var password = methods.password_auth(uniqueId);
            var admin= await adminModel.updateOne({ 'email': data.email }, { $set: { 'password': password } });

            if (admin) {
                var mail = {
                    'subject': 'Sales-Succeed app forgot password',
                    'message': 'This is your Sales-Succeed app password : ' + uniqueId,
                    'html': '',
                    'email': data.email
                }
                methods.send_email(mail);
               return res.json({ code: codes.success, message: messages.forgotMail });
            } else {
                return res.json({ code: codes.badRequest, message: messages.somethingWrong });
            }
        } catch (error) {
            console.log(error.message);
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

    async deleteAdmin(req,res){
        try{
            var messages = message.messages(req.heaqder('language'));
            var adminId = req.obj.result.userId;
            var usr = await adminModel.findOne({'_id':adminId,'isActive':true})
            if(usr){
                var updte = await adminModel.updateOne({'_id':adminId},{$set:{'isActive':false}})
                return res.json({code:codes.success,message:messages.success})
            }else{
                return res,json({code:codes.badRequest,message:messages.notFound})
            }
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:messages.serverError})
        }
    }

    async allDashBoardCount(req,res){
        try{
            var messages  = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
                var date1 = moment(new Date()).subtract(1, 'months').tz(timeZone).format();
                var date2 = moment(new Date()).subtract(0, 'days').add(1, 'days').tz(timeZone).format();
                var d1 = moment(date1);
                var d2 = moment(date2); 
            var [seeker, business,totlApplication,feedback,totlJob,ongoingJob,closeJob,completeJob,totlSub,notSub, monthlyExpData,activeProposal,offerJob,ApplyJob,hiredAgent] = await Promise.all([
                seekerModel.countDocuments({'isActive':true}),
                businessModel.countDocuments({'isActive':true}),
                offerModel.countDocuments({'isApplied':true}),
                RatingModel.countDocuments({'isActive':true}),

                salesModel.countDocuments({}),
                salesModel.countDocuments({'jobStatus':'Ongoing'}),
                salesModel.countDocuments({'jobStatus':'Closed'}),
                salesModel.countDocuments({'jobStatus':'Completed'}),

                // profile incomplete 
                businessModel.countDocuments({'subscriptionTaken':true}),
                businessModel.countDocuments({'subscriptionTaken':false}),
                busSubScriptionModel.countDocuments({ 'durationDate': { $gte: new Date(d1.year(), d1.month(), d1.date()), $lt: new Date(d2.year(), d2.month(), d2.date()) } }),
              
                messageModel.countDocuments({}),
                offerModel.countDocuments({'sendOfferLetter':true}),
                offerModel.countDocuments({'isApplied':true}),
                offerModel.countDocuments({'offerAccept':true})
            ]);
            var obj_data = {
                'saleAgent':seeker,
                'business' : business,
                'totalApplication':totlApplication,
                'feedback' : feedback,
                'postedJob':totlJob,
                'ongoingJob':ongoingJob,
                'closedJob':closeJob,
                'completeJob':completeJob,
                'totalSubscription':totlSub,
                'notSubscription':notSub,
                'expSubscriptionMonthly':monthlyExpData,
                'activeProposal':activeProposal,
                'offeredJob':offerJob,
                'appliedJob':ApplyJob,
                'hiredAgent':hiredAgent

            }
            return res.json({code:codes.success,message:messages.success,result:obj_data})
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:messages.serverError})
        }
    }
}

module.exports = adminService;