var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var adminSchema = Schema({
           name:{
               type:String
           },
           phone:{
               type:String
           },
           email:{
               type:String
           },
           password:{
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
               type:String
           }

});
var adminModel = mongoose.model('admins',adminSchema);
 
module.exports = adminModel;
