var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hireSection = Schema({
    
    tittle:{
        type:String,
        
    },
    paymentOption: {
        type: Schema.Types.ObjectId,
        ref:'payment_option'
        
    },
    totalAmount: {
        type: String,
       
    },

    workDetail:{
        type:String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    policy:{
        type:Boolean,
        default:false
    },
    updatedAt: {
        type: Date,
        default: ''
    },
    createdAt: {
        type: Date,

    },
});

var hireModel = mongoose.model('hires', hireSection);

module.exports = hireModel;