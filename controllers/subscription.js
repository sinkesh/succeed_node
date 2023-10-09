var subScriptionModel = require('../models/subscription').subscriptionModel;
var busSubScriptionModel = require('../models/subscription').busSubScriptionModel;
var businessModel = require('../models/business').businessModel;
var message = require('../codes/messages');
var codes = require('../codes/codes');
var moment = require('moment');
var ObjectId = require('objectid')

class Subscription_Service {
    async addSubScription(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            if (!req_data.price || !req_data.title || !req_data.duration) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var data = {
                'title': req_data.title,
                'price': req_data.price,
                'desc': req_data.desc,
                'subsType': req_data.subsType,
                'freeDays': req_data.freeDays,
                'duration': req_data.duration,
                'createdAt': new Date()
            }
            var addSubScription = await new subScriptionModel(data).save();
            return res.json({ code: codes.success, message: messages.success, result: addSubScription });
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getAllSubScription(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var pageNo = req.body.pageNo ? req.body.pageNo : 1;
            var perPage = req.body.perPage ? req.body.perPage : 10;

            let subscriptions = await subScriptionModel.find({ 'status': 'Active' }).skip(perPage * (pageNo - 1)).limit(perPage);
            if (subscriptions && subscriptions.length) {
                return res.json({ code: codes.success, message: messages.success, result: subscriptions });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }

        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });

        }
    }

    async updateSubScription(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var subscriptionId = req.body.subscriptionId;

            if (!subscriptionId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }

            let subscription = await subScriptionModel.findOne({ '_id': subscriptionId });
            if (subscription) {
                var updatedData = {
                    'title': req.body.title ? req.body.title : subscription.title,
                    'price': req.body.price ? req.body.price : subscription.price,
                    'desc': req.body.desc ? req.body.desc : subscription.desc,
                    'duration': req.body.duration ? req.body.duration : subscription.duration,
                    'updatedAt': new Date()
                }
                let update = await subScriptionModel.updateOne({ '_id': subscriptionId }, { $set: updatedData });
                return res.json({ code: codes.success, message: messages.success });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async updateSubScriptionStatusForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var subScriptionId = req.body.subScriptionId;
            var status = req.body.status;
            if (!subScriptionId || !status) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            let subScription = await subScriptionModel.findOne({ '_id': subScriptionId });
            if (subScription) {
                let updateStatus = await subScriptionModel.updateOne({ '_id': subScriptionId }, { $set: { 'status': status } });
                return res.json({ code: codes.success, message: messages.success });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async addBusSubscription(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata'
            var req_data = req.body;
            console.log(req_data)
            if (!req_data.businessId || !req_data.subScriptionId || !req_data.title || !req_data.price || !req_data.desc || !req_data.durationDate || !req_data.busDuration) {
                
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var chck = await busSubScriptionModel.findOne({ 'businessId': req_data.businessId })
            if (chck) {
                return res.json({ code: codes.badRequest, message: messages.AlreadyExists })
            } else {
                var sub = await subScriptionModel.findOne({ '_id': req_data.subScriptionId })
                var data = {
                    'businessId': req_data.businessId,
                    'subScriptionId': req_data.subScriptionId,
                    'subsType': sub.subsType,
                    'title': req_data.title,
                    'price': sub.price,
                    'desc': req_data.desc,
                    'durationDate': req_data.durationDate,
                    'busDuration': req_data.busDuration,
                    'createdAt': new Date()
                }
            }
            let add = await new busSubScriptionModel(data).save();
            await businessModel.updateOne({ '_id': req_data.businessId }, { $set: { 'subscriptionTaken': true, 'subscriptionStatus': 'Active' } })
            return res.json({ code: codes.success, message: messages.success, result: add });
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async getBusSubscription(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var businessId = req.obj.result.userId;
            if (!businessId) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var subscription = await busSubScriptionModel.findOne({ 'businessId': businessId });
            if (subscription) {
                return res.json({ code: codes.success, message: messages.success, result: subscription });
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async updateBusSubscriptionStatus(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var busSubScriptionId = req.body.busSubScriptionId;
            var status = req.body.status;

            if (!busSubScriptionId || !status) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }

            let busSubscription = await busSubScriptionModel.findOne({ '_id': busSubScriptionId });
            if (busSubscription) {
                   await busSubScriptionModel.updateOne({'_id':busSubScriptionId},{$set:{'status':status}});
                   return res.json({code:codes.success,message:messages.success})
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async renewSubscription(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata'
            var busSubScriptionId = req.body.busSubScriptionId;
            var date = req.body.renewDate;
            if (!busSubScriptionId || !date) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var dte = moment(new Date(date)).tz(timeZone).format();
            let busSubscription = await busSubScriptionModel.findOne({ '_id': busSubScriptionId,'subsType':'yearly' });
            if (busSubscription) {
                   await busSubScriptionModel.updateOne({'_id':busSubScriptionId},{$set:{'renewed':dte}});
                   return res.json({code:codes.success,message:messages.success})
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound });
            }
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }
    ///////////  Admin Listing Api's///////

    async newSubscriptionList(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var perPage = req.body.perPage ? req.body.perPage : 10
            var pageNo = req.body.pageNo ? req.body.pageNo : 1
            var arr = []
            var chck = await busSubScriptionModel.find({}).sort({ 'createdAt': -1 }).populate([{ path: 'businessId', select: 'firstName businessNumber' }]).skip(perPage * (pageNo - 1)).limit(perPage);
            if (chck && chck.length) {
                for (var i = 0; i < chck.length; i++) {
                    var createDte = moment(chck[i].createdAt).format()
                    var dte = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                    var data_obj = {
                        'businessId': chck[i].businessId,
                        'subScriptionId': chck[i].subScriptionId,
                        'title': chck[i].title,
                        'price': chck[i].price,
                        'desc': chck[i].desc,
                        'durationDate': chck[i].durationDate,
                        'busDuration': chck[i].busDuration,
                        'createdAt': dte
                    }
                    arr.push(data_obj)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async endSubscriptionList(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var adminId = req.obj.result.userId;
            var arr = []
            var chck = await busSubScriptionModel.find({ 'subStatus': true }).sort({ 'createdAt': -1 })//.populate([{path:'businessId', select:'firstName'}]).skip(perPage * (pageNo-1)).limit(perPage);
            if (chck && chck.length) {
                for (var i = 0; i < chck.length; i++) {
                    var dte1 = moment(new Date()).tz(timeZone).format()
                    var dte2 = moment(chck[i].durationDate).tz(timeZone).format()
                    if (dte1 <= dte2) {
                        var x = new Date(dte1)
                        var y = new Date(dte2)
                        var createDte = moment(chck[i].durationDate).format()
                        var dte = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));
                        var diffTime = Math.abs(y - x);
                        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        var data_obj = {
                            'businessId': chck[i].businessId,
                            'subScriptionId': chck[i].subScriptionId,
                            'title': chck[i].title,
                            'price': chck[i].price,
                            'desc': chck[i].desc,
                            'durationDate': dte,
                            'busDuration': chck[i].busDuration,
                            'daysLeft': diffDays,
                            'createdAt': chck[i].createdAt
                        }
                        arr.push(data_obj)
                    }
                }
                function compare(a, b) {
                    if (a.daysLeft < b.daysLeft) {
                        return -1;
                    }
                    if (a.daysLeft > b.daysLeft) {
                        return 1;
                    }
                    return 0;
                }
                arr.sort(compare);

                function page({ arr, pageSize, pageNumber }) {
                    const start = pageSize * (pageNumber - 1)
                    const end = pageSize * pageNumber
                    return {
                        *[Symbol.iterator]() {
                            for (let i = start; i < arr.length && i < end; i++) {
                                yield arr[i]
                            }
                        }
                    }
                }

                var all_data = ([...page({ arr, pageSize: 2, pageNumber: 1 })])
                return res.json({ code: codes.success, message: messages.success, result: all_data })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }

    async adminDashboardBookingCount(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            if(!req.body.type){
                return res.json({code:codes.badRequest,message:messages.BadRequest})
            }
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            if (req.body.type == 'Weekly') {
                var date1 = moment(new Date()).subtract(7, 'days').tz(timezone).format();
                var date2 = moment(new Date()).subtract(0, 'days').add(1, 'days').tz(timezone).format();
            } else if (req.body.type == 'Monthly') {
                var date1 = moment(new Date()).subtract(1, 'months').tz(timezone).format();
                var date2 = moment(new Date()).subtract(0, 'days').add(1, 'days').tz(timezone).format();
            } else  {
                var date1 = moment(new Date()).subtract(1, 'years').tz(timezone).format();
                var date2 = moment(new Date()).subtract(0, 'days').add(1, 'days').tz(timezone).format();
            }
                // } else {
            //     var date1 = moment(new Date()).subtract(3, 'months').tz(timezone).format();
            //     var date2 = moment(new Date()).subtract(0, 'days').add(1, 'days').tz(timezone).format();
            // }

            var d1 = moment(date1);
            var d2 = moment(date2);
            var lastyear = new Date(new Date().getFullYear() - 1, 0, 1);
            var start = (new Date(lastyear.getFullYear(), 0, 1));
            var end = (new Date(lastyear.getFullYear(), 11, 31))
            var date3 = moment(start).tz(timezone).format();
            var date4 = moment(end).tz(timezone).format();
            var d3 = moment(date3);
            var d4 = moment(date4);
            let lastYearEarn = await busSubScriptionModel.aggregate([
                { $match: { 'createdAt': { $gte: new Date(d3.year(), d3.month(), d3.date()), $lt: new Date(d4.year(), d4.month(), d4.date()) } } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    }
                },
            ]);
            if (lastYearEarn.length == 0) {
                var lastYearEar = 0
            } else {
                var lastYearEar = lastYearEarn[0].count
            }
            var totldata = await busSubScriptionModel.countDocuments({ 'createdAt': { $gte: new Date(d1.year(), d1.month(), d1.date()), $lt: new Date(d2.year(), d2.month(), d2.date()) } })
            let count1 = await busSubScriptionModel.aggregate([
                { $match: { 'createdAt': { $gte: new Date(d1.year(), d1.month(), d1.date()), $lt: new Date(d2.year(), d2.month(), d2.date()) } } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (count1.length == 0) {
                var earn = 0
            } else {
                var earn = count1[0].total
            }
            var obj_data = {
                'totalSubscription': totldata,
                'totalEarning': earn,
                'lastYearEarn':lastYearEar
            }
            return res.json({ code: codes.success, message: messages.success, result: obj_data });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }


    async allSubscriptionList(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var pageNo = req.body.pageNo ? req.body.pageNo : 1
            var perPage = req.body.perPage ? req.body.perPage : 10
            var req_data = req.body;
            if (req_data.search && req_data.search != null) {
                var obj_data = {
                    'title': { '$regex': req_data.search, '$options': 'i' } //}, { 'jobStatus': 'Active' }] , { 'jobStatus': 'Active' }]

                }
            } else {
                var obj_data = {}
            }
            var cout = await subScriptionModel.countDocuments(obj_data)
            var allSubs = await subScriptionModel.find(obj_data).sort({ 'createdAt': -1 }).skip(perPage * (pageNo - 1)).limit(perPage);
            if (allSubs && allSubs.length) {
                return res.json({ code: codes.success, message: messages.success, result: allSubs, Total: cout })
            } else {
                return res.json({ code: codes.badRequest, message: messages.notFound })
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError })
        }
    }


    async subscriptionCSV(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var arr = [];
            let subs = await subScriptionModel.find({}).sort({ 'createdAt': -1 })
            if (subs) {
                for (var i = 0; i < subs.length; i++) {
                    var createDte = moment(subs[i].createdAt).format()
                    var dte2 = (new Date(createDte).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3'));

                    var createtym = moment(subs[i].createdAt).format('hh:mm a')


                    var subdetail = {
                        'title': subs[i].title,
                        'price': subs[i].price,
                        'status': subs[i].status,
                        'createddAt': createtym + ' ' + dte2,
                        'duration': subs[i].duration,
                        'desc': subs[i].desc,

                    }
                    arr.push(subdetail)
                }
                return res.json({ code: codes.success, message: messages.success, result: arr });
            }
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }


    async earningForAdmin(req, res) {
        try {
            var messages = message.messages(req.header('language'));
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var lastyear = new Date(new Date().getFullYear() - 1, 0, 1);
            var start = (new Date(lastyear.getFullYear(), 0, 1));
            var end = (new Date(lastyear.getFullYear(), 11, 31))
            var date1 = moment(start).tz(timezone).format();
            var date2 = moment(end).tz(timezone).format();
            var d1 = moment(date1);
            var d2 = moment(date2);
            let totlEarn = await busSubScriptionModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (totlEarn.length == 0) {
                var totlEar = 0
            } else {
                var totlEar = totlEarn[0].total
            }
            let lastYearEarn = await busSubScriptionModel.aggregate([
                { $match: { 'createdAt': { $gte: new Date(d1.year(), d1.month(), d1.date()), $lt: new Date(d2.year(), d2.month(), d2.date()) } } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (lastYearEarn.length == 0) {
                var lastYearEar = 0
            } else {
                var lastYearEar = lastYearEarn[0].total
            }
            let monthlySubs = await busSubScriptionModel.aggregate([
                { $match: { 'subsType': 'monthly' } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (monthlySubs.length == 0) {
                var monthlySub = 0
            } else {
                var monthlySub = monthlySubs[0].total
            }
            let yearlySubs = await busSubScriptionModel.aggregate([
                { $match: { 'subsType': 'yearly' } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (yearlySubs.length == 0) {
                var yearlySub = 0
            } else {
                var yearlySub = yearlySubs[0].total
            }
            let premiumSubs = await busSubScriptionModel.aggregate([
                { $match: { 'subsType': 'premium' } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (premiumSubs.length == 0) {
                var premiumSub = 0
            } else {
                var premiumSub = premiumSubs[0].total
            }
            console.log(typeof(lastYearEar))
            var expect = lastYearEar*40/100;
           
            var obj_data = {
                'totalEarning': totlEar,
                'expectedThisYear':expect,
                'expectedThisMonth':expect,
                'lastYearEarn': lastYearEar,
                'monthlySubs': monthlySub,
                'yearlySubs': yearlySub,
                'premiumSubs': premiumSub

            }
            return res.json({ code: codes.success, message: messages.success, result: obj_data });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }

    }


    async adminDashboardGraph(req, res) {
        try {

            var messages = message.messages(req.header('language'));
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata'
      
          const  labels1= ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

            var date1 = moment(new Date()).subtract(1, 'year').tz(timezone).format('YYYY-MM-DD');
       
                var typeA = [];
                var typeB = [];
                var month = [];
                var earnTypeA =[];
                var earnTypeB =[];
               

                var d5 = moment(date1);
                var subs = await subScriptionModel.find({})
                for(var i = 0;i<12;i++){
                 var date1 = moment(d5).add(i, 'month').tz(timezone).format();
                 var date2 = moment(d5).add(i+1,'month').tz(timezone).format();
                 var date3 = moment(date1).format('MMM/YYYY');
                 var d1 = moment(date1);
                 var d2 = moment(date2);
                 var type1 = await busSubScriptionModel.aggregate([
                    { $match:{$and: [{ 'subScriptionId': ObjectId(subs[0]._id)},{ 'createdAt': { $gte: new Date(d1.year(), d1.month(), d1.date()), $lt: new Date(d2.year(), d2.month(), d2.date()) } }]} },
                    {
                        $group: {
                            _id: null,
                            count:{$sum:1},
                            total: { $sum: "$price" }
                        }
                    },
                ]);
                if (type1.length == 0) {
                    var A = 0
                    var B = 0
                } else {
                    var A = type1[0].total
                    var B = type1[0].count
                }
                var type2= await busSubScriptionModel.aggregate([
                    { $match:{$and: [{ 'subScriptionId': ObjectId(subs[1]._id)},{ 'createdAt': { $gte: new Date(d1.year(), d1.month(), d1.date()), $lt: new Date(d2.year(), d2.month(), d2.date()) } }]} },
                    {
                        $group: {
                            _id: null,
                            count:{$sum:1},

                            total: { $sum: "$price" }
                        }
                    },
                ]);
                if (type2.length == 0) {
                    var C = 0
                    var D = 0
                } else {
                    var C = type2[0].count
                    var D = type2[0].total
                }
       
                typeA.push(B)
                typeB.push(C)
                month.push(date3)
                earnTypeA.push(A)
                earnTypeB.push(D)
            }
        
            return res.json({ code: codes.success, message: messages.success, data1: month, data2: typeA , data3 :typeB,earnTypeA:earnTypeA , earnTypeB:earnTypeB });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }

    }


    async adminEarningPieChart (req, res) {
        try {
            var messages = message.messages(req.header('language'));
            if(!req.body.type){
                return res.json({code:codes.badRequest,message:messages.BadRequest})
            }
            var timezone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            if (req.body.type == 'Weekly') {
                var date1 = moment(new Date()).subtract(7, 'days').tz(timezone).format();
                var date2 = moment(new Date()).subtract(0, 'days').add(1, 'days').tz(timezone).format();
            } else if (req.body.type == 'Monthly') {
                var date1 = moment(new Date()).subtract(1, 'months').tz(timezone).format();
                var date2 = moment(new Date()).subtract(0, 'days').add(1, 'days').tz(timezone).format();
            } else if(req.body.type  == 'OverAll') {
              //  var date1 = moment(new Date()).subtract(3, 'months').tz(timezone).format();
                var date2 = moment(new Date()).subtract(0, 'days').add(1, 'days').tz(timezone).format();
            //}
            } else {
                var date1 = moment(new Date()).subtract(1, 'years').tz(timezone).format();
                var date2 = moment(new Date()).subtract(0, 'days').add(1, 'days').tz(timezone).format();
            }

            var d1 = moment(date1);
            var d2 = moment(date2);

            var subs = await subScriptionModel.find({})
           if(req.body.type !="OverAll"){
            var typeA = await busSubScriptionModel.aggregate([
                { $match:{$and: [{ 'subScriptionId': ObjectId(subs[0]._id)},{ 'createdAt': { $gte: new Date(d1.year(), d1.month(), d1.date()), $lt: new Date(d2.year(), d2.month(), d2.date()) } }]} },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (typeA.length == 0) {
                var A = 0
            } else {
                var A = typeA[0].total
            }
            var typeB = await busSubScriptionModel.aggregate([
                { $match:{$and: [{ 'subScriptionId': ObjectId(subs[1]._id)},{ 'createdAt': { $gte: new Date(d1.year(), d1.month(), d1.date()), $lt: new Date(d2.year(), d2.month(), d2.date()) } }]} },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (typeB.length == 0) {
                var B = 0
            } else {
                var B = typeB[0].total
            }
        }else{
            var typeA = await busSubScriptionModel.aggregate([
                { $match:{$and: [{ 'subScriptionId': ObjectId(subs[0]._id)},{ 'createdAt': { $lt: new Date(d2.year(), d2.month(), d2.date()) } }]} },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (typeA.length == 0) {
                var A = 0
            } else {
                var A = typeA[0].total
            }
            var typeB = await busSubScriptionModel.aggregate([
                { $match:{$and: [{ 'subScriptionId': ObjectId(subs[1]._id)},{ 'createdAt': { $lt: new Date(d2.year(), d2.month(), d2.date()) } }]} },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                },
            ]);
            if (typeB.length == 0) {
                var B = 0
            } else {
                var B = typeB[0].total
            }
        }
            var obj_data = {
                'typeA_Subscription': A,
                'typeB_Subscription': B
                //'lastYearEarn':lastYearEar
            }
            return res.json({ code: codes.success, message: messages.success, result: obj_data });
        } catch (error) {
            console.log(error)
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }

    async addSubScription_ForAdmin(req,res) {
        try {
            var messages = message.messages(req.header('language'));
            var timeZone = req.header('timezone') ? req.header('timezone') : 'asia/kolkata';
            var req_data = req.body;
            if (!req_data.price || !req_data.title || !req_data.duration) {
                return res.json({ code: codes.badRequest, message: messages.BadRequest });
            }
            var data = {
                'title': req_data.title,
                'price': req_data.price,
                'desc': req_data.desc,
                'subsType': req_data.subsType,
                'freeDays': req_data.freeDays,
                'duration': req_data.duration,
                'createdAt': moment().tz(timeZone).format()
            }
            var addSubScription = await new subScriptionModel(data).save();
            return res.json({ code: codes.success, message: messages.success, result: addSubScription });
        } catch (error) {
            console.log(error);
            return res.json({ code: codes.serverError, message: messages.serverError });
        }
    }
}

module.exports = Subscription_Service;