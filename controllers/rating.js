var RatingModel = require('../models/rating');
var businessModel = require('../models/business').businessModel;
var seekerModel = require('../models/seekers');
var salesModel = require('../models/salesOpportunity').salesModel;
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
//var adminModel = require('../models/admin')
var codes = require('../codes/codes');
var message = require('../codes/messages');
var moment = require('moment-timezone');


class RatingService {
    async addRating(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            if (!userId || !req_data.rating) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var number = Math.floor(Math.random() * 900000) + 100000;
            if(req_data.type=='seekers'){
                var seekerId = userId
            }else{
                var businessId = userId
            }

            var data = {
                'userId': userId,
                'feedbackId': number,
                'businessId': businessId,
                'seekerId': seekerId,
                'review': req_data.review,
                'rating': req_data.rating,
                'ratingType':req_data.ratingType,
                'ratingFrom':req_data.ratingFrom,
                'createdAt': moment().tz(timezone).format()
            }

            var [rating, avg, seeker] = await Promise.all([
                new RatingModel(data).save(),
                RatingModel.aggregate(
                    [
                        { $match: { $and: [ { 'businessId': ObjectId(req_data.businessId) },{'ratingType': 'business'}]} },

                        {
                            $group: {
                                _id: null,
                                avg: { $avg: "$rating" }
                            }
                        }
                    ]
                ),

                RatingModel.aggregate(
                    [
                        { $match: { $and: [ { 'seekerId': ObjectId(req_data.seekerId) },{'ratingType': 'seeker'}]} },

                        {
                            $group: {
                                _id: null,
                                avg: { $avg: "$rating" }
                            }
                        }
                    ]
                ),
            ]);
            if(avg.length == []){
                var busRate = ''
            }else{
                var busRate = avg[0].avg
            }
            if(seeker.length == []){
                var seekRate = ''
            }else{
                var seekRate = seeker[0].avg
            }
            if (req_data.businessId) {
                await businessModel.updateOne({ '_id': req_data.businessId }, { $set: { 'avgRating': busRate } })
            }
            if (req_data.seekerId) {
                await seekerModel.updateOne({ '_id': req_data.seekerId }, { $set: { 'avgRating': seekRate } })
            }
           
            return res.json({ code: codes.success, message: messages.success, result: rating });

        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getbusinessRating(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var businessId = req.body.businessId;
            if (!userId || !businessId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var RatingAvg = await RatingModel.aggregate(
                [
                    { $match: { $and: [ { 'businessId': ObjectId(req_data.businessId) },{'ratingType': 'business'}]} },
                    {
                        $group: {
                            _id: null,
                            avg: { $avg: "$rating" }
                        }
                    }
                ]
            );
            var ratings = await RatingModel.find({ 'businessId': businessId }).populate({ path: 'seekers', select: '_id firstname email image' }).skip(perPage * (pageNo - 1)).limit(perPage);
            if (ratings && ratings.length) {
                return res.json({ code: codes.success, message: messages.success, result: ratings, Rating: RatingAvg });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }

        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getSeekerRating(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var seekerId = req.body.seekerId;

            if (!seekerId || !userId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }

            var RatingAvg = await RatingModel.aggregate(
                [
                    { $match: { $and: [ { 'seekerId': ObjectId(req_data.seekerId) },{'ratingType': 'seekers'}]} },
                    {
                        $group: {
                            _id: null,
                            avg: { $avg: "$rating" }
                        }
                    }
                ]
            );
            var ratings = await RatingModel.find({ 'seekerId': seekerId }).populate({ path: 'businesses', select: '_id firstName email' }).skip(perPage * (pageNo - 1)).limit(perPage);
            if (ratings && ratings.length) {
                return res.json({ code: codes.success, message: messages.success, result: ratings, Rating: RatingAvg });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async editRating(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var userId = req.obj.result.userId;
            if (!userId || !req_data.ratingId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var rate = await RatingModel.findOne({ '_id': req_data.ratingId, 'isActive': true })
            if (rate) {
                var obj_data = {
                    'review': req_data.review ? req_data.review : rate.review,
                    'rating': req_data.rating ? req_data.rating : rate.rating
                }
                await RatingModel.updateOne({ '_id': req_data.ratingId }, { $set: obj_data })
                var [avg, seeker] = await Promise.all([

                    RatingModel.aggregate(
                        [
                            { $match: { 'businessId': rate.businessId } },
                            {
                                $group: {
                                    _id: null,
                                    avg: { $avg: "$rating" }
                                }
                            }
                        ]
                    ),

                    RatingModel.aggregate(
                        [
                            { $match: { 'seekerId': rate.seekerId } },
                            {
                                $group: {
                                    _id: null,
                                    avg: { $avg: "$rating" }
                                }
                            }
                        ]
                    ),
                ]);
                await Promise.all([businessModel.updateOne({ '_id': rate.businessId }, { $set: { 'avgRating': avg } }),
                seekerModel.updateOne({ '_id': rate.seekerId }, { $set: { 'avgRating': seeker } })
                ]);
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }
    ////////////////////////// Admin Api//////////

    async feedbackForAdmin(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var pageNo = req.body.pageNo ? req.body.pageNo : 1
            var perPage = req.body.perPage ? req.body.perPage :10;
            var adminId = req.obj.result.userId;
            var arr =[]
            if (req.body.search  && req.body.filter && req.body.fromDate && req.body.toDate) {
           
                 var seeker  = await seekerModel.findOne({ $or: [{  'email': { '$regex': req.body.search, '$options': 'i' }}, {  'phone': { '$regex': req.body.search, '$options': 'i' }}] })
                 if(seeker){
                var obj ={
                    'createdAt':{$gte:req.body.fromDate,$lte:req.body.toDate},
                    'ratingType':req.body.filter,
                    'seekerId':seeker._id
               }
            }else{
                var bus  = await businessModel.findOne({ $or: [{  'email': { '$regex': req.body.search, '$options': 'i' }}, {  'phone': { '$regex': req.body.search, '$options': 'i' }}] })
                var obj ={
                    'createdAt':{$gte:req.body.fromDate,$lte:req.body.toDate},
                    'ratingType':req.body.filter,
                    'businessId':bus._id
               }
            }
            }else  if ( req.body.fromDate && req.body.toDate && req.body.search) {
                var seeker  = await seekerModel.findOne({ $or: [{  'email': { '$regex': req.body.search, '$options': 'i' }}, {  'phone': { '$regex': req.body.search, '$options': 'i' }}] })
               if(seeker){
                var obj = {
                    'createdAt':{$gte:req.body.fromDate,$lte:req.body.toDate},
                    'seekerId':seeker._id
                }
            }else{
                var bus  = await businessModel.findOne({ $or: [{  'email': { '$regex': req.body.search, '$options': 'i' }}, {  'phone': { '$regex': req.body.search, '$options': 'i' }}] })
                var obj = {
                    'createdAt':{$gte:req.body.fromDate,$lte:req.body.toDate},
                    'businessId':bus._id
                }
            }
            }else if( req.body.fromDate && req.body.toDate && req.body.filter){
                var obj = {
                    'createdAt':{$gte:req.body.fromDate,$lte:req.body.toDate},
                    'ratingType':req.body.filter,
                }
            }else if(req.body.search  && req.body.filter){
                var seeker  = await seekerModel.findOne({ $or: [{  'email': { '$regex': req.body.search, '$options': 'i' }}, {  'phone': { '$regex': req.body.search, '$options': 'i' }}] })
                 if(seeker){
                var obj = {
                    'ratingType':req.body.filter,
                    'seekerId':seeker._id
                }
            }else{
                var bus  = await businessModel.findOne({ $or: [{  'email': { '$regex': req.body.search, '$options': 'i' }}, {  'phone': { '$regex': req.body.search, '$options': 'i' }}] })
                var obj = {
                    'ratingType':req.body.filter,
                    'businessId':bus._id
                }
            }
            }else if ( req.body.fromDate && req.body.toDate){
                var obj = {
                    'createdAt':{$gte:req.body.fromDate,$lte:req.body.toDate},
                    
                }
            }else if( req.body.filter=='seeker' ){
            
                var obj = {
                    'ratingType':'seeker',
                }
            }else if( req.body.filter=='business' ){
            
                var obj = {
                    'ratingType':'business',
                }
            }else if(req.body.filter =='All'){
                var obj = {}
          //  }  
            }else if( req.body.search ){
                var bus  = await businessModel.findOne({ $or: [{  'email': { '$regex': req.body.search, '$options': 'i' }}, {  'phone': { '$regex': req.body.search, '$options': 'i' }}] })

                     if(bus){
                        var obj = {
                            'businessId':bus._id
                        }
            
            }else{
                var seeker  = await seekerModel.findOne({ $or: [{  'email': { '$regex': req.body.search, '$options': 'i' }}, {  'phone': { '$regex': req.body.search, '$options': 'i' }}] })

                var obj = {
                    'seekerId':seeker._id
                }
            }
            }else{
                var obj = {}
            }

            console.log(obj,"obj")
                var count = await RatingModel.countDocuments(obj)
            var rate = await RatingModel.find(obj).populate([{path:'seekerId', select:'firstName email phone'},{path:'businessId',select:'firstName email businessNumber'}]).skip(perPage * (pageNo - 1)).limit(perPage);
            if(rate && rate.length){
                for(var i = 0;i<rate.length;i++){
                    var createDte = moment(rate[i].createdAt).format()
                    var dte2 = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                    var createtym = moment(rate[i].createdAt).format('hh:mm a')
                var obj_data ={
                    '_id':rate[i]._id,
                    'feedbackId':rate[i].feedbackId,
                    'businessId': rate[i].businessId,
                    'seekerId': rate[i].seekerId,
                    'review': rate[i].review,
                    'rating': rate[i].rating,
                    'ratingType':rate[i].ratingType,
                    'createdAt': dte2 + ' '+createtym
                }
                arr.push(obj_data)
            }
                return res.json({code:codes.success,message:messages.success,result:arr,Total:count})
            }else{
                return res.json({code:codes.badRequest,message:messages.notFound})
            }
        }catch(error){
           console.log(error)
           return res.json({code:codes.serverError,message:messages.serverError})
        }
    }


    async feedBackCSV(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var arr = [];
            let rate = await RatingModel.find({}).sort({ 'createdAt': -1 }).populate([{path:'seekerId', select:'firstName email phone'},{path:'businessId',select:'firstName email businessNumber'}]);
            if (rate) {
                for (var i = 0; i < rate.length; i++) {
                    var createDte = moment(rate[i].createdAt).format()
                    var dte2 = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                    var createtym = moment(rate[i].createdAt).format('hh:mm a')
                    if(rate[i].businessId != null){
                        var nme = rate[i].businessId.firstName
                        var number = rate[i].businessId.businessNumber
                    }else{
                        var nme = 'N/A'
                        var number = 'N/A'
                    }
                    if(rate[i].seekerId != null){
                        var seekernme = rate[i].seekerId.firstName
                        var seekernumber = rate[i].seekerId.phone
                    }else{
                        var seekernme = 'N/A'
                        var seekernumber = 'N/A'
                    }
                    var ratedetail = {
                        'businessName':nme,
                        'businessMobile':number,
                        'seekerMobile':seekernumber,
                        'seekerName':seekernme,
                        'feedbackId':rate[i].feedbackId,
                        'review': rate[i].review,
                        'rating': rate[i].rating,
                        'ratingType':rate[i].ratingType,
                        'createdAt': dte2
                    }
                    arr.push(ratedetail)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }


}
module.exports = RatingService;