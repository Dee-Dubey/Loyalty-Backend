const express = require('express');
const { auth, isAdmin } = require('../app/middlewares');
const { getAllfeedback, createFeedback, deleteFeedback } = require('../app/controllers/feedback.controller');
const router = express.Router();

router
.route('/')
.get(getAllfeedback)
.post(createFeedback);

router
.route('/:id')
.delete(deleteFeedback);

module.exports = router;