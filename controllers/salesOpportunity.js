var salesModel = require('../models/salesOpportunity').salesModel;
var seekerModel = require('../models/seekers');
var averageDealModel = require('../models/seekerDropDownList').averageDealModel;
var messageModel = require('../models/chat').messageModel;
var roomModel = require('../models/chat').roomModel;
var busSubScriptionModel = require('../models/subscription').busSubScriptionModel;
var messageModel = require('../models/chat').messageModel;
var roomModel = require('../models/chat').roomModel;

var message = require('../codes/messages');
var codes = require('../codes/codes');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var methods = require('../methods/methods');
const moment = require('moment-timezone');
const offerModel = require('../models/offerApply');
const { businessModel } = require('../models/business');
const { IndustryModel } = require('../models/industry');
const { clientIndustryModel } = require('../models/seekerDropDownList');

class salesService {
    async Add_Sales_Opportunity(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var data = req.body;
            var businessId = req.obj.result.userId;
            if (!businessId || !data.tittle || !data.productId || !data.uniqueProposition || !data.sellingMethodId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            if(data.repeatCustomerSpend){
                var spend = data.repeatCustomerSpend
            }else{
                var spend = null
            }
            if(data.avgSaleCycle){
                var cycle = data.avgSaleCycle
            }else{
                var cycle = null
            }
            let obj = {
                'businessId': businessId,
                'tittle': data.tittle,
                'productId': data.productId,
                'productDetail': data.productDetail,
                'uniqueProposition': data.uniqueProposition,
                'sellingMethodId': data.sellingMethodId,
                'prductGallary': '',
                'videoUrl': data.videoUrl,
                'isNewService': data.isNewService,
                'currency': data.currency,
                'price': data.price,
                'avgDealValue': data.avgDealValue,
                'avgSaleCycle': cycle,
                'repeatCustomerSpend': spend,
                'pageStatus': data.pageStatus,
                'createdAt': moment().tz(timezone).format()
            }
            let save = await new salesModel(obj).save();
            return res.json({ code: codes.success, message: messages.success, result: save });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async Edit_Sales_Opportunity(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var data = req.body;
            var businessId = req.obj.result.userId;
            if (!businessId || !data.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let check = await salesModel.findOne({ '_id': data.salesId })
            if (check) {
                // if(req.files !=undefined){
                //     var img = req.files.path
                // }
                let obj = {
                    'tittle': data.tittle ? data.tittle : check.tittle,
                    'productId': data.productId ? data.productId : check.productId,
                    'productDetail': data.productDetail ? data.productDetail : check.productDetail,
                    'uniqueProposition': data.uniqueProposition ? data.uniqueProposition : check.uniqueProposition,
                    'sellingMethodId': data.sellingMethodId ? data.sellingMethodId : check.sellingMethodId,
                    'prductGallary': '',
                    'countryCode': data.countryCode ? data.countryCode : check.countryCode,
                    'videoUrl': data.videoUrl ? data.videoUrl : check.videoUrl,
                    'isNewService': data.isNewService ? data.isNewService : check.isNewService,
                    'currency': data.currency ? data.currency : check.currency,
                    'price': data.price ? data.price : check.price,
                    'avgDealValue': data.avgDealValue ? data.avgDealValue : check.avgDealValue,
                    'avgSaleCycle': data.avgSaleCycle ? data.avgSaleCycle : check.avgSaleCycle,
                    'repeatCustomerSpend': data.repeatCustomerSpend ? data.repeatCustomerSpend : check.repeatCustomerSpend,
                    'pageNo1':data.pageNo1 ? data.pageNo1 : check.pageNo1,
                    'pageStatus': data.pageStatus ? data.pageStatus : check.pageStatus,
                    'comissionPercentage': data.comissionPercentage ? data.comissionPercentage : check.comissionPercentage,
                    'comissionDetail': data.comissionDetail ? data.comissionDetail : check.comissionDetail,
                    'payementTerms': data.payementTerms ? data.payementTerms : check.payementTerms,
                    'pageNo2':data.pageNo2 ? data.pageNo2 : check.pageNo2,
                    'sector': data.sector ? data.sector : check.sector,
                    'industryId': data.industryId ? data.industryId : check.industryId,
                    'language': data.language ? data.language : check.language,
                    'productSellarea': data.productSellarea ? data.productSellarea : check.productSellarea,
                    'region': data.region ? data.region : check.region,
                    'country': data.country ? data.country : check.country,
                    'exclusiveTerritories': data.exclusiveTerritories ? data.exclusiveTerritories : check.exclusiveTerritories,
                    'leadProvided': data.leadProvided ? data.leadProvided : check.leadProvided,
                    'pageNo3': data.pageNo3 ? data.pageNo3 : check.pageNo3,
                    'updatedAt': moment().tz(timezone).format()
                }
                let save = await salesModel.updateOne({ '_id': data.salesId }, { $set: obj });

                if (save) {
                    let allData = await salesModel.findOne({ '_id': data.salesId }).populate([
                        { path: 'productId' }, { path: 'businessId', populate: [{ path: 'range' }] }, { path: 'sellingMethodId' }, { path: 'sector' }, { path: 'industryId' }, {path:'experinceRequired'},{path:'avgSaleCycle'},{ path: 'language', match: { _id: { $ne: null } } }]);

                    return res.json({ code: codes.success, message: messages.success,result:allData });
                } else {
                    return res.json({ code: codes.badRequest, message: messages.somethingWrong });
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async Edit_Sales_OpportunityForImage(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var data = req.body;
            var businessId = req.obj.result.userId;
            if (!businessId || !data.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let check = await salesModel.findOne({ '_id': data.salesId })
            if (check) {
                if (req.file && req.file.path) {
                    var img = req.file.path
                } else {
                    var img = check.documents
                }
            if (data.customQuestions) {
                    var customUpdate = JSON.parse(data.customQuestions);
                    var updte = await salesModel.updateOne({ '_id': data.salesId }, { $set: { 'customQuestions': customUpdate } })
                }
                if(data.isTrainingMandatory=='true'){
                    var mandatory = true
                }else{
                    var mandatory = false
                }
                let obj = {
                    'tittle': data.tittle ? data.tittle : check.tittle,
                    'experinceRequired': data.experinceRequired ? data.experinceRequired : check.experinceRequired,
                    'industryExpRequired': data.industryExpRequired ? data.industryExpRequired : check.industryExpRequired,
                    'trainingNeed': data.trainingNeed ? data.trainingNeed : check.trainingNeed,
                    'documents': img,
                    'links': data.links ? data.links : check.links,
                    'trainingName':data.trainingName ? data.trainingName : check.trainingName,
                    'trainingDesc':data.trainingDesc ? data.trainingDesc : check.trainingDesc,
                    'trainingStartDate':data.trainingStartDate ? data.trainingStartDate : check.trainingStartDate,
                    'trainingEndDate':data.trainingEndDate ? data.trainingEndDate : check.trainingEndDate,
                    'isTrainingMandatory': mandatory,
                    'saveAsDraft': data.saveAsDraft ? data.saveAsDraft : check.saveAsDraft,
                    'pageNo4':data.pageNo4 ? data.pageNo4 : check.pageNo4,
                    'updatedAt': moment().tz(timezone).format()
                }
                let save = await salesModel.updateOne({ '_id': data.salesId }, { $set: obj });
                if (save) {
                    let allData = await salesModel.findOne({ '_id': data.salesId }).populate([{path:'experinceRequired'}]);
                    return res.json({ code: codes.success, message: messages.success,result:allData });
                } else {
                    return res.json({ code: codes.badRequest, message: messages.somethingWrong });
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }


    async deleteCustomQuestionFromBusiness(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var req_data = req.body;
            if (!userId || !req_data.questionId || !req_data.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var usr = await salesModel.findOne({ '_id': req_data.salesId })
            if (usr) {
                var updte = await salesModel.updateOne({ '_id': req_data.salesId }, { $pull: { 'customQuestions': { "_id": req_data.questionId } } });
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


    async GetAll_PerticularBusiness_Sales_Opportunity(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata'
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var businessId = req.obj.result.userId;
            var arr = []
            if (!businessId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            if (req.body.type == 'Closed') {
                if (req.body.search && req.body.search != null) {
                    var obj = {
                        $and: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'jobStatus': 'Closed' }, { 'businessId': businessId },{ 'saveAsDraft': false },{ 'isDelete': false }] //, { 'jobStatus': 'Active' }]

                    }
                } else {
                    var obj = {
                        'businessId': businessId, 'isDelete': false, 'jobStatus': 'Closed', 'saveAsDraft': false
                    }
                }
            } else if (req.body.type == 'ongoing') {
                if (req.body.search && req.body.search != null) {
                    var obj = {
                        $and: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'jobStatus': 'Ongoing' }, { 'businessId': businessId },{ 'saveAsDraft': false }] //, { 'jobStatus': 'Active' }]

                    }
                } else {
                    var obj = {
                        'businessId': businessId, 'isDelete': false, 'jobStatus': 'Ongoing', 'saveAsDraft': false
                    }
                }
            // } else if (req.body.type == 'Drafts') {
            //     if (req.body.search && req.body.search != null) {
            //         var obj = {
            //             $and: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'isDelete': false }, { 'saveAsDraft': true }, { 'businessId': businessId }] //, { 'jobStatus': 'Active' }]

            //         }
            //     } else {
            //         var obj = {
            //             'businessId': businessId, 'saveAsDraft': true, 'isDelete': false
            //         }
            //     }
            } else {
                if (req.body.search && req.body.search != null) {
                    var obj = {
                        $and: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'jobStatus': {$ne:'Ongoing'} },{ 'jobStatus': {$ne:'Closed'} }, { 'businessId': businessId },{ 'saveAsDraft': false }]//,{'businessId': businessId}] //, { 'jobStatus': 'Active' }]

                    }
                } else {
                    var obj = {
                        'businessId': businessId, 'isDelete': false,  'jobStatus': {$ne:'Ongoing'} , 'jobStatus': {$ne:'Closed'}
                    }
                }
            }
            var subs = await busSubScriptionModel.findOne({ 'businessId': businessId })
            if (subs) {
                var member = subs.createdAt
                var status = true
                var subDuration = subs.busDuration
            } else {
                var member = "not yet"
                var status = false
                var subDuration = null

            }
            var totlJob = await salesModel.countDocuments({ 'businessId': businessId, 'jobStatus': 'Posted', 'isDelete': false,'saveAsDraft': false })
            var ongoing = await salesModel.countDocuments({ 'businessId': businessId, 'jobStatus': 'Ongoing', 'isDelete': false,'saveAsDraft': false })
            var closed = await salesModel.countDocuments({ 'businessId': businessId, 'jobStatus': 'Closed', 'isDelete': false,'saveAsDraft': false})
            var draft = await salesModel.countDocuments({ 'businessId': businessId, 'saveAsDraft': true, 'isDelete': false })
            var all_job =  totlJob+ongoing+closed+draft
            var person_data = await businessModel.findOne({ '_id': businessId }).populate([{ path: 'sector' }, { path: 'industry' }])
            var count = await salesModel.countDocuments(obj)
            let data = await salesModel.find(obj).sort({ 'createdAt': -1 }).populate([
                { path: 'productId' }, { path: 'sellingMethodId' }, { path: 'industryId' }
            ]).skip(perPage * (pageNo - 1)).limit(perPage);
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    var chck = await offerModel.aggregate(
                        [
                            { $match: { $and: [{ 'salesId': ObjectId(data[i]._id) }, { 'offerAccept': true }] } },
                            { $sort: { 'createdAt': -1 } },
                            {
                                $group: {
                                    _id: null,
                                    count: { $sum: 1 }
                                }
                            }
                        ]
                    );
                    if (chck.length == 0) {
                        var hire = 0
                    } else {
                        var hire = chck[0].count
                    }
                    var msg = await messageModel.aggregate(
                        [
                            { $match: { $and: [{ 'salesId': ObjectId(data[i]._id) }, { 'readStatus':false}] } },
                          //  { $sort: { 'createdAt': -1 } },
                            {
                                $group: {
                                    _id: null,
                                    count: { $sum: 1 }
                                }
                            }
                        ]
                    );
                    if (msg.length == 0) {
                        var msgCount = 0
                    } else {
                        var msgCount = msg[0].count
                    }
                    if(person_data.industry==null){
                        var indutry = null
                    }else{
                        var indutry = person_data.industry.name
                    }
                    var personal_data = {
                        '_id':person_data._id,
                        'companyName': person_data.companyName,
                        'firstname': person_data.firstName,
                        'businessActivity': person_data.businessActivity,
                        'image': person_data.image,
                        'country': person_data.country,
                        'city': person_data.city,
                        'sector': person_data.sector.name,
                        'industry': person_data.industry,
                        'isBusinessStatus':true,
                        'membershipStatus': status,
                        'businessSubscription': member,
                        'subDuration':subDuration,
                        'totlJobsPosted': totlJob,
                        "userTotlJobs":all_job,
                        'emailVerify':person_data.emailVerify,
                        "email":person_data.email,
                        'createdAt':person_data.createdAt

                    }
                    var obj_data = {
                        '_id': data[i]._id,
                        'tittle': data[i].tittle,
                        'productId': data[i].productId,
                        'sector': data[i].sector,
                        'productSellarea': data[i].productSellarea,
                        'saveAsDraft': data[i].saveAsDraft,
                        'totalProposal': data[i].totalProposal,
                        'hired': hire,
                        'withdrawPost':data[i].withdrawPost,
                        'createdAt': data[i].createdAt,
                        'uniqueProposition': data[i].uniqueProposition,
                        'jobStatus': data[i].jobStatus,
                        'country': data[i].country,
                        'isDelete': data[i].isDelete,
                        'chats': msgCount
                    }
                    arr.push(obj_data)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr, personal: personal_data, totlJob: totlJob, totlClose: closed, totlOngoing: ongoing, totlDraft: draft, Total: count});
            } else {
                var personal_data1 = {
                    '_id':person_data._id,
                    'companyName': person_data.companyName,
                    'firstname': person_data.firstName,
                    'businessActivity': person_data.businessActivity,
                    'image': person_data.image,
                    'country': person_data.country,
                    'city': person_data.city,
                    'sector': person_data.sector.name,
                    'industry': person_data.industry,
                    'membershipStatus': status,
                    'isBusinessStatus':true,
                    'businessSubscription': member,
                    'subDuration':subDuration,
                    'totlJobsPosted': totlJob,
                    "userTotlJobs":all_job,
                    'emailVerify':person_data.emailVerify,
                    "email":person_data.email,
                    'createdAt':person_data.createdAt

                }
                return res.json({ code: codes.badRequest, message: [], personal: personal_data1, totlJob: totlJob, totlClose: closed, totlOngoing: ongoing, totlDraft: draft });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async PerticularBusiness_Sales_Opportunity(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var businessId = req.obj.result.userId;
            if (!businessId || !req.body.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var msg = await messageModel.countDocuments({ 'salesId': req.body.salesId, 'readStatus': false })
            var archive = await roomModel.countDocuments({ 'salesId': req.body.salesId, 'status': 'Archive' })
            var proposal = await offerModel.countDocuments({'salesId':req.body.salesId,'isApplied':true})
            let data = await salesModel.findOne({ '_id': req.body.salesId, 'isDelete': false }).populate([
                { path: 'productId' }, { path: 'sellingMethodId' }, { path: 'sectorId' }, { path: 'industryId' }, { path: 'language', match: { _id: { $ne: null } } }
            ])
            if (data) {
                await salesModel.updateOne({ '_id': data._id }, { $set: { 'jobViews': data.jobViews + 1 } })
                return res.json({ code: codes.success, message: messages.success, result: data, messageCounts: msg, archievedCounts: archive,proposalCount:proposal });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async updateJobStatus(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var chck = await salesModel.findOne({ '_id': req_data.jobId, 'isDelete': false,'withdrawPost':true })
            if (chck) {
                if (req_data.jobStatus == 'Closed') {
                    var obj_data = {
                        'jobStatus': 'Closed',
                        'closeDate': moment().tz(timeZone).format(),
                        'updatedAt': moment().tz(timeZone).format()
                    }   
                }
                if (req_data.jobStatus == 'Active') {
                    var obj_data = {
                        'jobStatus': 'Ongoing',
                        'updatedAt': moment.tz(timeZone).format()
                    }
                }
                var updte = await salesModel.updateOne({ '_id': chck._id }, { $set: obj_data })
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async deleteJob(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            if (!userId || !req_data.jobId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            if(req_data.type == 'Draft'){
                var obj_data = {
                     '_id': req_data.jobId,
                      'isDelete':false 
                }
            }else{
                var obj_data = {
                    '_id': req_data.jobId,
                     'withdrawPost': true,
                     'isDelete':false 
               }
            }
            var job = await salesModel.findOne(obj_data)
            if (job) {
                var obj_data = {
                    'jobStatus': 'Closed',
                    'isDelete': true,
                    'closeDate': moment().tz(timeZone).format(),
                    'updatedAt': moment().tz(timeZone).format()
                }
                var updte = await salesModel.updateOne({ '_id': req_data.jobId }, { $set: obj_data })
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async reusePosting(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var userId = req.obj.result.userId;
            if (!userId || !req_data.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var chck = await salesModel.findOne({ '_id': req_data.salesId, 'jobStatus': 'Closed' })
            if (chck) {
                var obj_data = {
                    'reusePost':true,
                    'isDelete': false,
                    'jobStatus': 'Posted',
                    'updatedAt': moment().tz(timeZone).format()
                }
                var updte = await salesModel.updateOne({ '_id': req_data.salesId }, { $set: obj_data })
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async withDrawPost(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var userId = req.obj.result.userId;
            if (!userId || !req_data.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var chck = await salesModel.findOne({ '_id': req_data.salesId, 'isDelete': false })
            if (chck) {
                var obj_data = {
                    'withdrawPost':true,
                    'updatedAt': moment().tz(timeZone).format()
                }
                var updte = await salesModel.updateOne({ '_id': req_data.salesId }, { $set: obj_data })
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async filterForBusinessScreen(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var arr = [];
            var obj = {}
            var sort = { 'createdAt': -1 }
            
            if (req_data.sortBy != null && req_data.filter != null) {

                if (req_data.filter == 'Industry' && req_data.sortBy == 'MostRecent') {
                    var obj = {
                        'industry': req_data.industryId
                    }
                    var sort = {
                        'createdAt': -1
                    }
                }

                if (req_data.filter == 'Industry' && req_data.sortBy == 'commission') {
                    var obj = {
                        'industry': req_data.industryId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
                if (req_data.filter == 'Sector' && req_data.sortBy == 'MostRecent') {
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
                if (req_data.filter == 'Region' && req_data.sortBy == 'MostRecent') {
                    var obj = {
                        'region': req_data.regionId
                    }
                    var sort = {
                        'createdAt': -1
                    }
                }
                if (req_data.filter == 'Region' && req_data.sortBy == 'commission') {
                    var obj = {
                        'region': req_data.regionId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
                if (req_data.filter == 'Product/Services' && req_data.sortBy == 'MostRecent') {
                    var obj = {
                        'service': req_data.serviceId,

                    }
                    var sort = {
                        'createdAt': -1
                    }
                }
                if (req_data.filter == 'Product/Services' && req_data.sortBy == 'commission') {
                    var obj = {
                        'service': req_data.serviceId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }


                if (req_data.filter == 'YearsOfExperience' && req_data.sortBy == 'MostRecent') {
                    var obj = {
                        'experience': req_data.experienceId
                    }
                    var sort = {
                        'createdAt': -1
                    }
                }
                if (req_data.filter == 'YearsOfExperience' && req_data.sortBy == 'commission') {
                    var obj = {
                        'experience': req_data.experienceId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
                if (req_data.filter == 'languageOfTheOppurtunity' && req_data.sortBy == 'MostRecent') {
                    var obj = {
                        'language.language': req_data.languageId
                    }
                    var sort = {
                        'createdAt': 1
                    }
                }
                if (req_data.filter == 'languageOfTheOppurtunity' && req_data.sortBy == 'commission') {
                    var obj = {
                        'language.language': req_data.languageId
                    }
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
                if (req_data.filter == 'Network' && req_data.sortBy == 'MostRecent') {
                    if (req_data.networkValue == true) {
                        var obj = {
                            'alreadyHaveNetwork': true
                        }
                        var sort = {
                            'createdAt': -1
                        }
                    } else {
                        var obj = {
                            'alreadyHaveNetwork': false
                        }
                        var sort = {
                            'createdAt': -1
                        }
                    }

                }
                if (req_data.filter == 'Network' && req_data.sortBy == 'commission') {
                    if (req_data.networkValue == true) {
                        var obj = {
                            'regionNetwork': true
                        }
                        var sort = {
                            'comissionPercentage': -1
                        }
                    } else {
                        var obj = {
                            'regionNetwork': false
                        }
                        var sort = {
                            'comissionPercentage': -1
                        }
                    }

                }
            }
            if (req_data.filter != null) {
                if (req_data.filter == 'Industry') {
                    var obj = {
                        'industry': req_data.industryId
                    }
                }
                if (req_data.filter == 'Sector') {
                    var obj = {
                        'sector': req_data.sectorId
                    }
                }
                if (req_data.filter == 'Region') {
                    var obj = {
                        'region': req_data.region
                    }
                }
                if (req_data.filter == 'Product/Services') {
                    var obj = {
                        'service': req_data.productId
                    }
                }

                // if (req_data.filter == 'AverageDeal') {
                //     if (req_data.min == '500+') {
                //         var obj = {
                //             'averagedeal': { $gte: 500 }
                //         }
                //     } else if (req_data.min != undefined && req_data.max != undefined) {
                //         var obj = {
                //             'averagedeal': { $gte: parseInt(req_data.min), $lte: parseInt(req_data.max) }
                //         }
                //     } else {
                //         var obj = {
                //             'averagedeal': {}
                //         }
                //     }
                // }
                    if (req_data.filter == 'YearsOfExperience') {
                        var obj = {
                            'experience': req_data.experienceId
                        }
                    }
                    if (req_data.filter == 'languageOfTheOppurtunity') {
                        var obj = {
                            'language.language': req_data.languageId
                        }
                    }
                if (req_data.filter == 'Network') {
                    if (req_data.networkValue == true) {
                        var obj = {
                            'alreadyHaveNetwork': true
                        }
                    } else {
                        var obj = {
                            'alreadyHaveNetwork': false
                        }
                    }
                }
            }
            if (req_data.sortBy != null) {
                if (req_data.sortBy == 'MostRecent') {
                    var sort = {
                        'createdAt': -1
                    }
                }
                if (req_data.sortBy == 'commission') {
                    var sort = {
                        'comissionPercentage': -1
                    }
                }
            }
                   if(req_data.search && req_data.search !=null){
                var obj ={
                 $or: [{ 'fullName': { '$regex': req_data.search, '$options': 'i' } }, { 'name': { '$regex': req_data.search, '$options': 'i' } }]

            }
      
    }
        
                var totlPage = await seekerModel.countDocuments(obj);
            var usr = await seekerModel.find(obj).sort(sort).populate([{path:'language.language'}]).skip(perPage * (pageNo - 1)).limit(perPage);
            if (usr && usr.length) {
                return res.json({ code: codes.success, message: messages.success, result: usr,totalPages:totlPage })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
     
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async offerProposalForBusinessScreen(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var arr = []
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var offr = await offerModel.find({ 'salesId': req_data.salesId, 'isApplied': true }).populate([{path:'seekerId'},{path:'seekerId',populate:{path:'language.language'}},{path:'seekerId',populate:{path:'experience', match: { _id: { $ne: null } }}}]).skip(perPage * (pageNo - 1)).limit(perPage);
            var count = await offerModel.countDocuments({ 'salesId': req_data.salesId, 'isApplied': true })
             if (offr && offr.length) {
            //     for (var i = 0; i < offr.length; i++) {populate
            //         var chck = await seekerModel.findOne({ '_id': offr[i].seekerId }).populate([{ path: 'language.proficiency' }, { path: 'language.language' }, { path: 'experinceRequired', match: { _id: { $ne: null } } }]).skip(perPage * (pageNo - 1)).limit(perPage);
            //         arr.push(chck)
            //     }
                return res.json({ code: codes.success, message: messages.success, result: offr, Total: count })
             } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async salesDetailForBusinessSection(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var businessId = req.obj.result.userId;
            if (!businessId || !req.body.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let data = await salesModel.findOne({ '_id': req.body.salesId, 'isDelete': false }).populate([
                { path: 'currency', match: { _id: { $ne: null } } },  { path: 'productId' }, { path: 'businessId', populate: [ { path: 'range' },{path:'companySize', match: { _id: { $ne: null } }},{path:'numOfCustomer', match: { _id: { $ne: null } }}] }, { path: 'sellingMethodId' }, { path: 'sector' }, { path: 'industryId' },{path:'experinceRequired'},{ path: 'language', match: { _id: { $ne: null } } }, { path: 'avgSaleCycle', match: { _id: { $ne: null } } },{ path: 'repeatCustomerSpend', match: { _id: { $ne: null } } }
            ]);
            var subs = await busSubScriptionModel.findOne({ 'businessId': businessId })
            if (subs) {
        
                var status = true
             
            } else {
               
                var status = false
             

            }
            if (data) {
                //  await salesModel.updateOne({ '_id': data._id }, { $set: { 'jobViews': data.jobViews + 1 } })
                var obj = data.toObject();
                obj.membershipStatus = status
                return res.json({ code: codes.success, message: messages.success, result: obj });
            } else {    
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    ///// Admin Api's/////////
    async GetAllOppurtunityForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var adminId = req.obj.result.userId;
            var arr = []
            if (req.body.search && req.body.filter != null && req.body.fromDate && req.body.toDate &&req.body.search !='' && req.body.filter !='' && req.body.fromDate !='' &&  req.body.toDate !='') {
                var srch = await businessModel.findOne({ $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }] })
                if (srch) {
                    if (req.body.filter == "true") {
                        var obj = {
                            'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                            'status': true,
                            'businessId': srch._id
                        }
                    } else if (req.body.filter == "false") {
                        var obj = {
                            'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                            'status': false,
                            'businessId': srch._id
                        }
                    } else {
                        var obj = {
                            'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                            'jobStatus': req.body.filter,
                            'businessId': srch._id
                        }

                    }

                } else {
                    if (req.body.filter == "true") {
                        var obj = {
                            'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                            'status': true,
                            $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                        }
                    } else if (req.body.filter == "false") {
                        var obj = {
                            'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                            'status': false,
                            $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                        }

                    } else {
                        var obj = {
                            'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                            'jobStatus': req.body.filter,
                            $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                        }

                    }
                }
            } else if (req.body.fromDate && req.body.toDate && req.body.search && req.body.fromDate !='' && req.body.toDate !=''&& req.body.search !='') {
                var srch = await businessModel.findOne({ $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }] })
                if (srch) {
                    var obj = {
                        'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                        'businessId': srch._id
                    }
                } else {
                    var obj = {
                        'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                        $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                    }
                }
            } else if (req.body.fromDate && req.body.toDate && req.body.filter != null && req.body.fromDate !='' && req.body.toDate !='' && req.body.filter !='') {
                if (req.body.filter == "true") {
                    var obj = {
                        'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                        'status': true
                    }
                } else if (req.body.filter == "false") {
                    var obj = {
                        'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                        'status': false,
                    }
                } else {
                    var obj = {
                        'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                        'jobStatus': req.body.filter,
                    }
                }
            } else if (req.body.search && req.body.filter != null && req.body.filter !="") {
                var srch = await businessModel.findOne({ $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }] })
                if (srch) {
                    if (req.body.filter == "true") {
                        var obj = {
                            'status': true,
                            'businessId': srch._id
                        }
                    } else if (req.body.filter == "false") {
                        var obj = {
                            'status': false,
                            'businessId': srch._id
                        }
                    } else {
                        var obj = {
                            'jobStatus': req.body.filter,
                            'businessId': srch._id
                        }
                    }
                } else {
                    if (req.body.filter == "true") {
                        var obj = {
                            'status': true,
                            $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                        }
                    } else if (req.body.filter == "false") {
                        var obj = {
                            'status': false,
                            $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                        }
                    } else {
                        var obj = {
                            'jobStatus': req.body.filter,
                            $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                        }
                    }
                }
            } else if (req.body.fromDate && req.body.toDate) {
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate }
                }
            } else if (req.body.filter) {
                if (req.body.filter == "true") {

                    var obj = {
                        'status': true
                    }
                } else if (req.body.filter == "false") {
                    var obj = {
                        'status': false
                    }
                } else {
                    var obj = {
                        'jobStatus': req.body.filter
                    }
                }
            } else if (req.body.search) {
                var srch = await businessModel.findOne({ $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }] })
                if (srch) {
                    var obj = {
                        'businessId': srch._id
                    }
                } else {
                    var obj = {
                        $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                    }
                }
            } else {
                var obj = {}
            }
            console.log(obj)
            var count = await salesModel.countDocuments(obj);
            let data = await salesModel.find(obj).sort({ 'createdAt': -1 }).populate([{ path: 'productId' }, { path: 'businessId', select: 'firstName' }]).skip(perPage * (pageNo - 1)).limit(perPage)
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    var offr = await offerModel.countDocuments({ 'salesId': data[i]._id, 'sendOfferLetter': true })
                    var apply = await offerModel.countDocuments({ 'salesId': data[i]._id, 'isApplied': true })
                    var hire = await offerModel.countDocuments({ 'salesId': data[i]._id, 'offerAccept': true })
                    var archve = await roomModel.countDocuments({ 'status': 'archive' });
                    var msg = await messageModel.countDocuments({ 'salesId': data[i]._id, 'readStatus': false })
                   
                     // console.log(data[i])
                    if(data[i].productId == null){
                           var service = 'N/A'
                       }else{
                           var service =  data[i].productId.service
                       }

                    var obj = {
                        '_id': data[i]._id,
                        'tittle': data[i].tittle,
                        'businessId': data[i].businessId.firstName,
                        'productId': service,
                        'comissionPercentage': data[i].comissionPercentage,
                        'status': data[i].status,
                        'jobStatus': data[i].jobStatus,
                        'application': apply,
                        'offered': offr,
                        'hired': hire,
                        'archived': archve,
                        'totlMsg': msg
                    }
                    arr.push(obj)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr, Total: count });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }


    async GetAllDraftsJobForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            var adminId = req.obj.result.userId;
            var arr = []

            if (req.body.fromDate && req.body.toDate && req.body.search) {
                var srch = await businessModel.findOne({ $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }] })
                if (srch) {
                    var obj = {
                        'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                        'businessId': srch._id,
                        'saveAsDraft': true,
                    }
                } else {
                    var obj = {
                        'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                        'saveAsDraft': true,
                        $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }]
                    }
                }
            } else if (req.body.fromDate && req.body.toDate) {
                var obj = {
                    'createdAt': { $gte: req.body.fromDate, $lte: req.body.toDate },
                    'saveAsDraft': true
                }
            } else if (req.body.search) {
                var srch = await businessModel.findOne({ $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }] })
                console.log(srch)
                if (srch) {
                    var obj = {
                        'businessId': srch._id,
                        'saveAsDraft': true

                    }
                } else {
                    var obj = {
                        'saveAsDraft': true,
                        $or: [{ 'tittle': { '$regex': req.body.search, '$options': 'i' } }, { 'firstName': { '$regex': req.body.search, '$options': 'i' } }],
                    }
                }
            } else {
                var obj = { 'saveAsDraft': true }
            }
            var count = await salesModel.countDocuments(obj);
            let data = await salesModel.find(obj).sort({ 'createdAt': -1 }).populate([{ path: 'productId' }, { path: 'businessId', select: 'firstName companyName' }]).skip(perPage * (pageNo - 1)).limit(perPage)

            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    // console.log(data[i].productId == null)

                    var updteDte = moment(data[i].updatedAt).format()
                    var dte2 = (new Date(updteDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                       if(data[i].productId !=null ){
                           var product =  data[i].productId.service
                       }else{
                           var product = 'N/A'
                       }
                    var obj = {
                        '_id': data[i]._id,
                        'tittle': data[i].tittle,
                       // 'bb': data[i].businessId._id,
                        'businessId': data[i].businessId.companyName,
                        'productId': product,
                        'saveAsDraft': data[i].saveAsDraft,
                        'comissionPercentage': data[i].comissionPercentage,
                        'status': data[i].status,
                        // 'jobStatus': data[i].jobStatus,
                        'updatedAt': dte2
                    }
                    arr.push(obj)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr, Total: count });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }



    async updateJobStatusForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.status || !req_data.salesId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            if (req_data.status == 'Active') {
                var obj = {
                    'status': true,
                    'updatedAt': moment().tz(timeZone).format()
                }
            }
            if (req_data.status == 'Deactive') {
                var obj = {
                    'status': false,
                    'updatedAt': moment().tz(timeZone).format()
                }
            }
            var chck = await salesModel.findOne({ '_id': req_data.salesId })
            if (chck) {
                var updte = await salesModel.updateOne({ '_id': req_data.salesId }, { $set: obj })
                return res.json({ code: codes.success, message: messages.success })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async sales_CSV(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var arr = [];
            let sales = await salesModel.find({}).populate([{ path: 'businessId', select: 'firstName companyName' }, { path: 'productId', select: 'service' }]).sort({ 'createdAt': 1 })
            if (sales) {
                for (var i = 0; i < sales.length; i++) {
                    var createDte = moment(sales[i].createdAt).format()
                    var dte2 = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                    var createtym = moment(sales[i].createdAt).format('hh:mm a')
                    if(sales[i].product != null){
                        var product = sales[i].productId._id
                        var service = sales[i].productId.service
                    }else{
                        var product = 'N/A'
                        var service = 'N/A'
                    }
                    if(sales[i].businessId != null){
                        var businessName = sales[i].businessId.companyName
                        var businessId =  sales[i].businessId._id
                    }else{
                        var businessName = 'N/A'
                        var businessId = 'N/A'
                    }
                    var salesDetail = {
                        'tittle': sales[i].tittle,
                        'businessId': businessId,
                        'businessName': businessName,
                        'productId': product,
                        'productName':service,
                        'currency': sales[i].currency,
                        'comissionPercentage': sales[i].comissionPercentage,
                        'country': sales[i].country,
                        'countryCode': sales[i].countryCode,
                        'jobStatus': sales[i].jobStatus,
                        'saveAsDraft': sales[i].saveAsDraft,
                        'createdAt': dte2
                    }
                    arr.push(salesDetail)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async sales_CSVForDrafts(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var arr = [];
            let sales = await salesModel.find({ 'saveAsDraft': true }).populate([{ path: 'businessId', select: 'firstName' }, { path: 'productId', select: 'service' }]).sort({ 'createdAt': -1 })
            if (sales) {
                for (var i = 0; i < sales.length; i++) {
                    var createDte = moment(sales[i].createdAt).format()
                    var dte2 = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                    var updteDte = moment(sales[i].updatedAt).format()
                    var dte1 = (new Date(updteDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));

                    var draftDetail = {
                        'tittle': sales[i].tittle,
                        'businessId': sales[i].businessId._id,
                        'businessName': sales[i].businessId.firstName,
                        'productId': sales[i].productId._id,
                        'productName': sales[i].productId.service,
                        'currency': sales[i].currency,
                        'comissionPercentage': sales[i].comissionPercentage,
                        'country': sales[i].country,
                        'countryCode': sales[i].countryCode,
                        'saveAsDraft': sales[i].saveAsDraft,
                        'createdAt': dte2,
                        'updatedAt': dte1
                    }
                    arr.push(draftDetail)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async jobViewForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var chck = await salesModel.findOne({ '_id': req.body.salesId }).populate([{ path: 'businessId', select: 'companyName firstName' }, { path: 'productId', match: { _id: { $ne: null } } }, { path: 'sellingMethodId' },{ path:'sector' }, {
                path: 'avgSaleCycle', match: { _id: { $ne: null } }
            }, {
                path: 'experinceRequired', match: { _id: { $ne: null } }
            },{
            path: 'industryId', match: { _id: { $ne: null } }
            },
            {path: 'companySize', match: { _id: { $ne: null } }        }
        ])
            if (chck.sellingMethodId == null) {
                var selling = null
            } else {
                var selling = chck.sellingMethodId.prefferedSelling
            }
            if (chck.avgSaleCycle == null) {
                var sale = null
            } else {
                var sale = chck.avgSaleCycle.avgSaleCycle
            }
            if (chck.experinceRequired == null) {
                var exp = null
            } else {
                var exp = chck.experinceRequired.yearExperience
            }
            if (chck) {
                var obj = {
                    'tittle': chck.tittle,
                    'productDetail': chck.productDetail,
                    'price': chck.price,
                    'comissionPercentage': chck.comissionPercentage,
                    'payementTerms': chck.payementTerms,
                    'country': chck.country,
                    'documents': chck.documents,
                    'status': chck.status,
                    'jobStatus': chck.jobStatus,
                    'jobViews': chck.jobViews,
                    'totalProposal': chck.totalProposal,
                    'avgRating': chck.avgRating,
                    'businessId': chck.businessId.companyName,
                    'productId': chck.productId.service,
                    'sellingMethodId': selling,//.prefferedSelling,
                    'currency': chck.currency,
                    'avgSaleCycle': sale,//.avgSaleCycle,
                    'region': chck.region,
                    'sector': chck.sector,
                    'customQuestions': chck.customQuestions,
                    'experinceRequired': exp,//.yearExperience
                    'unique':chck.uniqueProposition,
                    'comissionDetail':chck.comissionDetail,
                    'companySize':chck.companySize,
                    'leadProvide':chck.leadProvided,
                    'document':chck.documents,
                    'draft':chck.saveAsDraft,
                    'avgDealValue':chck.avgDealValue,
                    'avgSaleCycle':chck.avgSaleCycle,
                    'industry':chck.industryId,
                    'exclusiveTerritories':chck.exclusiveTerritories

                }
                return res.json({ code: codes.success, message: messages.success, result: obj })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

}
module.exports = salesService;