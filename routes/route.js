const express = require('express');
const router = express.Router();
const middlewares = require('../middleware/auth.js'); 
//const multer  = require('multer');
//const upload = multer({ dest: 'uploads/' });

// User Controllers
const userRegisterController = require('../controllers/userRegisterController.js');
const userLoginController = require('../controllers/userLoginController.js'); 
const getUserDetailsController = require('../controllers/getUserDetailsController.js'); 
const updateUserDetailsController = require('../controllers/updateUserDetailsController.js');

// Product Controllers

const productCreateController = require('../controllers/productCreateController.js');
const getProductDetailsController = require('../controllers/getProductDetailsController.js');
const updateProductController = require('../controllers/updateProductController.js');





// Product APIs
//router.post('/register', upload.single('profileImage'), userRegisterController.createUser);
router.post('/register', userRegisterController.createUser);
router.post('/login', userLoginController.login); 
router.get('/user/:userId/profile', middlewares.authentication, getUserDetailsController.getUserDetails); 
router.put('/user/:userId/profile', middlewares.authentication, updateUserDetailsController.updateUserDetails); 

// Products APIs

router.post('/products', productCreateController.createProduct);
router.get('/products', getProductDetailsController.getProductDetails); 
router.get('/products/:productId', getProductDetailsController.getProductDetailsById); 
router.put('/products/:productId', updateProductController.updateProduct); 



module.exports = router;