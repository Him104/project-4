const express = require('express');
const router = express.Router();
const middlewares = require('../middleware/auth.js'); 
//const multer  = require('multer');
//const upload = multer({ dest: 'uploads/' });


const userRegisterController = require('../controllers/userRegisterController.js');
const userLoginController = require('../controllers/userLoginController.js'); 
const getUserDetailsController = require('../controllers/getUserDetailsController.js'); 
const updateUserDetailsController = require('../controllers/updateUserDetailsController.js');







//router.post('/register', upload.single('profileImage'), userRegisterController.createUser);
router.post('/register', userRegisterController.createUser);
router.post('/login', userLoginController.login); 

router.get('/user/:userId/profile', middlewares.authentication, getUserDetailsController.getUserDetails); 
router.put('/user/:userId/profile', middlewares.authentication, updateUserDetailsController.updateUserDetails); 




module.exports = router;