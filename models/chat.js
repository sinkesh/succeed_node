var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = Schema({
   // roomId: { type: Schema.Types.ObjectId, ref: '' },
    roomId:{type:String},
    seekerId: { type: Schema.Types.ObjectId, ref: 'seekers' },
    salesId:{type:Schema.Types.ObjectId,ref:'Sales_Opportunity'},
    businessId: { type: Schema.Types.ObjectId, ref: 'business' },
    creator: { type: String },
    status: {
        type: String,
        default: 'Active'
    },
    archivedDate:{
        type:Date,
    },
    // req_from: {
    //     type: String
    // },
    createdAt: {
        type: Date
    }
});

var messageSchema = Schema({
   // roomId: { type: Schema.Types.ObjectId, ref: '' },
    roomId:{type:String},
    message: { type: String },
    seekerId: { type: Schema.Types.ObjectId, ref: 'seekers' },
    businessId: { type: Schema.Types.ObjectId, ref: 'business' },
    salesId:{type:Schema.Types.ObjectId,ref:'Sales_Opportunity'},

    readStatus: {
        type: Boolean,
        default: false
    },

    send_from: {
        type: String,
        default: 'seeker'
    },
    send_to: {
        type: String,
        default: 'business'
    },
    createdAt: {
        type: Date
    }

});

var notificationSchema = Schema({
    roomId:{
        type: String,
       
    },
    seekerId:{
        type: Schema.Types.ObjectId,
        ref:'seekers'
    },
    businessId:{
        type: Schema.Types.ObjectId,
        ref:'business'
    },
    salesId:{type:Schema.Types.ObjectId,ref:'Sales_Opportunity'},

    
    message: {
        type:String
    },
    title: {
        type: String
    },
    description:{
        type:String
    },
    readStatus:{
        type: Boolean,
        default: false
    },
    sentTo: {
        type:String
    },
    sentFrom: {
        type: String
    },
    isActive:{
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date
    }

});

module.exports = {
    roomModel: mongoose.model('rooms', roomSchema),
    messageModel: mongoose.model('messages', messageSchema),
    notificationModel:mongoose.model('notifications',notificationSchema)
}