const express = require('express');
const { auth } = require('../app/middlewares');
const { getAllTransaction, addPoints, redeemPoints, getCustomerTransactionByUserId, getCustomerTransactions } = require('../app/controllers/transaction.controller');
const router = express.Router();


router
.route('/')
.get(auth, getAllTransaction)

router
.route('/add')
.post(auth, addPoints)

router
.route('/redeem')
.post(auth, redeemPoints)

router
.route('/customer/:id')
.get(auth, getCustomerTransactions)

router
.route('/user/customer/:id')
.get(auth, getCustomerTransactionByUserId)

module.exports = router;