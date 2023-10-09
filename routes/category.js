var categoryController = require("../controllers/category");
var catgry = new categoryController();
var express = require("express");
var router = express.Router();
var auth = require("../auth/auth");

router.post("/addcategory", auth, catgry.addcategory);
router.post("/editCategory", auth, catgry.editCategory);
router.post("/allCategoryList", auth, catgry.allCategoryList);
router.post('/viewCategoryDetail', auth , catgry.viewCategoryDetail);

module.exports = router;
