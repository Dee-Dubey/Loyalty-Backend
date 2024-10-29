const express = require('express');
const { getAllEmployees, createEmployee, getEmployeeById, updateEmployee } = require('../app/controllers/employee.controller');
const { auth, isSuperUser } = require('../app/middlewares');
const router = express.Router();

router
.route('/')
.get(auth, isSuperUser, getAllEmployees)
.post(auth, isSuperUser, createEmployee)

router
.route('/:id')
.get(auth, isSuperUser, getEmployeeById)
.patch(auth, isSuperUser, updateEmployee)
.put(auth, isSuperUser, updateEmployee)

module.exports = router;