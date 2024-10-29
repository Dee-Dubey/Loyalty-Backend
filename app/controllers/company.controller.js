const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const { sendEmail } = require("../utilities/utilities");
const QRCode = require('qrcode');

const createCompany = async(req, res) => {
    try{
        const existingCompany = await db.companies.findOne({where: {email: req.body.email}});
        if(existingCompany){
            return res.status(200).json({returnCode:1, msg:'company already registered!', existingCompany})
        }
        const company = await db.companies.create({
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
            currencyType: req.body.currencyType,
            address: req.body.address,
            businessName: req.body.businessName,
            businessType: req.body.businessType
        });
        const user = await db.users.create({
            username: req.body.email,
            password: req.body.name.replaceAll(" "),
            role: "superuser",
            status: true,
            company_id: company.id
        });
        const url = `http://localhost:3000/user?company_id=${company.id}`;
        const qrCodeImage = await QRCode.toDataURL(url);
        sendEmail(req.body.email, "Registered Successfully!", "Dear, Customer thank you for registering under loyality program",
        `<h1>Hello</h1><p>Here is an embedded base64 image:</p><img src="${qrCodeImage}" alt="Embedded Image" />`
        );
        return res.status(200).json({url, qrCodeImage, company, user});
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

module.exports = {createCompany, getAllCompanies, getAllCompanyById, deleteCompany, updateCompany}