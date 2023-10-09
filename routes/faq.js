var faqController = require("../controllers/faq");
var Faq = new faqController();
var express = require("express");
var router = express.Router();
var auth = require("../auth/auth");

router.post("/addFaq", Faq.AddFAQ);
router.post("/ShowAndSearchFAQ", auth, Faq.ShowAndSearchFAQ);
router.post("/editFaq", auth, Faq.EditFAQ);
router.post('/dltFaq', auth , Faq.DltFaq);
router.post('/FaqDetail', auth, Faq.FaqDetail);
router.post('/allFaqDetail',auth,Faq.allFaqDetail);
router.post('/addQuestionForSeeker',auth,Faq.addQuestionForSeeker);
module.exports = router;
