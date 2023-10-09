var categoryModel = require('../models/category');
var message = require('../codes/messages');
var codes = require('../codes/codes');
var moment = require('moment-timezone');
const offerModel = require('../models/offerApply');

class categoryService{
     async addcategory(req,res){
         try{
             var messages = message.messages(req.header('timezone'));
             var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
             var adminId = req.obj.result.userId;
             var req_data = req.body;
             if(!adminId || !req_data.categoryName){
                 return res.json({code:codes.badRequest,message:messages.BadRequest})
             }
             var obj_data = {
                 'categoryName':req_data.categoryName,
                 'createdAt' : moment().tz(timeZone).format()
             }
             var save = await new categoryModel(obj_data).save();
             return res.json({code:codes.success,message:messages.success,result:save})
         }catch(error){
             console.log(error)
             return res.json({code:codes.serverError,message:messages.serverError})
         }
     }

     async editCategory(req,res){
         try{
             var messages = message.messages(req.header('language'));
             var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
             var adminId = req.obj.result.userId;
             var req_data = req.body;
             if(!adminId || !req_data.categoryId){
                 return res.json({code:codes.badRequest,message:messages.BadRequest})
             }
             var save = await categoryModel.findOne({'_id':req_data.categoryId})
             if(save){
             var obj_data = {
                 'categoryName':req_data.categoryName ? req_data.categoryName : save.categoryName,
                 'updatedAt'  : moment().tz(timeZone).format()
             }    
             var updte = await categoryModel.updateOne({'_id':save._id},{$set:obj_data}) 
                return res.json({code:codes.success,message:messages.success})  
             }else{
                return res.json({code:codes.badRequest,messsage:messages.notFound})
            }
         }catch(error){
             console.log(error)
             return res.json({code:codes.serverError,message:messages.serverError})
         }
     }

     async allCategoryList(req,res){
         try{
              var messages = message.messages(req.header('language'));
              var adminId = req.obj.result.userId;
              var req_data = req.body;
              var perPage = req_data.perPage ? req_data.perPage : 10
              var pageNo = req_data.pageNo  ? req_data.pageNo : 1
              var chck = await categoryModel.find({'isActive':true}).skip(perPage * (pageNo-1)).limit(perPage)
              if(chck && chck.length){
                  return res.json({code:codes.success,message:messages.success,result:chck})
              }else{
                return res.json({code:codes.badRequest,message:messages.notFound})
              }
         }catch(error){
             console.log(error)
             return res.json({code:codes.serverError,message:messages.serverError})
         }
     }

     
     async viewCategoryDetail(req,res){
         try{
             var messages = message.messages(req.header('language'));
             var adminId = req.obj.result.userId;
             var req_data = req.body;
             if(!adminId || !req_data.categoryId){
                 return res.json({code:codes.badRequest,message:messages.BadRequest})
             }
            var chck = await categoryModel.findOne({'_id':req_data.categoryId})
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
module.exports = categoryService;