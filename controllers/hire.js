var hireModel = require('../models/hire');
var sessionModel = require('../models/business').sessionModel;
var offerModel = require('../models/offerApply');
var businessModel = require('../models/business').businessModel;
var message = require('../codes/messages');
var codes = require('../codes/codes');
var methods = require('../methods/methods');
var moment = require('moment');

class hiring{
       async addHiringDetail(req,res){
           try{
              var messages = message.messages(req.header('language'));
              var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
              var userId = req.obj.result.userId;
              var req_data = req.body;
              var usr = await businessModel.findOne({'_id':userId})
              if(usr){
                   var obj_data = {
                       'tittle':req_data.tittle,
                       'paymentOption':req_data.paymentOption,
                       'totalAmount':req_data.totalAmount,
                       'workDetail' : req_data.workDetail,
                       'policy':req_data.policy,
                       'createdAt':moment().tz(timeZone).format()
                   }
                   var save = await new hireModel(obj_data).save();
                   return res.json({code:codes.success,message:messages.success,result:save})
              }else{
                  return res.json({code:codes.badRequest,message:messages.notFound})
              }
           }catch(error){
               console.log(error)
               return res.json({code:codes.serverError,message:messages.serverError})
           }
       }

       async editHiringDetail(req,res){
           try{
               var messages = message.messages(req.header('language'));
               var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
               var userId = req.obj.result.userId;
               var req_data = req.body;
               if(!userId || !req_data.hiringId){
                   return res.json({code:codes.badRequest,message:messages.BadRequest})
               }
               var chck = await hireModel({'_id':req_data.hiringId,'isActive':true})
               if(chck){
                   var obj_data = {
                       'tittle':req_data.tittle ? req_data.tittle : chck.tittle,
                       'paymentOption':req_data.paymentOption ? req_data.paymentOption : chck.paymentOption,
                       'totalAmount' : req_data.totalAmount ? req_data.totalAmount : chck.totalAmount,
                       'workDetail' : req_data.workDetail ? req_data.workDetail : chck.workDetail,
                       'updatedAt' : moment().tz(timeZone).format()
                   }
                   var updte = await hireModel.updateOne({'_id':chck._id},{$set:obj_data})
                   return res.json({code:codes.success,message:messages.success})
               }else{
                   return res.json({code:codes.badRequest,message:messages.BadRequest})
               }
            }catch(error){
               console.log(error)
               return res.json({code:codes.serverError,message:messages.serverError})
           }
       }

       async showHireDetail(req,res){
           try{
               var messages = message.messages(req.header('language'));
               var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
               var userId = req.obj.result.userId;
               var req_data = req.body;
               if(!userId || !req_data.hiringId){
                   return res.json({code:codes.badRequest,message:messages.BadRequest})
               }
               var chck = await hireModel.findOne({'_id':req_data.hiringId,'isActive':true})
               if(chck){
                return res.json({code:codes.success,message:messages.success,result:chck})
               }else{
                   return res.json({code:codes.badRequest,message:messages.notFound})
               }
           }catch(error){
               console.log(error)
             return res.json({code:codes.serverError,message:messages.serverError})
           }
       }
     
}
module.exports = hiring;    