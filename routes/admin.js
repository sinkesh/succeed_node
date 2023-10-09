var adminController = require("../controllers/admin");
var admin = new adminController();
var express = require("express");
var router = express.Router();
var auth = require("../auth/auth");

router.post("/addAdmin", admin.addAdmin);
router.post('/adminLogin',admin.adminLogin);
router.get('/logout',auth,admin.logout);
router.post("/editAdmin", auth, admin.editAdmin);
router.post("/updatePassword", auth, admin.updatePassword);
router.post('/forgotpassword', auth , admin.forgotpassword);
router.post('/deleteAdmin',auth,admin.forgotpassword);
router.get('/allDashBoardCount',auth,admin.allDashBoardCount);
module.exports = router;
