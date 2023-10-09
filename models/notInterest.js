var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var interestSchema = Schema({
    seekerId:{
        type:Schema.Types.ObjectId,
        ref :'seekers'
    },
    salesId: {
        type:Schema.Types.ObjectId,
        ref :'Sales_Opportunity'
    },
           createdAt:{
               type:Date
           },
           updatedAt:{
               type:String
           }

});
var InterestModel = mongoose.model('not_Interest',interestSchema);
 
module.exports = InterestModel;
