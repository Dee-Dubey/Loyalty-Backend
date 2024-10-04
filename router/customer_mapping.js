const express = require('express');
const { mapCustomerToMerchant } = require('../app/controllers/customer_mapping.controller');
const { auth } = require('../app/middlewares');
const router = express.Router();

router
.route('/')
.post(auth, mapCustomerToMerchant)


module.exports = router;