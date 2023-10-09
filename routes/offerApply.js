var offerController = require("../controllers/offerApply");
var offer = new offerController();
var express = require("express");
var router = express.Router();
var auth = require("../auth/auth");

router.post("/applyForJob", auth, offer.applyForJob);
router.post("/acceptAndDeclineOffer", auth, offer.acceptAndDeclineOffer);
router.post('/sendOfferLetterToSeeker',auth,offer.sendOfferLetterToSeeker);
router.post('/offerLetterDetail',auth,offer.offerLetterDetail);




module.exports = router;
