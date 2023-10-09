var hireController = require("../controllers/hire");
var hire = new hireController();
var express = require("express");
var router = express.Router();
var auth = require("../auth/auth");

router.post("/addHiringDetail", auth, hire.addHiringDetail);
router.post("/editHiringDetail", auth, hire.editHiringDetail);
router.post("/showHireDetail",auth,hire.showHireDetail);

module.exports = router;
