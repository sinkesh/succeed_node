var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSection = Schema({
    
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
    isFavorite:{
        type:Boolean,
        default:false
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

    },
});

var favoriteModel = mongoose.model('favorites ', favoriteSection);

module.exports = favoriteModel;