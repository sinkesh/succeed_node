var IndustryModel = require('../models/industry').IndustryModel;
var sectorModel = require('../models/industry').sectorModel;
var message = require('../codes/messages');
var codes = require('../codes/codes');

class IndustryServices {

    async getIndustries(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var userId = req.obj.result.userId;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            if(!userId){
                return res.json({code:codes.badRequest,message:messages.badRequest})
            }
            var Industry = await IndustryModel.find({})//.skip(perPage * (pageNo - 1)).limit(perPage);
            if (Industry && Industry.length) {
                return res.json({ code: codes.success, message: messages.success, result: Industry });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async AddIndustries(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var req_data = req.body;
            if (!req_data.name) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }

            var industry = await IndustryModel.findOne({ 'name': req_data.name });
            if (industry) {
                return res.json({ code: codes.badRequest, message: messages.AlreadyExists });
            } else {
                var data = {
                    'name': req_data.name,
                    'createdAt': new Date()
                }

                var addIndustry = await new IndustryModel(data).save();
                return res.json({ code: codes.success, message: messages.success,result:addIndustry });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getIndustryDetails(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var IndustryId = req.body.IndustryId;
            if (!IndustryId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }

            var Industry = await IndustryModel.findOne({ '_id': IndustryId });
            if (Industry) {
                return res.json({ code: codes.success, message: messages.success, result: Industry });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getSectors(req, res) {
        try {
            var messages = message.messages(req.header('language'));
             var userId = req.obj.result.userId;
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;
            if(!userId){
                return res.json({code:codes.badRequest,message:messages.badRequest})
            }
            var sectors = await sectorModel.find().skip(perPage * (pageNo - 1)).limit(perPage);
            if (sectors && sectors.length) {
                return res.json({ code: codes.success, message: messages.success, result: sectors });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async AddSector(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var req_data = req.body;
            if (!req_data.name) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }

            var sector = await sectorModel.findOne({ 'name': req_data.name });
            if (sector) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            } else {
                var data = {
                    'name': req_data.name,
                    'createdAt': new Date()
                }
                var addSector = await new sectorModel(data).save();
                return res.json({ code: codes.success, message: messages.success,result:addSector });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async SectorDetails(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var SectorId = req.body.sectorId;

            if (!SectorId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }

            var sector = await sectorModel.findOne({ '_id': SectorId });
            if (sector) {
                return res.json({ code: codes.success, message: messages.success, result: sector });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }
}

module.exports = IndustryServices;