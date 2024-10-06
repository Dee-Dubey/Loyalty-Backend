const db = require("../models");
const { sendEmail } = require("../utilities/utilities");
const QRCode = require('qrcode');

const getAllUsers = async (req, res) => {
    try {
        const result = { returnCode: 0 }
        const { user_id, role } = req.data;
        if (role === 'admin') {
            result.data = await db.users.findAll();
        } else {
            result.data = await db.users.findAll({ where: { user_id } });
        }
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ msg: 'Something went wrong!' });
    }
}

const createUser= async (req, res) => {
    try{
        const result = {returnCode: 0 };
        const { user_id } = req.data;
        let operationType = "insert";
        if(req.body.id) 
            operationType = 'update'
        result.user = await db.users.upsert({...req.body, user_id});
        if(operationType === 'insert'){
            const url = `http://example.com?user_id=${result.user[0].id}`;
            const qrCodeImage = await QRCode.toDataURL(url);
            sendEmail(req.body.email, "Registered Successfully!", "Dear, Customer thank you for registering under loyality program",
                `<h1>Hello</h1><p>Here is an embedded base64 image:</p><img src="${qrCodeImage}" alt="Embedded Image" />`
                );
            result.url = url;
            result.qr_code = qrCodeImage;
        }
        result.msg = 'created successfully!';
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ msg: 'Something went wrong!' });
    }
}

const updateUser = async (req, res) => {
    try {
        const result = { returnCode: 0 }
        const { user_id } = req.data;
        const { id } = req.params;
        await db.users.update({...req.body}, {where:{id, user_id}});
        result.msg = 'user updated successfully!';
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ msg: 'Something went wrong!' });
    }
}

const changePassword = async () => {
    const result = {returnCode:0, msg:'password changes successfully'}
    try{
        const {user_id} = req.data;
        await db.users.update({password: req.body.password}, {where: {id: user_id}});
        return res.status(200).json(result);
    }catch(e){
        result.msg = "something went wrong!"
        return res.status(500).json(result);
    }
}

module.exports = { getAllUsers, createUser, updateUser, changePassword};
