var trainingController = require('../controllers/training');
var training = new trainingController();
var express = require('express');
var router = express.Router();

var auth = require('../auth/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const multer = require('multer');
 
const app = express();
var storage = new CloudinaryStorage({
    cloudinary: cloudinary,
   params: {
    allowedFormats: ['jpg','png','jpeg'],
          folder: 'Training',
          format: 'mp4',
          resource_type: 'video',
          filename: 'file-name  '
        } 
 });
 
    var upload = multer({ storage: storage });


router.post('/addTraining',auth,upload.single('video'),training.addTraining);
router.post('/searchTraining',auth,training.searchTraining);
router.post('/editTraining',auth,upload.single('video'),training.editTraining);
module.exports = router;