var industryController = require("../controllers/industry");
var industry = new industryController();
var express = require("express");
var router = express.Router();
var auth = require("../auth/auth");

router.post("/getIndustries", auth, industry.getIndustries);
router.post("/AddIndustries", auth, industry.AddIndustries);
router.post("/getIndustryDetails", auth, industry.getIndustryDetails);
router.post('/getSectors', auth , industry.getSectors);
router.post('/AddSector', auth, industry.AddSector);
router.post('/SectorDetails',auth,industry.SectorDetails)
module.exports = router;
