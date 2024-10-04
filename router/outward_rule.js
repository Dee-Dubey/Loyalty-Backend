const express = require('express');
const { auth } = require('../app/middlewares');
const { getOutwardRuleById, createOutwardRule, updateOutwardRule, deleteOutwardRule, getAllOutwardRule } = require('../app/controllers/outward_rule.controller');
const router = express.Router();


router
.route('/')
.get(auth, getAllOutwardRule)
.post(auth, createOutwardRule)

router
.route('/:id')
.get(auth, getOutwardRuleById)
.put(auth, updateOutwardRule)
.patch(auth, updateOutwardRule)
.delete(auth, deleteOutwardRule)

module.exports = router;