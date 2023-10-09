var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var salesSchema = ({
    tittle: {
        type: String,
        default: ''
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business'
    },
    productId: [{
         type: Schema.Types.ObjectId,
        ref: 'services'
    }],
    productDetail: {
        type: String,
        default: ''
    },
    uniqueProposition: {
        type: String,
        default: ''
    },
    sellingMethodId: [{
        type: Schema.Types.ObjectId,
        ref: 'prefferedSellings'
    }],
    prductGallary: {
        type: Array,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    },
    isNewService: {
        type: Boolean,
        default: true
    },
    currency: {
     //   type:String
         type: Schema.Types.ObjectId,
         ref: 'currencies'
    },
    price: {
        type: Number,
        default: 0
    },
    avgDealValue: {
        type:String
        // type: Schema.Types.ObjectId,
        // ref: 'averagedeals'
    },
    avgSaleCycle: {
        type: Schema.Types.ObjectId,
        ref: 'saleCycles'
    },
    repeatCustomerSpend: {
        type: Schema.Types.ObjectId,
        ref: 'customerSpends'
    },
    pageNo1:{
        type:Boolean,
        default:false
    },
    comissionPercentage: {
        type: Number,
        default: 0
    },
    comissionDetail: {
        type: String,
        default: ''
    },
    payementTerms: {
        type: String,
        default: ''
    },
    pageNo2:{
        type:Boolean,
        default:false
    },
    sector: {
        type: Schema.Types.ObjectId,
        ref: 'sectors'
    },
    industryId: {
        type: Schema.Types.ObjectId,
        ref: 'industries',//'client_industry_Business'
    },
    language: [{
        type: Schema.Types.ObjectId,
        ref: 'languages'
    }],
    worldWide:{
        type:Boolean,
        default:false
    },
    productSellarea: {
        type:Array
        // type: Schema.Types.ObjectId,
        // ref: 'sellAreas'
    },
    region: {
        type:String
        // type: Schema.Types.ObjectId,
        // ref: 'regions'
    },
    country: {
        type: String,
        default: ''
    },
    countryCode:{
        type:String
    },
    exclusiveTerritories: {
        type: Boolean,
        default: true
    },
    leadProvided: {
        type: Boolean,
        default: false
    },
    pageNo3:{
        type:Boolean,
        default:false
    },
    experinceRequired: {
        type: Schema.Types.ObjectId,
        ref: 'experiences'
    },
    industryExpRequired: {
        type: Boolean,
        default: false
    },
    customQuestions: [{
            question: {
                type: String,
                default:''
            }
        
    }],
    trainingNeed: {
        type: Boolean,
        default: false
    },
    documents: {
        type: String,
        default: ''
    },
    links: {
        type: String,
        default: ''
    },
    trainingName:{
        types:String
    },
    trainingDesc:{
        types:String
    },
    trainingStartDate:{
        types:Date
    },
    trainingEndDate:{
        type:Date
    },
    isTrainingMandatory: {
        type: Boolean,
        default: false
    },
    pageNo4:{
        type:Boolean,
        default:false
    },
    pageStatus: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: true
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    jobStatus: {
        type: String,
        default: 'Posted'
    },
    jobViews: {
        type: Number,
        default: 0
    },
    totalProposal: {
        type: Number,   
        default: 0
    },
    avgRating: {
        type: Number,
        default:0
    },
    saveAsDraft: {
        type: Boolean,
        default: false
    },
    closeDate: {
        type: Date
    },
    reusePost:{
        type:Boolean,
        default:false
    },
    withdrawPost:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }

});


module.exports = {
    salesModel: mongoose.model('Sales_Opportunity', salesSchema)
}