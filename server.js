require('./config/config');
require('./db/mongoose');
require('./config/cloudnaryConfig');
require('./methods/subscriptionCron');
//  require('./routes')

const path = require('path');
var cors = require('cors');

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT;
app.use(cors());
app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routing start here
    
//business routes
var businessRoute = require('./routes/business');
app.use('/api/v1/business', businessRoute);

// _Sales_Opportunity routes 
var salesRoute = require('./routes/salesOpportunity');
app.use('/api/v1/sales', salesRoute)

// seekers route
var  seekersRoute = require('./routes/seekers');
app.use('/api/v1/seekers',seekersRoute);    
//Faq
var  faqRoute = require('./routes/faq');
app.use('/api/v1/faq',faqRoute);
//rating
var  ratingRoute = require('./routes/rating');
app.use('/api/v1/rating',ratingRoute);
//favorite
var  favoriteRoute = require('./routes/favorite');
app.use('/api/v1/favorite',favoriteRoute);

//seeker DropDownList
var seekerDropDownListRoute = require('./routes/seekerDropDownList');
app.use('/api/v1/dropDown',seekerDropDownListRoute);

//category
var categoryRoute = require('./routes/category');
app.use('/api/v1/category',categoryRoute);
//Training
var trainingRoute = require('./routes/training');
app.use('/api/v1/training',trainingRoute);

// message
var messageRoute = require('./routes/message');
app.use('/api/v1/message', messageRoute);

// subscription
var subscriptionRoute = require('./routes/subscription');
app.use('/api/v1/subscription', subscriptionRoute);

//admin
var adminRoute = require('./routes/admin');
app.use('/api/v1/admin',adminRoute);

//offer Apply
var offerApplyRoute = require('./routes/offerApply');
app.use('/api/v1/offer',offerApplyRoute);

//hiring
var hireRoute = require('./routes/hire');
app.use('/api/v1/hire',hireRoute);

//industry and Sector 
var industryRoute = require('./routes/industry');
app.use('/api/v1/industry',industryRoute);

// Notification Detail
var notification_detailRoute = require('./routes/notification_detail');
app.use('/api/v1/notification_list',notification_detailRoute);

// var excel = require('./routes/excel');
// app.use('/api/v1/excel',excel);


///////HTML files route////
router.get('/termAndCondition', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/views/termAndCondition.html'));
});

router.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/views/dashboard.html'));
});
router.get('/',function(req,res){
     res.sendFile(path.join(__dirname + '/public/views/login.html'));
});
router.get('/earning',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/earning.html'));
});
router.get('/subscription',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/subscription.html'));
});
router.get('/changePassword',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/changePassword.html'));
});
router.get('/business',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/business.html'));
});
router.get('/saleAgents',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/saleAgents.html'));
});
router.get('/allJobs',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/allJobs.html'));
});
router.get('/feedback',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/feedback.html'));
});
router.get('/drafts',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/drafts.html'));
});
router.get('/addsubscription',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/addsubscription.html'));
});
router.get('/seekerView',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/seekerView.html'));
});
router.get('/businessView',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/businessView.html'));
});
router.get('/jobView',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/jobView.html'));
});
router.get('/addDropDownBusiness',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/addDropDownBusiness.html'));
});
router.get('/seekerDropdown',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/seekerDropdown.html'));
});
router.get('/Faq',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/Faq.html'));
});
router.get('/addFaq',function(req,res){
    res.sendFile(path.join(__dirname + '/public/views/addFaq.html'));
});
// Routing end here
// router.get('/sparkline-demo', function(req, res) {
//     res.sendFile(path.join(__dirname + '/sparkline-demo.js'));
//     });
app.get('/saleSucceed', (req, res) => {
    return res.json({ code: 200, message: 'Sales succeed server is running on ' + port + ' port' })
})
app.use(router)
var server = app.listen(port, () => {
    console.log("Sales - Succeed project server is running on " + port + " port");
});
// var io = require('socket.io')(server);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
  module.exports = {
    io: io
};
require('./controllers/chat');
