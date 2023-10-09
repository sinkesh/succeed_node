var notifi_Controller = require("../controllers/notification_detail");
var notification = new notifi_Controller();
var express = require("express");
var router = express.Router();
var auth = require("../auth/auth");

router.post("/all_notification", auth, notification.all_notification);
router.post('/notificationCount',auth,notification.notificationCount);
module.exports = router;
