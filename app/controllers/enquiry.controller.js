const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const { sendEmail, downloadExcel } = require("../utilities/utilities");
const ejs = require('ejs');
const QRCode = require('qrcode');

const createEnquiry = async(req, res) => {
    try{
        const enquiry = await db.enqueries.findOne({where:{email:req.body.email}});
        if(enquiry){
            return res.status(200).json({returnCode:1, msg: 'enquiry already exists!'});
        }
        const result = {returnCode:0, msg: 'enquiry created successfully!'}
        await db.enqueries.create({...req.body});
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}


const deleteEnquiry = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'enquiry deleted successfully!'}
        const {id} = req.params;
        await db.enqueries.destroy({where:{id}});
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllEnquiry = async(req, res) => {
    try{
        const filters = JSON.parse(req.query.filters?req.query.filters:'{}');
        const result = {returnCode:0, msg: 'enquiry fetched!'}
        result.data = await db.enqueries.findAll(filters);
        filters.limit = null;
        filters.offset = null;
        result.count = await db.enqueries.count(filters);
        if(req.query.download){
            return downloadExcel(result.data, res, 'enquiries');
        }
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const convertEnquiryToUser = async(req, res) =>{
    try{
        const result = {returnCode:0, msg: 'enquiry converted to user!'};
        const enquiry = await db.enqueries.findOne({where: {id: req.body.id}});
        if(!enquiry){
            result.returnCode = 1;
            result.msg = "enquiry not present!"
        }else{
            const existingCompany = await db.companies.findOne({where: {email: enquiry.email}});
            if(existingCompany){
                return res.status(200).json({returnCode:1, msg:'company already registered!', existingCompany})
            }
            const company = await db.companies.create({
                name: enquiry.name,
                contact: enquiry.contact,
                email: enquiry.email,
                currencyType: enquiry.currencyType,
                address: enquiry.address,
                businessName: enquiry.businessName,
                businessType: enquiry.businessType,
                code: enquiry.code
            });
            await db.users.create({
                username: enquiry.email,
                password: enquiry.name.split(" ")[0],
                role: "superuser",
                status: true,
                company_id: company.id
            })
            await db.enqueries.destroy({where:{id:enquiry.id}});
            const url = `${process.env.FRONTEND_BASE_URL}create-customer`;
            const qrCodeImage = await QRCode.toDataURL(url);
            const base64Data = qrCodeImage.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '');
            ejs.renderFile('app/templates/companyRegistration.ejs', { 
            name: enquiry.name,
            username: enquiry.email,
            password: enquiry.name.split(" ")[0]
            }, 
            (err, html) => {
                if(html){
                    sendEmail(req.body.email, "Welcome to Pointbox!",'', html, base64Data);
                }
            });
        }
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createEnquiry, deleteEnquiry, getAllEnquiry, convertEnquiryToUser}