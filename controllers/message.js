var methods = require('../methods/methods');
var messageModel = require('../models/chat').messageModel;
var roomModel = require('../models/chat').roomModel;
var businessModel = require('../models/business').businessModel;
var message = require('../codes/messages');
var codes = require('../codes/codes');
var moment = require('moment');
const seekerModel = require('../models/seekers');
class messageService {

    async getMessage(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 20;
            var userId = req.obj.result.userId;
            if (!userId || !req.body.roomId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var chck1 = await messageModel.find({'roomId':req.body.roomId,'salesId':req.body.salesId}).sort({'createdAt':-1});
            if(chck1 && chck1.length){
            var dte1 = moment(chck1[0].createdAt).add(1,'days').format()
            var dte2 = moment(chck1[0].createdAt).subtract(30,'days').format()

            let [data, chck] = await Promise.all([
                messageModel.find({ 'roomId': req.body.roomId,'salesId':req.body.salesId,'createdAt':{$gte : dte2,$lte:dte1}}).populate([{path:'salesId' ,select:'tittle'},{path:'seekerId', select:'firstName image'}]).sort({ 'createdAt': 1 }).skip(perPage * (pageNo - 1)).limit(perPage),
                messageModel.updateMany({ 'roomId': req.body.roomId }, { $set: { 'readStatus': true } })
            ]);
            var count = await messageModel.countDocuments({ 'roomId': req.body.roomId,'salesId':req.body.salesId,'createdAt':{$gte : dte2,$lte:dte1}});
             if(req.body.salesId && req.body.salesId !=''){
            var updte = await messageModel.updateMany({'salesId':req.body.salesId,'seekerId':req.body.seekerId},{$set:{'readStatus':true}});   
             }else{
                 var updte = await messageModel.updateMany({'roomId':req.body.roomId,'seekerId':req.body.seekerId},{$set:{'readStatus':true}});
             }
             return res.json({ code: codes.success, message: messages.success, result: data,totalPage:count });
            }else{
            var seek = await seekerModel.findOne({'_id':req.body.seekerId},{firstName:1,image:1});
            var seekr = await businessModel.findOne({'_id':req.body.seekerId},{firstName:1,image:1});
            if(seek&&seek!=null){
              var detail = seek
            }else{
                var detail = seekr

            }
            return res.json({ code: codes.badRequest, message:messages.BadRequest, result:detail });
        }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getUnreadMesssage(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            let count = await messageModel.aggregate([
                { $match: { $and: [{ 'businessId': req.body.businessId }, { 'readStatus': false }] } },
                {
                    $group: {
                        _id: '$roomId',
                        count: { $sum: 1 },
                    }
                },
            ]);
            console.log(count)
            return res.json({ code: codes.success, message: messages.success, result: count.length });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async archiveRoom(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            if (!userId || !req.body.roomId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            if(req.body.type=='Archive'){
                var obj = {
                    'status':'Archive',
                    'archivedDate': new Date()
                }
            }else{
                var obj = {
                    'status':'Active',
                    'archivedDate':new Date()
                }
            }
            let updt = await roomModel.updateOne({ 'roomId': req.body.roomId,'salesId':req.body.salesId }, { $set: obj });
            if (updt) {
                return res.json({ code: codes.success, message: messages.success });
            } else {
                return res.json({ code: codes.badRequest, message: messages.somethingWrong });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async archiveListingApi(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            if (!userId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let room = await roomModel.find({'salesId':req.body.salesId,'status':'Archive' }).sort({'archivedDate':-1}).populate([{path:'seekerId'},{path:'seekerId',populate:{path:'experience'}}]).skip(perPage * (pageNo - 1)).limit(perPage);
            if (room && room.length) {
              return res.json({ code: codes.success, message: messages.success,result:room });
            } else {
                return res.json({ code: codes.success, message: messages.success,result:[] });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async checkRoom(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            
            if (!userId || !req.body.businessId || !req.body.seekerId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let room = await roomModel.findOne({ 'businessId': req.body.businessId,'seekerId':req.body.seekerId,'salesId':req.body.salesId });
            if (room) {
              return res.json({ code: codes.success, message: messages.success,result:room });
            } else {
                return res.json({ code: codes.success, message: messages.success,result:null });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getChats(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var Id = req.obj.result.userId;
            var type = req.body.type;
            var arr=[]
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            if (!Id || !type) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            
            var req_data = { 'businessId': Id };
            if (type == 'seeker') {
                req_data = { 'seekerId': Id };
            }

            let rooms = await roomModel.find(req_data).sort({'createdAt':-1}).populate([{ path: 'seekerId', select: '_id firstName lastName image' }, { path: 'businessId', select: '_id firstName lastName image' },{path:'salesId',select:'tittle'}]).skip(perPage * (pageNo - 1)).limit(perPage);
            if (rooms && rooms.length) {
                for(var i=0;i<rooms.length;i++){
                    var msg = await messageModel.find({'roomId':rooms[i].roomId}).sort({'createdAt':-1})
                    if(msg && msg.length){
                        var lastMsg = msg[0].message
                    // }else{
                    //     var lastMsg = null
                    // }
                var obj ={
                    'seekerId':rooms[i].seekerId,
                    'msg':lastMsg,
                    'businessId':rooms[i].businessId,
                    'salesId':rooms[i].salesId

                }
                arr.push(obj)
            }
            }
                return res.json({ code: codes.success, message: messages.success, result: arr });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getMessageForBusinessScreen(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var userId = req.obj.result.userId;
            var arr =[];
            if (!userId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var count = 0
            if(req.body.salesId !=null){
            var data  = await roomModel.find({'salesId':req.body.salesId,'status':{$ne:'Archive'}}).sort({'createdAt':-1}).populate([{path:'seekerId',select:'firstName lastName email'},{path:'seekerId',populate:{path:'experience'}},{path:'seekerId',populate:{path:'language.language'}}]).skip(perPage * (pageNo - 1)).limit(perPage);  
        }else{
                var data  = await roomModel.find({'businessId':userId}).sort({'createdAt':-1}).populate([{path:'seekerId',select:'firstName lastName email'},{path:'seekerId',populate:{path:'experience'}},{path:'seekerId',populate:{path:'language.language'}}]).skip(perPage * (pageNo - 1)).limit(perPage);  
                var count  = await roomModel.countDocuments({'businessId':userId})
            }

            if (data && data.length) {
                for(var i=0;i<data.length;i++){
                    var msg = await messageModel.find({'roomId':data[i].roomId}).sort({'createdAt':-1});
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
      
    async messageCount(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
           // console.log(userId)
            if (!userId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
          
            if(req.body.type=='Business'){
                var obj_data ={
                'businessId':userId,
                'readStatus':false
                }
            }else{
                var obj_data ={
                    'seekerId':userId,
                    'readStatus':false
                    }
            }
            var msg = await messageModel.countDocuments(obj_data);
            return res.json({code:codes.success,message:messages.success,result:msg})
        }catch(error){
            return res.json({code:codes.serverError,message:message.messages.serverError})
        }
    }
    
}
module.exports = messageService