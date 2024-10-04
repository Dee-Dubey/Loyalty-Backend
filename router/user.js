const express = require('express');
const { auth, isAdmin } = require('../app/middlewares');
const { createUser, updateUser, getAllUsers } = require('../app/controllers/user.controller');
const router = express.Router();


router
.route('/')
.get(auth, isAdmin, getAllUsers)
.post(auth, isAdmin, createUser)

router
.route('/:id')
.put(auth, isAdmin,  updateUser)
.patch(auth, isAdmin, updateUser)

module.exports = router;