var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var questionSchema = Schema({
           question:{
               type:String
           },
           seekerId:{
            type: Schema.Types.ObjectId,
            ref: 'seekers'    
               },
           businessId:{
            type: Schema.Types.ObjectId,
            ref: 'business'  
           },
           salesId:{
            type: Schema.Types.ObjectId,
            ref: 'Sales_Opportunity'   
                },
           isActive:{
               type:Boolean,
               default:true
           },
           createdAt:{
               type:Date
           }
      

});
var questionModel = mongoose.model('questions',questionSchema);
 
module.exports = questionModel;
