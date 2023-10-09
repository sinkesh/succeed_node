var trainingModel = require('../models/training');
var message = require('../codes/messages');
var codes = require('../codes/codes');
var moment = require('moment-timezone');

class trainingService {
    async addTraining(req, res) {
        try {
            var messages = message.messages(req.header('timezone'))
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            if (!userId || !req_data.title || !req_data.tags) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            if (req.file != undefined) {
                var Video = req.file.path;
            }
            var tag = JSON.parse(req_data.tags)
            var obj_data = {
                'seekerId':userId,
                'title': req_data.title,
                'blogs': req_data.blog,
                'tags': tag,
                'video': Video,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new trainingModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async searchTraining(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var obj_data = { 'isActive': true }
            if(req_data.sortBy==true){
                var sort ={
                    'createdAt':-1
                }
            }else{
                var sort ={
                    'createdAt':1
                }
            }
            if (req_data.search && req_data.search != null) {
                var obj_data = {
                    $and: [{ 'title': { '$regex': req_data.search, '$options': 'i' } }, { 'isActive': true }] //, { 'jobStatus': 
                }
            }
            var save = await trainingModel.find(obj_data).sort(sort).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async editTraining(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata'
            var userId = req.obj.result.userId;
            var req_data = req.body;
            console.log(req_data,"data")
            if (!userId || !req_data.trainingId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var chck = await trainingModel.findOne({ '_id': req_data.trainingId })
            console.log(chck,"chck")
            if (chck) {
                console.log(req.file)
                if(req.file != undefined){
                    var video = req.file.secure.path;
                }else{
                    var video = chck.video
                }
                var obj_data = {
                    'title': req_data.title ? req_data.title : chck.title,
                    'blogs': req_data.blogs ? req_data.blogs : chck.blogs,
                    'tags': req_data.tags ? req_data.tags : chck.tags,
                    'video': video,
                    'updatedAt': moment().tz(timeZone).format()
                }
                var updte = await trainingModel.updateOne({ '_id': chck._id }, { $set: obj_data })
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch {

            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

}
module.exports = trainingService;