const express =  require('express');
const { getAllCompanies, createCompany, getAllCompanyById, updateCompany, deleteCompany, getCompanyWisePoints, getQRCode } = require('../app/controllers/company.controller');
const { auth, isAdmin } = require('../app/middlewares');
const router = express.Router();

router
.route('/')
.get( auth, isAdmin, getAllCompanies)
.post( auth, isAdmin, createCompany)

router
.route('/:id')
.get( auth, isAdmin, getAllCompanyById)
.put( auth, isAdmin, updateCompany)
.patch( auth, isAdmin, updateCompany)
.delete( auth, isAdmin, deleteCompany)

router
.route('/totalPoints')
.post(auth, getCompanyWisePoints)

router
.route('/getQRCode')
.post(auth, getQRCode)

module.exports = router;