var RatingController = require("../controllers/rating");
var Ratings = new RatingController();

var express = require("express");
var router = express.Router();

var auth = require("../auth/auth");

router.post("/addRating", auth, Ratings.addRating);
router.post("/getbusinessRating", auth, Ratings.getbusinessRating);
router.post("/getSeekerRating", auth, Ratings.getSeekerRating);
router.post("/editRating",auth,Ratings.editRating);
router.post("/feedbackForAdmin",auth,Ratings.feedbackForAdmin);
router.get("/feedBackCSV",Ratings.feedBackCSV);
module.exports = router;