const express = require('express');
const { createEnquiry, getAllEnquiry, deleteEnquiry, convertEnquiryToUser } = require('../app/controllers/enquiry.controller');
const { auth, isAdmin } = require('../app/middlewares');
const router = express.Router();

router
.route('/')
.get(auth, isAdmin, getAllEnquiry)
.post(createEnquiry);

router
.route('/:id')
.delete(auth, isAdmin, deleteEnquiry);

router
.route('/convert')
.post(auth, isAdmin, convertEnquiryToUser)

module.exports = router;