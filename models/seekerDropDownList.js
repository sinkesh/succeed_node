var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//// seeker profile after signUp

var describeSchema = Schema({
    describe: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var lookingSchema = Schema({
    looking: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

/////end

/////profile///

var languageSchema = Schema({
    language: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var proficiencySchema = Schema({
    proficiency: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var experienceSchema = Schema({
    yearExperience: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var clientIndustrySchema = Schema({
    clientInd: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var clientIndustryBusinessSchema = Schema({
    clientIndForBusiness: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var serviceSchema = Schema({
    industryId:{
        type:Schema.Types.ObjectId,
        ref:'industries'

    },
    service:{
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var serviceBusinessSchema = Schema({
    industryBusiness:{
        type:String
        // type:Schema.Types.ObjectId,
        // ref:'client_industry_Business'
    },
    service:{
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var prefferedSellingSchema = Schema({
    prefferedSelling: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var averageDealSchema = Schema({
    averagedeal: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var averageDealValueSchema = Schema({
    averagedealValue: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var highestDegreeSchema = Schema({
    highestDegree: [{
        type: String,
        default: ''
    }],
    createdAt: {
        type: Date
    }
});





var sizeSchema = Schema({
    size: {
        type: Number,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var functionSchema = Schema({
    function: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var senioritySchema = Schema({
    seniority: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var regionSchema = Schema({
    region: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

//////////////////////////////////// Sales drop down start/////////////////

var currencySchema = Schema({
    currency: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var repeatCustomerSchema = Schema({
    customerSpend: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var  regionContinentSchema = Schema({
  //  region:[{
    continent :{
        type:String,
    },
   
     country :[{
         type:String
     }]
  //  }]
})
//////////////// end ///////////

//Business DropDown list Start//.///

var operationYearSchema = Schema({
    operationYear: {
        type: Number,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var revenueRangeSchema = Schema({
    range: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var companySizeSchema = Schema({
    size: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var customerSchema = Schema({
    numOfCustomer: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var saleCycleSchema = Schema({
    avgSaleCycle: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});


var customerSpendSchema = Schema({
    customerSpend: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var sellingAreaSchema = Schema({
    sellingArea: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var paymentSchema = Schema({
    paymentTime: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var regionBusinessSchema = Schema({
    regionBusiness: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

module.exports = {
    describeModel: mongoose.model('describes', describeSchema),
    lookingModel: mongoose.model('lookings', lookingSchema),
    languageModel: mongoose.model('languages', languageSchema),
    proficiencyModel: mongoose.model('proficiencies', proficiencySchema),
    experienceModel: mongoose.model('experiences', experienceSchema),
    clientIndustryModel : mongoose.model('client_industry',clientIndustrySchema),
    clientIndustryBusinessModel : mongoose.model('client_industry_Business',clientIndustryBusinessSchema),
    serviceModel: mongoose.model('services', serviceSchema),
    serviceBusinessModel : mongoose.model('business_services',serviceBusinessSchema),
    prefferedModel: mongoose.model('prefferedSellings', prefferedSellingSchema),
    averageDealModel: mongoose.model('averageDeals', averageDealSchema),
    averageDealValueModel:mongoose.model('averageDealValue',averageDealValueSchema),
    highestDegreeModel: mongoose.model('highestDegrees', highestDegreeSchema),
    sizeModel: mongoose.model('sizes', sizeSchema),
    functionModel: mongoose.model('functions', functionSchema),
    seniorityModel: mongoose.model('seniorities', senioritySchema),
    regionModel: mongoose.model('regions', regionSchema),
    currencyModel: mongoose.model('currencies', currencySchema),
    repeatCustomerModel: mongoose.model('repeatcustomers', repeatCustomerSchema),
    continentModel:mongoose.model('continents',regionContinentSchema),
    ////////////business//
    operationYearModel: mongoose.model('operationYears', operationYearSchema),
    revenueRangeModel: mongoose.model('revenueRanges', revenueRangeSchema),
    companySizeModel: mongoose.model('companySizes', companySizeSchema),
    customerModel: mongoose.model('numOfCustomers', customerSchema),
    saleCycleModel: mongoose.model('saleCycles', saleCycleSchema),
    customerSpendModel: mongoose.model('customerSpends', customerSpendSchema),
    sellingAreaModel: mongoose.model('selling_area', sellingAreaSchema),
    paymentModel: mongoose.model('payment_option', paymentSchema),
    regionBusinessModel: mongoose.model('region_business', regionBusinessSchema),

}
