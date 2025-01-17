const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const { sendEmail, downloadExcel } = require("../utilities/utilities");
const QRCode = require('qrcode');
require('dotenv').config('../../.env');
const fs = require('fs');
const ejs = require('ejs');
const { Op } = require("sequelize");

const createCompany = async(req, res) => {
    try{
        const existingCompany = await db.companies.findOne({where: {email: req.body.email}});
        if(existingCompany){
            return res.status(200).json({returnCode:1, msg:'email already exists!', existingCompany})
        }
        const company = await db.companies.create({
            name: req.body.name,
            code: req.body.code,
            contact: req.body.contact,
            email: req.body.email,
            currencyType: req.body.currencyType,
            address: req.body.address,
            businessName: req.body.businessName,
            businessType: req.body.businessType
        });
        const user = await db.users.create({
            username: req.body.email,
            password: req.body.name.split(" ")[0],
            role: "superuser",
            status: true,
            company_id: company.id
        });
        const url = `${process.env.FRONTEND_BASE_URL}user/qr?company_id=${company.id}`;
        const qrCodeImage = await QRCode.toDataURL(url);
        const base64Data = qrCodeImage.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '');
        ejs.renderFile(`app/templates/companyRegistration.ejs`, { 
            name: req.body.name,
            username:req.body.email,
            password: user.password
        }, 
        (err, html) => {
            if(!err){
                sendEmail(req.body.email, "Welcome to PassMe Point!",'', html, base64Data);
            }
        });
        const result = {returnCode:0, url, qrCodeImage, company, user}
        return res.status(200).json(result);
        }catch(e){
            console.log(e);
            return res.status(500).json(ERROR_RESPONSE);
        }
}

const getAllCompanies = async(req, res)=>{
    try{
        const filters = JSON.parse(req.query.filters?req.query.filters:'{}');
        if(filters.where.createdAt){
            const startOfDay = new Date(`${filters.where.createdAt}T00:00:00Z`); // Start of the day
            const endOfDay = new Date(`${filters.where.createdAt}T23:59:59Z`); // End of the day

            filters.where = {...filters.where, createdAt: {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay
              }}
        }
        const data = await db.companies.findAll(filters);
        console.log(data);
        filters.limit = null;
        filters.offset = null;
        const count = await db.companies.count(filters);
        if(req.query.download){
            return downloadExcel(data, res, 'companies');
        }
        return res.status(200).json({returnCode:0, msg:'companies fetched successfully!', data, count});
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllCompanyById = async(req, res)=>{
    try{
        const data = await db.companies.findOne({where:{id: req.params.id}});
        if(req.query.download){
            return downloadExcel(data, res, 'companies');
        }
        return res.status(200).json({returnCode:0, msg:'company fetched successfully!', data})
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const deleteCompany = async(req, res)=>{
    try{
        const data = await db.companies.destroy({where:{id: req.params.id}});
        return res.status(200).json({returnCode:0, msg:'company deleted successfully!', data})
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const updateCompany = async(req, res)=>{
    try{
        const data = await db.companies.update({...req.body}, {where:{id: req.params.id}});
        return res.status(200).json({returnCode:0, msg:'company updated successfully!', data})
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getCompanyWisePoints = async (req,res) => {
    try{
        const {company_id} = req.data;
        const result = await db.query(`select
                            c."name" ,
                            sum(th.point) points
                        from
                            transactions_histories th,
                            customers c
                        where
                            th.customer_id = c.id
                            and th.company_id = ${company_id}
                        group by
                            name`);
        return res.status(200).json({returnCode:0, msg:'', data: result[0]})
    }catch(e){
        
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getQRCode = async (req,res) => {
    try{
        const url = `${process.env.FRONTEND_BASE_URL}create-customer`;
        const qrCodeImage = await QRCode.toDataURL(url);
        return res.status(200).json({returnCode:0, msg:'QR generated successfully!', qrCodeImage, url})
    }catch(e){
        
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const blockCompany = async(req, res)=>{
    try{
        const {status} = req.body
        await Promise.all([
            await db.companies.update({status}, {where:{id: req.params.id}}),
            await db.users.update({status}, {where:{company_id: req.params.id}})
        ])
        return res.status(200).json({returnCode:0, msg:`company ${status?'unblocked':'blocked'} successfully!`})
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createCompany, getAllCompanies, getAllCompanyById, deleteCompany, updateCompany, getCompanyWisePoints, getQRCode, blockCompany}