var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

 var tainingSchema = Schema({
     seekerId:{
         type:Schema.Types.ObjectId,
         ref:'seekers'
     },
     title:{
         type:String
     },
     tags:{
         type:Array
     },
     blogs:{
        String
     },
     video:{
         type:String
     },
     isActive:{
         type:Boolean,
         default:true
     },
     createdAt:{
         type:Date
     },
     updatedAt:{
         type:Date
     }
 });
 var trainingModel = mongoose.model('training',tainingSchema);
 module.exports = trainingModel;