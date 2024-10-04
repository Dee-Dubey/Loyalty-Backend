const express = require('express');
const { auth } = require('../app/middlewares');
const { getInwardRuleById, createInwardRule, updateInwardRule, deleteInwardRule, getAllInwardRule } = require('../app/controllers/inward_rule.controller');
const router = express.Router();


router
.route('/')
.get(auth, getAllInwardRule)
.post(auth, createInwardRule)

router
.route('/:id')
.get(auth, getInwardRuleById)
.put(auth, updateInwardRule)
.patch(auth, updateInwardRule)
.delete(auth, deleteInwardRule)

module.exports = router;