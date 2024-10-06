const moment = require("moment");
const db = require("../models");
const { sendEmail } = require("../utilities/utilities");
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const getAllCustomer = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id, role } = req.data;
        if(role === 'admin'){
            const data = await db.query(`select
                                distinct c.id,
                                c."name" ,
                                c.email,
                                c.address,
                                c.status
                            from
                                customers c ,
                                customer_mappings cm
                            where
                                c.id = cm.customer_id`);
            result.data = data[0]
        }else{
            const data = await db.query(`select
                            distinct c.id,
                            c."name" ,
                            c.email,
                            c.address,
                            c.status
                        from
                            customers c ,
                            customer_mappings cm
                        where
                            c.id = cm.customer_id
                            and cm.user_id =${user_id}`);
            result.data = data[0];
        }
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const getCustomerById = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { id } = req.params;
        result.data = await db.customers.findOne({ where: { id } });
        return res.status(200).json(result);
    }catch(e){
        console.log(e)
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const createCustomer = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data;
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
        const url = `http://example.com?customer_id=${data.id}`;
        const qrCodeImage = await QRCode.toDataURL(url);
        sendEmail(req.body.email, "Registered Successfully!", "Dear, Customer thank you for registering under loyality program",
             `<h1>Hello</h1><p>Here is an embedded base64 image:</p><img src="${qrCodeImage}" alt="Embedded Image" />`
            )
        result.qr_code = qrCodeImage;
        return res.status(200).json(result);
    }catch(e){
        console.log(e)
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const generateOtp = async(req, res) =>{
    const result = {returnCode: 0, msg: 'otp generated successfully!' }
    try{
      const randomUUID = uuidv4();
      const otp = randomUUID.replace(/\D/g, '').substring(0, 4);
      result.otp = await db.otp_masters.create({otp, email: req.body.email });
      return res.status(200).json(result);
    }catch(e){
      result.message= "failed to generate OTP!";
      return res.status(500).json(result);
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
        result.msg = 'Something went wrong!'
        return res.status(500).json(result);
    }
}

module.exports = { getAllCustomer, getCustomerById, createCustomer, generateOtp, getCustomerByEmailId };