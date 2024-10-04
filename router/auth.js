const express = require('express');
const { login } = require('../app/controllers/auth.contollers');
const router = express.Router();

router
.route('/login')
.post(login);

module.exports = router;