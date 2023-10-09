var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var helpSection = Schema({
    
    // adminId:{
    //     type:Schema.Types.ObjectId,
    //     ref :'admins'
    // },
    question: {
        type: String,
        default: ''
    },
    answer: {
        type: String,
        default: ''
    },

    language: {
        type: String,
        default: 'en'
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
        type: Date,

    },
});

var helpModel = mongoose.model('FAQ ', helpSection);

module.exports = helpModel;