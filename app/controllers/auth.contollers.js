const db = require("../models");
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        let data = await db.users.findOne({ where: { email, password, status: true } });
        if(data){
            const { id: user_id, email, role} = data.toJSON();
            const token = jwt.sign({ data: {user_id, email, role}}, process.env.TOKEN, { expiresIn: 60 * 60 * 6});
            const result = { token, user_id, role }
            return res.status(200).json({returnCode: 0, msg: 'Login Successful!', result });
        }
        return res.status(200).json({returnCode: 1, msg: 'Login Failed!', result:{} });
    }catch(e){
        console.log(e);
        return res.status(500).json({returnCode: 1, msg: 'Something went wrong!' });
    }
}

const resetPassword = async () => {
    const result = {returnCode:0, msg:'password reset successfully'}
    try{
        await db.users.update({password: req.body.password}, {where: {email: req.body.email}});
        return res.status(200).json(result);
    }catch(e){
        result.msg = "something went wrong!"
        return res.status(500).json(result);
    }
}

module.exports = { login, resetPassword };