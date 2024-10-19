const express = require('express');
const { getAllCustomer, getCustomerById, createCustomer, generateOtp, getCustomerByEmailId, customerLogin, resetPassword, changePassword } = require('../app/controllers/customer.controller');
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

module.exports = router;