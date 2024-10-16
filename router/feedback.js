const express = require('express');
const { auth, isAdmin } = require('../app/middlewares');
const { getAllfeedback, createFeedback, deleteFeedback } = require('../app/controllers/feedback.controller');
const router = express.Router();

router
.route('/')
.get(auth, isAdmin, getAllfeedback)
.post(createFeedback);

router
.route('/:id')
.delete(auth, isAdmin, deleteFeedback);

module.exports = router;