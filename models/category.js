var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySection = Schema({
    
    categoryName:{
        type:String
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

var categoryModel = mongoose.model('categories ', categorySection);

module.exports = categoryModel;