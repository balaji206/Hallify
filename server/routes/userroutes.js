const express = require('express');
const router = express.Router();
const {registeruser,loginuser,getuser,updateuser, deleteuser} = require('./../controllers/usercontroller');
const {sendOtp, verifyOtp} = require('./../controllers/otpcontroller');

router.get('/get', getuser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register',registeruser);
router.post('/login',loginuser);
router.put('/update/:id',updateuser);
router.delete('/delete/:id',deleteuser);
module.exports = router;
