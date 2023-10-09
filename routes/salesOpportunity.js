var salesController = require('../controllers/salesOpportunity');
var sales = new salesController();
var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
 
const app = express();
 
let storage =  new CloudinaryStorage({
    cloudinary: cloudinary,
     public_id: "sample_document.docx",

   // folder: 'seeker',
    allowedFormats:['docx'],
     resource_type: "raw" ,
     raw_convert: "aspose",
  //  allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
        cb(undefined, 'testing');
    }
});
const parser = multer({ storage: storage });
router.post('/Add_Sales_Opportunity',auth, sales.Add_Sales_Opportunity);
router.post('/Edit_Sales_Opportunity', auth, sales.Edit_Sales_Opportunity);
router.post('/Edit_Sales_OpportunityForImage',parser.single('documents'),auth,sales.Edit_Sales_OpportunityForImage);
router.post('/deleteCustomQuestionFromBusiness',auth,sales.deleteCustomQuestionFromBusiness);
router.post('/GetAll_PerticularBusiness_Sales_Opportunity',auth, sales.GetAll_PerticularBusiness_Sales_Opportunity);
router.post('/PerticularBusiness_Sales_Opportunity', auth, sales.PerticularBusiness_Sales_Opportunity);
router.post('/updateJobStatus',auth,sales.updateJobStatus);
router.post('/deleteJob',auth,sales.deleteJob);
router.post('/reusePosting',auth,sales.reusePosting);
router.post('/withDrawPost',auth,sales.withDrawPost);
router.post('/filterForBusinessScreen',auth,sales.filterForBusinessScreen);
router.post('/offerProposalForBusinessScreen',auth,sales.offerProposalForBusinessScreen);
router.post('/salesDetailForBusinessSection',auth,sales.salesDetailForBusinessSection);
///Admin Apis//////
router.post('/GetAllOppurtunityForAdmin',auth,sales.GetAllOppurtunityForAdmin);
router.post('/updateJobStatusForAdmin',auth,sales.updateJobStatusForAdmin);
router.get('/sales_CSV',sales.sales_CSV);
router.post('/GetAllDraftsJobForAdmin',auth,sales.GetAllDraftsJobForAdmin)
router.get('/sales_CSVForDrafts',sales.sales_CSVForDrafts);
router.post('/jobViewForAdmin',auth,sales.jobViewForAdmin);
module.exports = router;