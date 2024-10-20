const express = require('express');
const { auth, isAdmin } = require('../app/middlewares');
const { createUser, updateUser, getAllUsers, changePassword, getUserById } = require('../app/controllers/user.controller');
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

module.exports = router;