var offerModel = require('../models/offerApply');
var businessModel = require('../models/business').businessModel;
var seekerModel = require('../models/seekers');
var salesModel = require('../models/salesOpportunity').salesModel;
var message = require('../codes/messages');
var codes = require('../codes/codes');
var moment = require('moment-timezone');


class offerApply {
    async applyForJob(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            if (!userId  || !req_data.businessId || !req_data.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var apply = await offerModel.findOne({ 'seekerId': userId, 'businessId': req_data.businessId, 'salesId': req_data.salesId })
            if (apply) {
                return res.json({ code: codes.alreadyExists, message: messages.AlreadyApplied })
            } else {            
                var obj_data = {
                    'seekerId': userId,
                    'businessId': req_data.businessId,
                    'salesId': req_data.salesId,
                    'isApplied': true,
                    'appliedDate':moment().tz(timeZone).format(),
                    'createdAt': moment().tz(timeZone).format()
                }
                
                var save = await new offerModel(obj_data).save();
                var proposal = await salesModel.findOne({'_id':req_data.salesId})
                await salesModel.updateOne({'_id':req_data.salesId},{$set:{'totalProposal':proposal.totalProposal+1}})
                return res.json({ code: codes.success, message: messages.success, result: save })
            }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message:messages.serverError })
        }
    }

    async acceptAndDeclineOffer(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            
            var offr = await offerModel.findOne({'_id':req_data.appliedId,'isActive':true})
            if(offr){
            if(req_data.Decline == true){
                var obj_data ={
                         'offerDecline':true,
                         'declineDate':moment().tz(timeZone).format()
                }
            }else{
                var obj_data={
                    'offerAccept':true,
                    'acceptDate':moment().tz(timeZone).format()
                }
            }
                var updte = await offerModel.updateOne({'_id':req_data.appliedId},{$set:obj_data})
                if(req_data.Accept == true){
                     await seekerModel.updateOne({'_id':offr.seekerId},{$set:{'isHired':true,'hiredDate':moment().tz(timeZone).format()}})
                }
                return res.json({code:codes.success,message:messages.success})
             }else{
                return res.json({code:codes.badRequest,message:messages.notFound})
            }
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:message.messages.serverError})
        }
    } 

    async offerLetterDetail(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var offr = await offerModel.findOne({'seekerId':userId,'salesId':req_data.salesId}).populate([{path:'businessId'},{path:'offerLetterId'},{path:'businessId',populate:{path:'range'}},{path:'seekerId'},{path:'seekerId',populate:{path:'language.language'}},{path:'seekerId',populate:{path:'industry'}},{path:'seekerId',populate:{path:'service'}}]);
            if(offr){     
                var count = await offerModel.countDocuments({'businessId':offr.businessId,'isApplied':true})   
                return res.json({code:codes.success,message:messages.success,result:offr,count:count})
             }else{
                return res.json({code:codes.badRequest,message:messages.notFound})
            }
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:message.messages.serverError})
        }
    }

    async sendOfferLetterToSeeker(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId   = req.obj.result.userId;
            var req_data = req.body ;
            var obj_data = {
                       'businessId':userId,
                       'seekerId'  :req_data.seekerId,
                       'salesId'     :req_data.salesId,
                       'isApplied' : true
            }
            var usr = await offerModel.findOne(obj_data)
            if(usr){
                var updte_data ={
                      'offerLetterId':req_data.offerId,
                      'sendOfferLetter':true,
                      'sendOfferLetterDate':moment().tz(timeZone).format()
                }
                var offr = await offerModel.updateOne({'_id':usr._id},{$set:updte_data});
                return res.json({code:codes.success,message:messages.success})
            }else{
                return res.json({code:codes.badRequest,message:messages.notFound})
            }

        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:messages.serverError})
        }
    }

    
}
module.exports = offerApply