const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const { sendEmail } = require("../utilities/utilities");
const QRCode = require('qrcode');
require('dotenv').config('../../.env');

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
        sendEmail(req.body.email, "Welcome to PassMe Point!",
            `Dear ${req.body.name},
            Welcome to PassMe Point! We’re thrilled to have you onboard and excited to help you enhance customer loyalty through our platform.
            Here are the login details for your company account:
                •	Username: ${req.body.email}
                •	Password: ${user.password}
                •	QR
                You can log in to your account at any time by visiting https://passmepoints.com/login .
            With PassMe Point, you’ll have all the tools you need to create an easy and effective loyalty program for your customers. If you have any questions or need assistance, feel free to reach out to our support team at info@buypassme.com .
            We’re here to ensure your success and look forward to working with you.
            Best regards,

            PassMe Point Team`,
        `<img src="${qrCodeImage}" alt="Embedded Image" />`
        );
        const result = {returnCode:0, url, qrCodeImage, company, user}
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllCompanies = async(req, res)=>{
    try{
        const data = await db.companies.findAll();
        return res.status(200).json({returnCode:0, msg:'companies fetched successfully!', data})
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllCompanyById = async(req, res)=>{
    try{
        const data = await db.companies.findOne({where:{id: req.params.id}});
        return res.status(200).json({returnCode:0, msg:'company fetched successfully!', data})
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const deleteCompany = async(req, res)=>{
    try{
        const data = await db.companies.destroy({where:{id: req.params.id}});
        return res.status(200).json({returnCode:0, msg:'company deleted successfully!', data})
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const updateCompany = async(req, res)=>{
    try{
        const data = await db.companies.update({...req.body}, {where:{id: req.params.id}});
        return res.status(200).json({returnCode:0, msg:'company updated successfully!', data})
    }catch(e){
        console.log(e);
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
        console.log(e)
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getQRCode = async (req,res) => {
    try{
        const url = `${process.env.FRONTEND_BASE_URL}create-customer`;
        const qrCodeImage = await QRCode.toDataURL(url);
        return res.status(200).json({returnCode:0, msg:'QR generated successfully!', qrCodeImage, url})
    }catch(e){
        console.log(e)
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
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createCompany, getAllCompanies, getAllCompanyById, deleteCompany, updateCompany, getCompanyWisePoints, getQRCode, blockCompany}