var describeModel = require('../models/seekerDropDownList').describeModel;
var lookingModel = require('../models/seekerDropDownList').lookingModel;
var languageModel = require('../models/seekerDropDownList').languageModel;
var proficiencyModel = require('../models/seekerDropDownList').proficiencyModel;
var experienceModel = require('../models/seekerDropDownList').experienceModel;
var clientIndustryModel  = require('../models/seekerDropDownList').clientIndustryModel;
var clientIndustryBusinessModel  = require('../models/seekerDropDownList').clientIndustryBusinessModel;
var serviceModel = require('../models/seekerDropDownList').serviceModel;
var serviceBusinessModel = require('../models/seekerDropDownList').serviceBusinessModel;
var prefferedModel = require('../models/seekerDropDownList').prefferedModel;
var averageDealModel = require('../models/seekerDropDownList').averageDealModel;
var averageDealValueModel = require('../models/seekerDropDownList').averageDealValueModel;
var highestDegreeModel = require('../models/seekerDropDownList').highestDegreeModel;
//var trainingYearModel = require('../models/seekerDropDownList').trainingYearModel;
var sizeModel = require('../models/seekerDropDownList').sizeModel;
var functionModel = require('../models/seekerDropDownList').functionModel;
var seniorityModel = require('../models/seekerDropDownList').seniorityModel;
var regionModel = require('../models/seekerDropDownList').regionModel;
var currencyModel = require('../models/seekerDropDownList').currencyModel;
var repeatCustomerModel = require('../models/seekerDropDownList').repeatCustomerModel;
var continentModel = require('../models/seekerDropDownList').continentModel;
var operationYearModel = require('../models/seekerDropDownList').operationYearModel;
var revenueRangeModel = require('../models/seekerDropDownList').revenueRangeModel;
var companySizeModel = require('../models/seekerDropDownList').companySizeModel;
var customerModel = require('../models/seekerDropDownList').customerModel;
//var currencyModel = require('../models/seekerDropDownList').currencyModel;
var saleCycleModel = require('../models/seekerDropDownList').saleCycleModel;
var customerSpendModel = require('../models/seekerDropDownList').customerSpendModel;
var sellingAreaModel = require('../models/seekerDropDownList').sellingAreaModel;
var paymentModel = require('../models/seekerDropDownList').paymentModel;
var regionBusinessModel = require('../models/seekerDropDownList').regionBusinessModel;
var IndustryModel = require('../models/industry').IndustryModel;
var sectorModel = require('../models/industry').sectorModel;
var message = require('../codes/messages');
var codes = require('../codes/codes');
var methods = require('../methods/methods');
var moment = require('moment-timezone');
const industry = require('../models/industry');
var businessModel = require('../models/business').businessModel;
var IndustryModel = require('../models/industry').IndustryModel;

let xlsxtojson = require('xlsx-to-json');
let xlstojson = require("xls-to-json");
const multer = require('multer');

class dropDownService {
    async addDescribe(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.describe) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'describe': req_data.describe,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new describeModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allDescribeDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await describeModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addlooking(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.looking) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'looking': req_data.looking,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new lookingModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allLookingDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await lookingModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addlanguage(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.language) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'language': req_data.language,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new languageModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allLanguageDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await languageModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addproficiency(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.proficiency) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'proficiency': req_data.proficiency,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new proficiencyModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allProficiencyDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await proficiencyModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async addExperienceYear(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.yearExperience) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'yearExperience': req_data.yearExperience,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new experienceModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allExperienceYearDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await experienceModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async createIndustry(req, res) {
          try{
        var messages = message.messages(req.header('language'));
        let storage = multer.diskStorage({ //multers disk storage settings
            
            // destination: function (req, file, cb) {
            //     cb(null, '/home/tecorb/Documents/sales-succed/Backup File/sales succed file 10 march/sales-succeed-nodejs/salesFile.xlsx')
            // },            
            filename: function (req, file, cb) {
                console.log(file.originalname,"fdsaaaaaaaaaaa");
                const datetimestamp = Date.now();
                cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
            }
        });
       // console.log(file)
        let upload = multer({ storage: storage }).single('file');
        let excel2json;
        upload(req, res, function (err) {
             console.log(req.file, "hello")
            if (err) {
                res.json({ error_code: 401, err_desc: err });
                return;
            }
            if (!req.file) {
                res.json({ error_code: 404, err_desc: "File not found!" });
                return;
            }
             console.log("vvvv", req.file)
            if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
                excel2json = xlsxtojson;
            } else {
                excel2json = xlstojson;
            }

            //  code to convert excel data to json  format
            // console.log(req.file.path);
            excel2json({
                input: req.file.path,
                output: null, // output json 
                sheet: "Sheet1"
            }, async function (err, result) {
                 console.log('ccc');
                if (err) {
                    res.json(err);
                } else {
                    console.log(result.length);
                    // return res.json(result);
                    for(var i = 0; i < 213; i++ ){  
                        console.log(i);

            var req_data = {
                "clientIndForBusiness":result[i].Industry
   
            }
            var save = await new clientIndustryBusinessModel(req_data).save();
                console.log(save);
            }
        }
    })
        })

        }catch(error){
            console.log(error)
                  return res.json({ code: codes.serverError, message: error.message })
        }
    }
      

    async addClientIndustry(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.clientInd) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'clientInd': req_data.clientInd,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new clientIndustryModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allClientIndustry(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await IndustryModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }    

    async allClientIndustryBusiness(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
 
            var save = await clientIndustryBusinessModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addService(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.service) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'industryId':req_data.industryId,
                'service': req_data.service,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new serviceModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }



    async allServiceDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var industry = req_data.industry;
            var arr=[];
            // var perPage = req_data.perPage ? req_data.perPage : 10
            // var pageNo = req_data.pageNo ? req_data.pageNo : 1  
            if(industry && industry.length){ 
            for(var i=0;i<industry.length;i++){
            var save = await serviceModel.find({'industryId':industry[i]})//.skip(perPage * (pageNo - 1)).limit(perPage);
            arr.push(save)
        }
            if (save) {
                return res.json({ code: codes.success, message: messages.success, result: arr })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        }else{
            return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })

        }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allServiceDetailBusiness(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var industry = req_data.industry;
            var arr=[];
            // var perPage = req_data.perPage ? req_data.perPage : 10
            // var pageNo = req_data.pageNo ? req_data.pageNo : 1  
            if(industry && industry.length){ 
            for(var i=0;i<industry.length;i++){
            var save = await serviceBusinessModel.find({'industryBusiness':industry[i]})//.skip(perPage * (pageNo - 1)).limit(perPage);
            arr.push(save)
        }
            if (save) {
                return res.json({ code: codes.success, message: messages.success, result: arr })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        }else{
            return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })

        }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allServiceDetailBusinessForIndustryNetwork(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var industryNetwork = req_data.industryNetwork;
            var arr=[];
            // var perPage = req_data.perPage ? req_data.perPage : 10
            // var pageNo = req_data.pageNo ? req_data.pageNo : 1  
            if(industryNetwork && industryNetwork.length){ 
            for(var i=0;i<industryNetwork.length;i++){
            var save = await serviceBusinessModel.find({'industryBusiness':industryNetwork[i]})//.skip(perPage * (pageNo - 1)).limit(perPage);
            arr.push(save)
        }
            if (save) {
                return res.json({ code: codes.success, message: messages.success, result: arr })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        }else{
            return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })

        }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allServiceDetailForBusiness(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var chck = await businessModel.findOne({'_id':userId})
        
            var save = await serviceModel.find({'industryId':chck.industry})//.skip(perPage * (pageNo - 1)).limit(perPage);
   
            if (save) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allServiceDetailForBusinessChange(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var chck = await businessModel.findOne({'_id':userId})
        
            var save = await serviceModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
   
            if (save) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allServiceDetailForFilter(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var userId = req.obj.result.userId;
            var req_data = req.body;
        
            var save = await serviceModel.find({'industryId':req_data.industry})//.skip(perPage * (pageNo - 1)).limit(perPage);
   
            if (save) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async addPrefferedSelling(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.prefferedSelling) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'prefferedSelling': req_data.prefferedSelling,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new prefferedModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allPrefferedSellingDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            if (req_data.search && req_data.search != null) {
                var obj_data = {
                 'prefferedSelling': { '$regex': req_data.search, '$options': 'i' }  //, { 'jobStatus': 'Active' }]
                }
            }else{
                var obj_data = {}
            }
            var save = await prefferedModel.find(obj_data).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async addAverageDeal(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.averagedeal) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'averagedeal': req_data.averagedeal,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new averageDealModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allAverageDealDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await averageDealModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addAverageDealValue(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.averagedealValue) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'averagedealValue': req_data.averagedealValue,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new averageDealValueModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allAverageDealValueDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await averageDealValueModel.find({}).sort({'createdAt':-1}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async addHighestDegree(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.highestDegree) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'highestDegree': req_data.highestDegree,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new highestDegreeModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allHighestDegreeDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await highestDegreeModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }





    async addSize(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.size) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'size': req_data.size,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new sizeModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allSizeDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await sizeModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addFunction(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.function) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'function': req_data.function,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new functionModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: message.messages.serverError })
        }
    }

    async allFunctionDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await functionModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addSeniority(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.seniority) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'seniority': req_data.seniority,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new seniorityModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allSeniorityDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await seniorityModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }

        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addRegion(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.region) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'region': req_data.region,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new regionModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allRegionDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await regionModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addCurrency(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.currency) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'currency': req_data.currency,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new currencyModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allCurrencyDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await currencyModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addRepeatCustomerSpend(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.customerSpend) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'customerSpend': req_data.customerSpend,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new repeatCustomerModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async allRepeatCustomerSpend(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            
            var save = await repeatCustomerModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addContinentDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
         
            if (!adminId || !req_data.continent) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'continent': req_data.continent,
                'country':req_data.country,
                'createdAt': moment().tz(timeZone).format()
            }
            var chck = await continentModel.findOne({'continent':req_data.continent})
            if(chck){
                return res.jon({code:codes.badRequest,message:messages.AlreadyExists})
            }else{
            var save = await new continentModel(obj_data).save();
            if (save) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allContinentDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            // if(req_data.countryName && req_data.countryName !=''){
            // var save = await continentModel.find({'country':req_data.countryName}).skip(perPage * (pageNo - 1)).limit(perPage);
            // }else{
                var save = await continentModel.find({}).sort({'continent':1}).skip(perPage * (pageNo - 1)).limit(perPage);
         //   }
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allCountryDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var save = await continentModel.findOne({'continent':req_data.continentId}).sort({'country':1})
            if (save ) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allContinentDetailForSelectedCountry(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            if(req_data.countryName && req_data.countryName !=''){
            var save = await continentModel.find({'country':req_data.countryName}).skip(perPage * (pageNo - 1)).limit(perPage);
            }else{
                var save = await continentModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            }
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    /////

    async addOperationYear(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.operationYear) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'operationYear': req_data.operationYear,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new operationYearModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async allOperationYear(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await operationYearModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addRevenueRange(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.range) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'range': req_data.range,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new revenueRangeModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async allRevenueRange(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await revenueRangeModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addCompanySize(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.size) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'size': req_data.size,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new companySizeModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async allCompanySize(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await companySizeModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addNumOfCustomer(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.numOfCustomer) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'numOfCustomer': req_data.numOfCustomer,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new customerModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async allNumOfCustomer(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            if(!adminId){
                return res.json({code:codes.badRequest,message:messages.BadRequest})
            }
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await customerModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }



    async addAverageSaleCycle(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.avgSaleCycle) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'avgSaleCycle': req_data.avgSaleCycle,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new saleCycleModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async allAverageSaleCycle(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await saleCycleModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addCustomerSpend(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.customerSpend) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'customerSpend': req_data.customerSpend,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new customerSpendModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async allCustomerSpend(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await customerSpendModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async addSellingArea(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.sellingArea) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'sellingArea': req_data.sellingArea,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new sellingAreaModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allSellingAreaDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await sellingAreaModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addPaymentOption(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.paymentTime) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'paymentTime': req_data.paymentTime,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new paymentModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allPaymentOptionDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await paymentModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async addRegionForBusiness(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            if (!adminId || !req_data.regionBusiness) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest })
            }
            var obj_data = {
                'regionBusiness': req_data.regionBusiness,
                'createdAt': moment().tz(timeZone).format()
            }
            var save = await new regionBusinessModel(obj_data).save();
            return res.json({ code: codes.success, message: messages.success, result: save })
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async allRegionForBusinessDetail(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var save = await regionBusinessModel.find({}).skip(perPage * (pageNo - 1)).limit(perPage);
            if (save && save.length) {
                return res.json({ code: codes.success, message: messages.success, result: save })
            } else {
                return res.json({ code: codes.badRequest, message: messages.BadRequest, result: [] })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async filterForBusinessDropDown(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
            var Industry = await IndustryModel.find();//.skip(perPage * (pageNo - 1)).limit(perPage);
            var sectors = await sectorModel.find();//.skip(perPage * (pageNo - 1)).limit(perPage);
            var save = await serviceModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
            var sale = await saleCycleModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
            var exp = await experienceModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
            var lang = await languageModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
            var region = await continentModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
            return res.json({code:codes.success,message:messages.success,industry:Industry,sector:sectors,serviceDetail:save,averageSale:sale,
            experienceDetail:exp,languageDetail:lang,regionDetail:region });
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:message.messages.serverError})
        }
    }

    async filterForSeekerDropDown(req,res){
        try{
            var messages = message.messages(req.header('language'));
            var req_data = req.body;
            var perPage = req_data.perPage ? req_data.perPage : 10
            var pageNo = req_data.pageNo ? req_data.pageNo : 1
           var Industry = await IndustryModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
           var sectors = await sectorModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
           var save = await serviceModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
           var exp = await experienceModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
           var lang = await languageModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
           var region = await continentModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
           var dealDetail = await averageDealModel.find({});//.skip(perPage * (pageNo - 1)).limit(perPage);
            return res.json({code:codes.success,message:messages.success,industry:Industry,sector:sectors,serviceDetail:save,
            experienceDetail:exp,languageDetail:lang,regionDetail:region,dealDetail:dealDetail,serviceDetail:save });
        }catch(error){
            console.log(error)
            return res.json({code:codes.serverError,message:message.messages.serverError})
        }
    }

    async changeDAta(req,res){
        var a = await serviceBusinessModel.find();
for(var i=0; i<a.length; i++){
    console.log(a[i]._id,"xwx")
var service = a[i].service.replace("|", " | ");
var updateservice = await serviceBusinessModel.updateOne({'service':a[i].service},{$set:{'service':service}});
//console.log(updateservice)
}
    }
}
module.exports = dropDownService