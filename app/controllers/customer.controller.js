const moment = require("moment");
const db = require("../models");
const { sendEmail, downloadExcel } = require("../utilities/utilities");
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { ERROR_RESPONSE } = require("../constants");
const jwt = require('jsonwebtoken');
require('dotenv').config('../../.env');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const getAllCustomer = async (req, res) => {
    try{
        const filters = JSON.parse(req.query.filters?req.query.filters:'{}');
        const result = {returnCode: 0 }
        const { user_id, company_id, role } = req.data;
        const limit = filters.limit?filters.limit:5;
        const offset = filters.offset?filters.offset:0;
        let conditions = role=== 'admin'? '':role==='superuser'?`and cm.company_id =${company_id}`:role==='user'?`and cm.user_id =${user_id}`:'';
        const query = `select
                                distinct c.id,
                                c."name" ,
                                c.email,
                                c.address,
                                c.status,
                                c.contact,
                                c.country_code
                            from
                                customers c ,
                                customer_mappings cm
                            where
                                c.id = cm.customer_id ${conditions} limit ${limit} offset ${offset}`;
        const data = await db.query(query);
        const query1 = `select
                                count(distinct c.id) count
                            from
                                customers c ,
                                customer_mappings cm
                            where
                                c.id = cm.customer_id ${conditions}`;
        const data1 = await db.query(query1);
        if(req.query.download){
            return downloadExcel(data[0], res, 'customers');
        }
        result.data = data[0];
        result.count = data1[0][0].count;
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getCustomerById = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { id } = req.params;
        const {company_id} = req.data;
        if(req.data.role === 'user' || req.data.role === 'superuser'){
            const customer_mappings = await db.customer_mappings.findOne({where:{customer_id:id, company_id}});
            if(!customer_mappings){
                await db.customer_mappings.create({customer_id:id, company_id});
            }
        }
        const promises = [ db.transactions_history.sum('point', {where:{customer_id:id, company_id}}), db.customers.findOne({ where: { id } })];
        const promiseResult = await Promise.all(promises);
        if(promiseResult[1] === null){
            result.returnCode = 1;
            result.msg = "customer data not found!"
        }else{
            result.returnCode = 0;
        }
        result.data = promiseResult;
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const createCustomer = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const customerDetails = await db.customers.findOne({where: { email: req.body.email}});
        if(customerDetails){
            result.data = {
                id: customerDetails.id,
                name: customerDetails.name,
                contact: customerDetails.contact,
                email: customerDetails.email,
                address: customerDetails.address,
                createdAt: moment(customerDetails.createdAt).format('YYYY-MM-DD HH:mm:ss')
            };
            result.qr_code = await QRCode.toDataURL(`${process.env.FRONTEND_BASE_URL}customer/qr?id=${customerDetails.id}`);
            return res.status(200).json(result);
        }
        const data = await db.customers.create({...req.body});
        await db.customer_mappings.create({customer_id:data.id, company_id: req.body.company_id});
        const url = `${process.env.FRONTEND_BASE_URL}customer/qr?id=${data.id}`;
        console.log("url==", url);
        const qrCodeImage = await QRCode.toDataURL(url);
        const base64Data = qrCodeImage.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const ts = Date.now();
        fs.writeFileSync(`public/${ts}.png`, buffer);
        ejs.renderFile(`app/templates/customerRegistration.ejs`, { 
        name: req.body.name,
        username:req.body.email,
        password: req.body.password,
        qrCodeImage: `${process.env.BACKEND_BASE_URL}/api/uploads/${ts}.png`}, 
        (err, html) => {
            if(html){
                sendEmail(req.body.email, "Welcome to PassMe Point!",'', html);
            }
        });
        result.qr_code = qrCodeImage;
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const generateOtp = async(req, res) =>{
    const result = {returnCode: 0, msg: 'otp generated successfully!' }
    try{
      await db.otp_masters.update({expired: true}, {where:{email: req.body.email} })
      const randomUUID = uuidv4();
      const otp = randomUUID.replace(/\D/g, '').substring(0, 4);
      await db.otp_masters.create({otp, email: req.body.email });
      sendEmail(req.body.email, `Your one time password id ${otp}`, ``);
      return res.status(200).json(result);
    }catch(e){
      return res.status(500).json(ERROR_RESPONSE);
    }
}

const getCustomerByEmailId = async (req, res) => {
    const result = {returnCode: 0, msg: 'customer fetched successfully!' }
    try{
        const data = await db.customers.findOne({ where: { email: req.body.email } });
        result.data = {
            id: data.id,
            name: data.name,
            contact: data.contact,
            email: data.email,
            address: data.address,
            status: data.status,
            createdAt: data.createdAt
        }
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const customerLogin = async (req, res) => {
    try{
        const { email, password } = req.body;
        let data = await db.customers.findOne({ where: { email, password, status: true } });
        if(data){
            const { id: customer_id, email} = data.toJSON();
            const token = jwt.sign({ data: {customer_id, email, role: 'customer'}}, process.env.TOKEN, { expiresIn: 60 * 60 * 6});
            const result = { token, customer_id, role: 'customer' }
            return res.status(200).json({returnCode: 0, msg: 'Login Successful!', result });
        }else{
            return res.status(200).json({returnCode: 1, msg: 'invalid credentials!' });
        }
    }catch(e){
        delete req.query.download;;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const resetPassword = async (req, res) =>{
    try{
        await db.customers.update({password: req.body.password},{where: {email: req.body.email}})
        return res.status(200).json({returnCode:0, msg: 'password reset successfully!'});
    }catch(e){
        delete req.query.download;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const changePassword = async (req, res) => {
    const result = {returnCode:0, msg:'password changes successfully'}
    try{
        const {customer_id} = req.data;
        await db.customers.update({password: req.body.password}, {where: {id: customer_id}});
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const customerProfile = async (req, res) => {
    const result = {returnCode:0, msg:'profile fetched successfully'}
    try{
        const {customer_id} = req.data;
        const resolvedPromises = await Promise.all([
            await db.customers.findOne({where: {id: customer_id}}),
            await db.transactions_history.sum('point', {where:{customer_id}})
        ]);
        result.customer = resolvedPromises[0];
        result.points = resolvedPromises[1];
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getMerchantWisePoints = async (req,res) => {
    try{
        const {customer_id} = req.data;
        const result = await db.query(`select
                            c."businessName",
                            sum(point) points
                        from
                            transactions_histories th ,
                            companies c
                        where
                            th.company_id = c.id
                            and th.customer_id = ${customer_id}
                        group by
                            c."businessName"`);
        return res.status(200).json({returnCode:0, msg:'', data: result[0]})
    }catch(e){
        delete req.query.download;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getQRCode = async (req,res) => {
    try{
        const {customer_id} = req.data;
        const url = `${process.env.FRONTEND_BASE_URL}customer/qr?id=${customer_id}`;
        const qrCodeImage = await QRCode.toDataURL(url);
        return res.status(200).json({returnCode:0, msg:'QR generated successfully!', qrCodeImage, url})
    }catch(e){
        delete req.query.download;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const updateCustomer = async (req,res) =>{
    try{
        const {id} = req.params;
        await db.customers.update({...req.body}, {where:{id}});
        return res.status(200).json({returnCode:0, msg:'customer updated successfully!'});
    }catch(e){
        delete req.query.download;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = { 
    getAllCustomer, 
    getCustomerById, 
    createCustomer, 
    generateOtp, 
    getCustomerByEmailId, 
    customerLogin, 
    resetPassword, 
    changePassword,
    customerProfile,
    getMerchantWisePoints,
    getQRCode,
    updateCustomer
};