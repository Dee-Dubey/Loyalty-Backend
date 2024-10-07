const express = require('express');
const { auth, isAdmin } = require('../app/middlewares');
const { createUser, updateUser, getAllUsers, changePassword } = require('../app/controllers/user.controller');
const router = express.Router();


router
.route('/')
.get(auth, isAdmin, getAllUsers)
.post(auth, isAdmin, createUser);

router
.route('/:id')
.put(auth, isAdmin,  updateUser)
.patch(auth, isAdmin, updateUser);

router
.route('/changePassword')
.post(auth, changePassword)

router
.route('/abc/test')
.get(newAbc)

router
.route('/abc/test')
.get(newAbc)

module.exports = router;