const express = require('express');
const { login, resetPassword } = require('../app/controllers/auth.contollers');
const { validateOtp } = require('../app/middlewares');
const router = express.Router();

router
.route('/login')
.post(login);

router
.route('/resetPassword')
.post(validateOtp, resetPassword)

module.exports = router;