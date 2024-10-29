const express = require('express');
const { getAllEmployees, createEmployee, getEmployeeById, updateEmployee } = require('../app/controllers/employee.controller');
const { auth } = require('../app/middlewares');
const router = express.Router();

router
.route('/')
.get(auth, getAllEmployees)
.post(auth, createEmployee)

router
.route('/:id')
.get(auth, getEmployeeById)
.patch(auth, updateEmployee)
.put(auth, updateEmployee)

module.exports = router;