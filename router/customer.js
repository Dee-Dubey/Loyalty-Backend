const express = require('express');
const { getAllCustomer, getCustomerById, createCustomer } = require('../app/controllers/customer.controller');
const { auth } = require('../app/middlewares');
const router = express.Router();


router
.route('/')
.get(auth, getAllCustomer)
.post(auth, createCustomer)

router
.route('/:id')
.get(auth, getCustomerById)

module.exports = router;