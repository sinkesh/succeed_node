var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seekerSchema = Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    fullName: {
        type: String
    },
    image:{
        type:String
    },
    email: {
        type: String
    },
    socialId:{
        type:String
    },
    socialType:{
        type:String
    },
    password: {
        type: String
    },
    countryIndex:{
        type:Number
    },
    headLine:{
        type:String
    },
    language:[{
          language:{
              type:Schema.Types.ObjectId,
              ref:'languages'
          },
          proficiency:{
            type:Schema.Types.ObjectId,
            ref:'proficiencies'     
          }
     }],
     countryCode:{
         type:String
     },
     phone:{
         type:String
     },
    summary:{
        type:String
    },
    websiteUrl:{
        type:String
    },
    linkedInUrl:{
        type:String
    },
    blogUrl:{
        type:String
    }, 
    aboutYouPage:{
        type:Boolean,
        default:false
    }, 
    experience:{
        type:Schema.Types.ObjectId,
        ref:'experiences'
    },
    sector:{
        type:Schema.Types.ObjectId,
        ref:'sectors'
    },
    
  //  productAndService:[{
         industry:{
            type:Array
            // type:Schema.Types.ObjectId,
            // ref:'industries'
        },
        service:[{
           type:Schema.Types.ObjectId,
           ref:'business_services'
        }],
        sellingPreferred:[{
            type:Schema.Types.ObjectId,
            ref:'prefferedSellings'
        }],
        avgDeal:{
            type:Schema.Types.ObjectId,
            ref:'averageDeals'
        },
  //  }],
    highestDegree:[{
        type:Schema.Types.ObjectId,
        ref:'highestDegrees'
    }],
    training:[{
        training:{
        type:String
        }
    }],
    // training:[{
    //     year:{
    //         type:Schema.Types.ObjectId,
    //         ref:'trainingYears'
    //     },
    //     title:{
    //         type:String
    //     },
    //     institute:{
    //         type:String
    //     }

    // }],

    experiencePage:{
        type:Boolean,
        default:false
    },
    alreadyHaveNetwork:{
        type:Boolean,
        default:false
    },
    industryNetwork:{
        type:Array
        // type:Schema.Types.ObjectId,
        // ref:'industries'
    },
    serviceNetwork:[{
        type:Schema.Types.ObjectId,
        ref:'business_services'
    }],
    sizeNetwork:[{
        type:Schema.Types.ObjectId,
        ref:'companySizes'
    }],
    regionNetwork:{
        type:String,
        default:''
        // type:Schema.Types.ObjectId,
        // ref:'regions'
    },
    countryNetwork:[{
        type:String,
        default:''
    }],
    function:[{
        type:Schema.Types.ObjectId,
        ref:'functions'
    }],
    seniority:[{
        type:Schema.Types.ObjectId,
        ref:'seniorities'
    }],
   
    networkPage:{
        type:Boolean, 
        default:false
    },
    ///Profile///
    regionId:{
        // type:Schema.Types.ObjectId,
        // ref:'regions'
        type:String
    },
    type:{type:String},
    countryTerritory:{
        type:String
    },
    otherDetail:{
        type:String,
        default:''        
    },
    territoriesPage:{
        type:Boolean,
        default:false
    },
    //profile///
    uniqueId:{
        type:String,
        default:''
    },
    describeBest:{
        type:String
        // type:Schema.Types.ObjectId,
        // ref:'describes'
    },
    lookingFor:{
        type:Schema.Types.ObjectId,
        ref:'lookings'
    },
    country:{
        type:String
    },
    city:{
        type:String
    }, 
    emailVerify:{
        type:Boolean,
        default:false
    },
    profileStatusPercentage:{
        type:Number,
        default:0
    },
    profilePercentage:{
        type:Number,
        default:0
    },
    avgRating:{
        type:Number,
        default:0
    },

    isHired:{
        type:Boolean,
        default:false
    },
    hiredDate:{
        type:Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    createdAt: {     
        type: Date
    }
});


var seekerModel = mongoose.model('seekers', seekerSchema);

module.exports = seekerModel;

