const express = require('express');
const { auth, isAdmin } = require('../app/middlewares');
const { getAllfeedback, createFeedback, deleteFeedback, getFeedbackById, updateFeedback } = require('../app/controllers/feedback.controller');
const router = express.Router();

router
.route('/')
.get(auth, isAdmin, getAllfeedback)
.post(createFeedback);

router
.route('/:id')
.patch(auth, isAdmin,updateFeedback)
.put(auth, isAdmin,updateFeedback)
.get(auth, isAdmin, getFeedbackById)
.delete(auth, isAdmin, deleteFeedback);

module.exports = router;