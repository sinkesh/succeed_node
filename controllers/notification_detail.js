var notificationModel = require('../models/chat').notificationModel;
var message = require('../codes/messages');
var codes = require('../codes/codes');
var methods = require('../methods/methods');
const seekerModel = require('../models/seekers');
var moment = require('moment');
// const business = require('../models/business');
// const  = require('../models/seekers');
class notification_detail{
         async all_notification(req,res){
             try{
                 var messages = message.messages(req.header('language'));
                 var userId = req.obj.result.userId;
                 var type = req.body.type;
                 var pageNo = req.body.pageNo ? req.body.pageNo : 1
                 var perPage = req.body.perPage ? req.body.perPage : 10;
                 if(type=='Business'){
                    var obj_data={
                     'sentTo':'business',
                     'businessId':userId
                     }
                 }else{
                   var obj_data ={
                       'sentTo':'seeker',
                       'seekerId':userId
                   }
                 }
                 var total = await notificationModel.countDocuments(obj_data);
                 var all_data = await notificationModel.find(obj_data).sort({'createdAt':-1}).skip(perPage * (pageNo - 1)).limit(perPage);
                  var updte = await notificationModel.updateMany(obj_data,{$set:{'readStatus':true}});
                 if(all_data && all_data.length){
                     return res.json({code:codes.success,message:messages.success,result:all_data,Total:total})
                 }else{
                     return res.json({code:codes.badRequest,message:messages.notFound})
                 }
   
             }catch(error){ 
                 console.log(error);
                 return res.json({code:codes.serverError,message:messages.serverError})
             }
         }

         async notificationCount(req,res){
            try{
                var messages = message.messages(req.header('language'));
                var userId = req.obj.result.userId;
                if (!userId) {
                    return res.json({ code: codes.badRequest, message: messages.BadRequest });
                }
              
                if(req.body.type=='Business'){
                    var obj_data ={
                    'businessId':userId,
                    'sentTo':'business',
                    'readStatus':false
                    }
                }else{                    
                    var obj_data ={
                        'seekerId':userId,
                        'sentTo':'seeker',
                        'readStatus':false
                        }
                }
                var msg = await notificationModel.countDocuments(obj_data);
                return res.json({code:codes.success,message:messages.success,result:msg})
            }catch(error){
                return res.json({code:codes.serverError,message:message.messages.serverError})
            }
        }
}
module.exports = notification_detail;