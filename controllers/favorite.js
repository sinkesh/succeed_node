var favoriteModel = require('../models/favorite');
var businessModel = require('../models/business').businessModel;
var seekerModel = require('../models/seekers');

var message = require('../codes/messages');
var codes = require('../codes/codes');
var moment = require('moment-timezone');
const { salesModel } = require('../models/salesOpportunity');
const offerModel = require('../models/offerApply');


class favorite {
    async addFavorite(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var userId = req.obj.result.userId;
            var seeker = await seekerModel.findOne({ '_id': userId, 'isActive': true })
            if (seeker) {
                var fav = await favoriteModel.findOne({'seekerId':seeker._id, 'businessId':req_data.businessId,'salesId':req_data.salesId, 'isFavorite': true })
                if (fav) {
                    var obj = {
                        'isFavorite': false,
                        'updatedAt': moment().tz(timeZone).format()
                    }
                    var fav = await favoriteModel.updateOne({'_id':fav._id},{$set:obj});
                    var chck = await favoriteModel.findOne({'_id':fav._id});
                    return res.json({code:codes.success,message:messages.success,result:chck});
                }else{
                  var obj_data = {
                    'seekerId': seeker._id,
                    'businessId': req_data.businessId,
                    'salesId': req_data.salesId,
                    'isFavorite': true,
                    'createdAt': moment().tz(timeZone).format()
                }
 
                var save = await favoriteModel(obj_data).save();
        
                return res.json({ code: codes.success, message: messages.success, result: save })
            }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async favoriteDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var userId = req.obj.result.userId;
            if (!userId || !req_data.favoriteId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var fav = await favoriteModel.findOne({ '_id': req_data.favoriteId, 'isActive': true })
            if (fav) {
                return res.json({ code: codes.success, message: messages.success, result: fav })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: message.messages.serverError })
        }
    }
    

    async updateFavorite(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var userId = req.obj.result.userId;
            if (!userId || !req_data.favoriteId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var seeker = await seekerModel.findOne({ '_id': userId, 'isActive': true })
            if (seeker) {
                var fav = await favoriteModel.findOne({ '_id': req_data.favoriteId, 'isFavorite': true })
                if (fav) {
                    var obj = {
                        'isFavorite': false,
                        'updatedAt': moment().tz(timeZone).format()
                    }
                } else {
                    var obj = {
                        'isFavorite': true,
                        'updatedAt': moment().tz(timeZone).format()
                    }

                }
                var updte = await favoriteModel.updateOne({ '_id': req_data.favoriteId }, { $set: obj })
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async AllFavoriteJobBySeeker(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var userId = req.obj.result.userId;
            var arr = [];
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            if (req_data.search && req_data.search != null) {
                var obj_data = {
                    $and: [{ 'tittle': { '$regex': req_data.search, '$options': 'i' } }, { 'isDelete': false }] //, { 'jobStatus': 'Active' }]
                }
            var chck = await salesModel.find(obj_data).sort({'createdAt':-1}).skip(perPage * (pageNo - 1)).limit(perPage);
            for(var i=0;i<chck.length;i++){
             var favite = await favoriteModel.findOne({'salesId':chck[i]._id,'isFavorite': true,'seekerId':userId}).sort({'createdAt':-1}).populate([{ path: 'businessId', select: '_id firstName email' }, { path: 'seekerId' },{path:'salesId'},{path:'salesId',populate:{path:'language'}},{path:'salesId',populate:{path:'industryId'}},{path:'salesId',populate:{path:'productId'}},,{path:'salesId',populate:{path:'experinceRequired'}}]);
             var offer = await offerModel.findOne({'salesId':chck[i]._id,'seekerId':userId,'isApplied':true});
             if(offer==null){
                  var applied = false
              }else{
                  var applied = true
              }
             var obj ={
                  'fav':favite,
                  'isApplied':applied
              }
             arr.push(obj);
            }
            return res.json({code:codes.success,message:messages.success,result:arr})
        }else{
            var totlPage = await favoriteModel.countDocuments({ 'isActive': true, 'isFavorite': true,"seekerId":userId });
           var fav = await favoriteModel.find({ 'isActive': true, 'isFavorite': true,"seekerId":userId }).sort({'createdAt':-1}).skip(perPage * (pageNo - 1)).limit(perPage);
           for(var i=0;i<fav.length;i++){
            var favrite = await favoriteModel.findOne({'_id':fav[i]._id }).populate([{ path: 'businessId', select: '_id firstName email' }, { path: 'seekerId' ,select:'_id firstName lastName image'},{path:'salesId'},{path:'salesId',populate:{path:'language'}},{path:'salesId',populate:{path:'industryId'}},{path:'salesId',populate:{path:'productId'}},,{path:'salesId',populate:{path:'experinceRequired'}}]);//.skip(perPage * (pageNo - 1)).limit(perPage);
         
            var offer = await offerModel.findOne({'salesId':fav[i].salesId,'seekerId':userId,'isApplied':true});

            if(offer==null){
                var applied = false
            }else{
                var applied = true
            }
            var obj ={
                'fav':favrite,
                'isApplied':applied
            }
            arr.push(obj)
           }
           if (fav && fav.length) {
                return res.json({ code: codes.success, message: messages.success, result: arr,totalpages:totlPage })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: message.messages.serverError })
        }
    }
}
module.exports = favorite;