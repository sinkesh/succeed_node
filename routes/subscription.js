var subscriptionController = require('../controllers/subscription');
var subscription = new subscriptionController();
var express = require('express');
var router = express.Router();

var auth = require('../auth/auth');

router.post('/addSubScription', subscription.addSubScription);
router.post('/getAllSubScription', subscription.getAllSubScription);
router.post('/updateSubScription', auth, subscription.updateSubScription);
router.post('/updateSubScriptionStatusForAdmin', subscription.updateSubScriptionStatusForAdmin);
router.post('/addBusSubscription', subscription.addBusSubscription);
router.post('/getBusSubscription', subscription.getBusSubscription);
router.post('/updateBusSubscriptionStatus', subscription.updateBusSubscriptionStatus);
router.post('/renewSubscription',auth,subscription.renewSubscription);
router.post('/newSubscriptionList',auth,subscription.newSubscriptionList);
router.post('/endSubscriptionList',auth,subscription.endSubscriptionList);
router.post('/adminDashboardBookingCount',auth,subscription.adminDashboardBookingCount);
router.post('/allSubscriptionList',auth,subscription.allSubscriptionList);
router.get('/subscriptionCSV',subscription.subscriptionCSV);
router.post('/earningForAdmin',auth,subscription.earningForAdmin);
router.post('/adminDashboardGraph',auth,subscription.adminDashboardGraph);
router.post('/adminEarningPieChart',auth,subscription.adminEarningPieChart)
router.post('/addSubScription_ForAdmin',auth,subscription.addSubScription_ForAdmin);
module.exports = router;