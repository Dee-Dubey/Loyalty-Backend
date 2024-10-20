const moment = require("moment");
const db = require("../models");
const { sendEmail } = require("../utilities/utilities");
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { ERROR_RESPONSE } = require("../constants");
const jwt = require('jsonwebtoken');

const getAllCustomer = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id, role } = req.data;
        const limit = req.query.limit?req.query.limit:10;
        const offset = req.query.offset?req.query.offset:0;
        const query = `select
                                distinct c.id,
                                c."name" ,
                                c.email,
                                c.address,
                                c.status,
                                c.contact,
                                c."countryCode"
                            from
                                customers c ,
                                customer_mappings cm
                            where
                                c.id = cm.customer_id ${role!== 'admin'? 'and cm.user_id ='+user_id:''} limit ${limit} offset ${offset}`
        const data = await db.query(query);
        result.data = data[0];
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getCustomerById = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { id } = req.params;
        const { user_id } = req.data;
        const customer_mappings = await db.customer_mappings.findOne({where:{customer_id:id, user_id}});
        if(!customer_mappings){
            await db.customer_mappings.create({customer_id:id, user_id});
        }
        const promises = [ db.transactions_history.sum('point', {where:{customer_id:id, user_id}}), db.customers.findOne({ where: { id } })];
        result.data = await Promise.all(promises);
        return res.status(200).json(result);
    }catch(e){
        console.log(e)
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const createCustomer = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.body;
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
            return res.status(200).json(result);
        }
        const data = await db.customers.create({...req.body, user_id});
        await db.customer_mappings.create({customer_id:data.id, user_id});
        const url = `http://localhost:3000/customer?customer_id=${data.id}`;
        const qrCodeImage = await QRCode.toDataURL(url);
        sendEmail(req.body.email, "Registered Successfully!", "Dear, Customer thank you for registering under loyality program",
             `<h1>Hello</h1><p>Here is an embedded base64 image:</p><img src="${qrCodeImage}" alt="Embedded Image" />`
            )
        result.qr_code = qrCodeImage;
        return res.status(200).json(result);
    }catch(e){
        console.log(e)
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const generateOtp = async(req, res) =>{
    const result = {returnCode: 0, msg: 'otp generated successfully!' }
    try{
      await db.otp_masters.update({expired: true}, {where:{email: req.body.email} })
      const randomUUID = uuidv4();
      const otp = randomUUID.replace(/\D/g, '').substring(0, 4);
      result.otp = await db.otp_masters.create({otp, email: req.body.email });
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
        console.log(e)
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const customerLogin = async (req, res) => {
    try{
        const { email, password } = req.body;
        let data = await db.customers.findOne({ where: { email, password, status: true } });
        if(data){
            const { id: customer_id, email, role} = data.toJSON();
            const token = jwt.sign({ data: {customer_id, email, role}}, process.env.TOKEN, { expiresIn: 60 * 60 * 6});
            const result = { token, customer_id, role }
            return res.status(200).json({returnCode: 0, msg: 'Login Successful!', result });
        }else{
            return res.status(200).json({returnCode: 1, msg: 'invalid credentials!' });
        }
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const resetPassword = async (req, res) =>{
    try{
        await db.customers.update({password: req.body.password},{where: {email: req.body.email}})
        return res.status(200).json({returnCode:0, msg: 'password reset successfully!'});
    }catch(e){
        console.log(e)
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
        console.log(e)
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
    changePassword 
};