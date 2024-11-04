const express = require('express');
const { auth, isAdmin, validateOtp } = require('../app/middlewares');
const { createUser, updateUser, getAllUsers, changePassword, getUserById, resetPassword, userProfile } = require('../app/controllers/user.controller');
const router = express.Router();


router
.route('/')
.get(auth, isAdmin, getAllUsers)
.post(auth, isAdmin, createUser);

router
.route('/:id')
.get(auth, getUserById)
.put(auth, updateUser)
.patch(auth, updateUser);

router
.route('/changePassword')
.post(auth, changePassword)

router
.route('/resetPassword')
.post(validateOtp, resetPassword);

router
.route('/profile')
.post(auth, userProfile);


module.exports = router;