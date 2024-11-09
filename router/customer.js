const express = require('express');
const { getAllCustomer, getCustomerById, createCustomer, generateOtp, getCustomerByEmailId, customerLogin, resetPassword, changePassword, customerProfile, getMerchantWisePoints, getQRCode } = require('../app/controllers/customer.controller');
const { auth, validateOtp } = require('../app/middlewares');
const router = express.Router();


router
.route('/')
.get(auth, getAllCustomer)
.post(validateOtp, createCustomer)

router
.route('/:id')
.get(auth, getCustomerById)

router
.route('/email')
.post( getCustomerByEmailId)

router
.route('/generateOtp')
.post(generateOtp);

router
.route('/login')
.post(customerLogin)

router
.route('/reset-password')
.post(validateOtp, resetPassword)

router
.route('/change-password')
.post(auth, changePassword)

router
.route('/profile')
.post(auth, customerProfile);

router
.route('/totalPoints')
.post(auth, getMerchantWisePoints);

router
.route('/getQRCode')
.post(auth, getQRCode);

module.exports = router;