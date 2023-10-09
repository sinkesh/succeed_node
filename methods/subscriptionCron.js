const cron = require('node-cron');
var businessModel = require('../models/business').businessModel;
var busSubScriptionModel = require('../models/subscription').busSubScriptionModel;

const moment= require('moment-timezone');


cron.schedule('0 0 * * * ', async()=> {
    console.log('subscription Cron Job');
    var subs = await busSubScriptionModel.find({})
    if(subs && subs.length ){
        for (var i = 0; i < subs.length; i++) {
            var duration= moment(subs[i].durationDate).format('YYYY-MM-DD');
            var date = moment(new Date()).format('YYYY-MM-DD');
            if(duration <= date){
                await busSubScriptionModel.updateOne({'_id':subs[i]._id},{$set:{'subStatus':false}})
              var x =   await businessModel.updateOne({'_id': subs[i].businessId},{$set: {'subscriptionStatus': 'Deactive'}});
            }
            
        }
    }
});