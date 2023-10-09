var seekersController = require('../controllers/seekers');
var seeker = new seekersController();
var express = require('express');
var router = express.Router();

var auth = require('../auth/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
 
const app = express();
 
let storage =  new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'seeker',
    allowedFormats:'pdf',
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
        cb(undefined, 'testing');
    }
});
const parser = multer({ storage: storage });
//, parser.single('profileImg')
router.post('/signUp', seeker.signUp);
router.post('/social_login',seeker.social_login);
router.post('/login', seeker.login);
router.post('/changePassword',auth, seeker.changePassword);
router.post('/resetPassword',seeker.resetPassword);
router.post('/forgotpassword', seeker.forgotpassword);
router.get('/verifyUserEmail/:uniqueId',auth, seeker.verifyUserEmail);
router.post('/setUpProfile',auth,seeker.setUpProfile);
router.post('/aboutYouProfile',auth,parser.single('image'),seeker.aboutYouProfile);
router.post('/experienceProfile',auth,seeker.experienceProfile);
router.post('/deleteTrainingFromSeeker',auth,seeker.deleteTrainingFromSeeker);
router.post('/networkProfileWhenChecked',auth,seeker.networkProfileWhenChecked);
router.post('/networkProfileWhenNotChecked',auth,seeker.networkProfileWhenNotChecked);
router.post('/deleteLanguageFromSeeker',auth,seeker.deleteLanguageFromSeeker);
router.post('/deleteTrainingAndProductSeeker',auth,seeker.deleteTrainingAndProductSeeker);
router.post('/activeJobsMyApplicationForSeeker',auth,seeker.activeJobsMyApplicationForSeeker);
router.post('/closedJobsMyApplicationForSeeker',auth,seeker.closedJobsMyApplicationForSeeker);
router.post('/viewProfileDashBoardForSeeker',auth,seeker.viewProfileDashBoardForSeeker);
router.post('/featuredOppurtinityForSeekerDashboard',auth,seeker.featuredOppurtinityForSeekerDashboard);
router.post('/activeInSearchJobScreen',auth,seeker.activeInSearchJobScreen);
router.post('/sentInSearchJobScreen',auth,seeker.sentInSearchJobScreen);
router.post('/offerProposal',auth,seeker.offerProposal);
router.post('/filterForSeekerJob',auth,seeker.filterForSeekerJob);
router.post('/viewProfileForBusinessSection',auth,seeker.viewProfileForBusinessSection);
router.post('/addTrainingAndBlogs',auth,seeker.addTrainingAndBlogs);
router.post('/getMessageForSeekerDashboardInbox',auth,seeker.getMessageForSeekerDashboardInbox);
router.post('/salesDetailForSeekerSection',auth,seeker.salesDetailForSeekerSection);
///////Admin API's//////

router.post('/seekerListingForAdmin',auth,seeker.seekerListingForAdmin);
router.post('/updateStatusForAdmin',auth,seeker.updateStatusForAdmin);
router.get('/seekerCSV',seeker.seekerCSV);
router.post('/viewProfilSeekerForAdmin',auth,seeker.viewProfilSeekerForAdmin);
router.post('/ListingForSeekerView',auth,seeker.ListingForSeekerView);
router.post('/seekerCountForAdmin',auth,seeker.seekerCountForAdmin);
router.post('/ProgressBarDetail',auth,seeker.ProgressBarDetail);
router.post('/progressBarReport',auth,seeker.progressBarReport);
router.get('/deleteSeekerAccount',auth,seeker.deleteSeekerAccount);
module.exports = router;