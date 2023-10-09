var messageController = require('../controllers/message');
var message = new messageController();
var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');

router.post('/getMessage', auth, message.getMessage);
router.post('/getUnreadMesssage', auth, message.getUnreadMesssage);
router.post('/archiveRoom', auth, message.archiveRoom);
router.post('/archiveListingApi',auth,message.archiveListingApi);
router.post('/checkRoom', auth, message.checkRoom);
router.post('/getChats', auth, message.getChats);
router.post('/getMessageForBusinessScreen',auth,message.getMessageForBusinessScreen);
router.post('/messageCount',auth,message.messageCount);
module.exports = router;