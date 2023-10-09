var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var offerSection = Schema({
    
    seekerId:{
        type:Schema.Types.ObjectId,
        ref :'seekers'
    },
    salesId: {
        type:Schema.Types.ObjectId,
        ref :'Sales_Opportunity'
    },
    businessId: {
        type:Schema.Types.ObjectId,
        ref :'business'
    },
    isApplied:{
        type:Boolean,
        default:false
    },
    appliedDate:{
        type:Date
    },
    offerLetterId:{
        type:Schema.Types.ObjectId,
        ref:'hires'
    },
    sendOfferLetter:{
        type:Boolean,
        default:false
    },
    sendOfferLetterDate:{
        type:Date
    },
    offerAccept:{
        type:Boolean,
        default:false
    },
    acceptDate:{
        type:Date
    },
    offerDecline:{
        type:Boolean,
        default:false
    },
    declineDate:{
        type:Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: ''
    },
    createdAt: {
        type: Date

    }
});

var offerModel = mongoose.model('Offers ', offerSection);

module.exports = offerModel;