var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingSchema = Schema({
    seekerId: {
        type: Schema.Types.ObjectId,
        ref: 'seekers'
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business'
    },
    feedbackId: {
      type:Number
    },
    review: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    ratingType:{
        type:String
    },
    isActive : {
        type:Boolean,
        default:true
    },
    ratingFrom:{
        type:String
    },
    createdAt:{
        type:Date
    }
});

var RatingModel = mongoose.model('ratings', RatingSchema);

module.exports = RatingModel;