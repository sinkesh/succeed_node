var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subScriptionSchema = Schema({
    title: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    subsType:{
        type:String
    },
    desc: {
        type: String,
        defautl: ''
    },
    status: {
        type: String,
        default: 'Active'
    },
    freeDays:{
        type:Number,
        default:0
    },
    duration: {
        type: Date,
        default: ''
    },
    updatedAt: {
        type: Date
    },
    createdAt: {
        type: Date
    }
});

var busSubScriptionSchema = Schema({
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business'
    },
    subScriptionId: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions'
    },
    title: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    durationDate: {
        type: Date,
        default: ''
    },
    desc: {
        type: String,
        default: ''
    },
    busDuration: {
        type: String,
        default: ''
    },
    subStatus:{
        type:Boolean,
        default:true
    },
    subsType:{
        type:String
    },
    status: {
        type: String,
        default: 'Active'
    },
    renewed:{
        type:Date
    },
    createdAt: {
        type: Date
    }
});

module.exports = {
    subscriptionModel: mongoose.model('subscriptions', subScriptionSchema),
    busSubScriptionModel: mongoose.model('business_subscriptions', busSubScriptionSchema)
}