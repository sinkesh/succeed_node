var favoriteController = require("../controllers/favorite");
var favorite = new favoriteController();
var express = require("express");
var router = express.Router();
var auth = require("../auth/auth");

router.post("/addFavorite", auth, favorite.addFavorite);
router.post("/favoriteDetail", auth, favorite.favoriteDetail);
router.post("/updateFavorite", auth, favorite.updateFavorite);
router.post('/AllFavoriteJobBySeeker', auth , favorite.AllFavoriteJobBySeeker);

module.exports = router;
