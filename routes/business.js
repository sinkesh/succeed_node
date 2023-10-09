var businessController = require('../controllers/business');
var business = new businessController();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
var multer = require('multer');
var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');


var storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'User',
    filename: function(req, file, cb) {
        cb(null, file.originalname + Date.now())
    }
});

const filefilter = (req, file, next) => {
    next(null, true);
}


var upload = multer({
    storage: storage,
    fileFilter: filefilter,
});

router.post('/businessSignUp', business.businessSignUp);
router.post('/businessLogin', business.businessLogin);
router.post('/businessSocialLogin', business.businessSocialLogin);
router.post('/forgotPassword', business.forgotPassword);
router.post('/changePassword',auth,  business.changePassword);
router.post('/resetPassword',business.resetPassword)
router.post('/logout',auth, business.logout);
router.post('/editProfile', auth, upload.single('image'), business.editProfile);
router.post('/getAllBusiness',auth, business.getAllBusiness);
router.get('/verifyUserEmail',business.verifyUserEmail);
////Admin Api's//////
router.post('/businessListingForAdmin',auth,business.businessListingForAdmin);
router.post('/updateBusinessStatusForAdmin',auth,business.updateBusinessStatusForAdmin);
router.post('/addBusinessForAdmin',auth,business.addBusinessForAdmin);
router.post('/checkSession',auth,business.checkSession);
router.get('/businessCSV',business.businessCSV);
router.post('/businessDetailForAdmin',auth,business.businessDetailForAdmin);
router.post('/businessCountForAdmin',auth,business.businessCountForAdmin);
router.post('/deleteSession',auth,business.deleteSession);
router.post('/resendEmail',auth,business.resendEmail);
router.get('/deleteBusinessAccount',auth,business.deleteBusinessAccount);
router.post('/notInterestedSeeker',auth,business.notInterestedSeeker);
module.exports = router;