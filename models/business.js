var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var businessSchema = Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    socialId:{
        type:String
    },
    socialType:{
        type:String
    },
    companyName: {
        type: String,
        default: ''
    },
    socialType: {
        type: String,
        default: 'n' // g for google,l for linkedin
    },
    profilePer: {
        type: Number,
        default: 0
    },
    emailVerify: {
        type: Boolean,
        default: false
    },
    industry: {
        type: Schema.Types.ObjectId,
        ref: 'industries'//'industries'
    },
    sector: {
        type: Schema.Types.ObjectId,
        ref: 'sectors'
    },
    businessNumber: {
        type: String,
        default: ''
    },
    countryCode:{
        type:String,
        default:''
    },
    city:{
        type:String,
        default:''
    },
    country:{
        type:String,
        default:''
    },
    businessActivity: {
        type: String,
        default: ''
    },
    operationYear:{
        type:Number
    },
    // operationYear: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'operationYears'
    // },
    subscriptionId: [
        {
            type: Schema.Types.ObjectId,
            ref: ''
        }
    ],
    range: {
        type: Schema.Types.ObjectId,
        ref: 'revenueRanges'
    },
    companySize: [{
        //type: String,
        type: Schema.Types.ObjectId,
        ref: 'companySizes'
    }],
    numOfCustomer: {
       // type:String,
        type: Schema.Types.ObjectId,
        ref: 'numOfCustomers'
    },
    subscriptionTaken:{
        type:Boolean,
        default:false
    },
    subscriptionStatus:{
        type:String,
        default:'Deactive'
    },
    webUrl: {
        type: String,
        default: ''
    },
    linkedinUrl: {
        type: String,
        default: ''
    },
    blogUrl: {
        type: String,
        default: ''
    },
    uniqueId:{
        type:String
    },
    signupProgressBar:{
        type:String,
        default:'step1'
    },
    emailVerify:{
        type:Boolean,
        default:false
    },
    image: {
        type: String,
        default: ''
    },
    avgRating:{
        type:Number,
        default:0
    },
    type:{type:String},
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date
    }
});

var sessionSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    token: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date
    }
});

module.exports = {
    businessModel: mongoose.model('business', businessSchema),
    sessionModel: mongoose.model('sessions', sessionSchema)
}
