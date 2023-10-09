var helpModel = require('../models/faq');
var questionModel = require('../models/askQuestionForSeeker')
var message = require('../codes/messages');
var codes = require('../codes/codes');
var moment = require('moment-timezone');


class FAQ {
    async AddFAQ(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata'
            if ( !req.body.question || !req.body.answer) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            
            var obj = {
                'question': req.body.question,
                'answer': req.body.answer,
                'language': req.body.lang,
                "createdAt": moment(new Date()).tz(timezone).format(),
            }
            let Faq = await new helpModel(obj).save();
            return res.json({ code: codes.success, message: messages.success, result: Faq });
        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

    async ShowAndSearchFAQ(req, res) {
        try {
            var messages = message.messages(req.header('language'))
          //  var adminId = req.obj.result.userId;
            var req_data = req.body;
            // if (!adminId) {
            //     return res.json({ code: codes.badRequest, message: messages.BadRequest });
            // }
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            if (req_data.search && req_data.search != null) {
                var obj = {
                    'question': { '$regex': req_data.search, '$options': 'i' },
                    'isActive': true
                }
            } else {
                var obj = { 'isActive': true }
            }
            let count = await helpModel.countDocuments(obj);
            let Faq = await helpModel.find(obj, { 'isActive': 0, 'createdAt': 0, 'updatedAt': 0 }).skip(perPage * (pageNo - 1)).limit(perPage);
            if (Faq) {
                return res.json({ code: codes.success, message: messages.success, result: Faq, total: count });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
            // }
        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

    async EditFAQ(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req. header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            if (!adminId || !req.body.faqId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let Faq = await helpModel.findOne({ '_id': req.body.faqId });
            if (Faq) {
                var obj = {
                    'question': req.body.question ? req.body.question : Faq.question,
                    'answer': req.body.answer ? req.body.answer : Faq.answer,
                    'updatedAt':moment().tz(timeZone).format()
                }
                let save = await helpModel.updateOne({ '_id': Faq._id }, { $set: obj });
                if (save) {
                    return res.json({ code: codes.success, message: messages.success });
                } else {
                    return res.json({ code: codes.success, message: messages.somethingWrong });
                }
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }

        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

    async DltFaq(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var adminId = req.obj.result.userId;
            if (!adminId || !req.body.faqId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let dlt = await helpModel.updateOne({ '_id': req.body.faqId }, { $set: { 'isActive': false } });
            if (dlt) {
                return res.json({ code: codes.success, message: messages.success });
            } else {
                return res.json({ code: codes.badRequest, message: messages.somethingWrong });
            }

        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

    async FaqDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var adminId = req.obj.result.userId;
            if (!adminId || !req.body.faqId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let Faq = await helpModel.findOne({ '_id': req.body.faqId });
            if (Faq) {
                return res.json({ code: codes.success, message: messages.success, result: Faq });
            } else {
                return res.json({ code: codes.badRequest, message: messages.somethingWrong });
            }

        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }

    async allFaqDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var adminId = req.obj.result.userId;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            if (!adminId ) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let Faq = await helpModel.find({'isActive':true });
            if (Faq) {
                return res.json({ code: codes.success, message: messages.success, result: Faq }).skip(perPage * (pageNo - 1)).limit(perPage);
            } else {
                return res.json({ code: codes.badRequest, message: messages.somethingWrong });
            }

        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }


    async addQuestionForSeeker(req, res) {
        try {
            var messages = message.messages(req.header('language'))
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            if ( !req.body.question || !userId || !req.body.salesId || !req.body.businessId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var obj = {
                'question': req.body.question,
                'salesId':req.body.salesId,
                'seekerId':userId,
                'businessId':req.body.businessId,
                "createdAt": moment(new Date()).tz(timezone).format(),
            }
            let ques = await new questionModel(obj).save();
            return res.json({ code: codes.success, message: messages.success, result: ques });
        } catch (error) {
            return res.json({ code: codes.serverError, message: error.message });
        }
    }
}




module.exports = FAQ