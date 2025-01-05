const db = require("../models");
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try{
        const { username, password } = req.body;
        let data = await db.users.findOne({ where: { username, password } });
        if(data){
            const payload = data.toJSON();
            const { id: user_id, username, role, company_id, status } = payload;
            if(!status){
                return res.status(200).json({returnCode: 1, msg: 'user is blocked!',});
            }
            let employee;
            if(role === 'user'){
                employee = (await db.employees.findOne({where:{id:payload?.employee_id}})).toJSON();
            }
            const token = jwt.sign({ data: {user_id, username, role, company_id, branch: employee?.branch}}, process.env.TOKEN, { expiresIn: 60 * 60 * 6});
            const result = { token, user_id, role }
            return res.status(200).json({returnCode: 0, msg: 'Login Successful!', result });
        }
        return res.status(200).json({returnCode: 1, msg: 'Login Failed!', result:{} });
    }catch(e){
        delete req.query.download;;
        return res.status(500).json({returnCode: 1, msg: 'Something went wrong!' });
    }
}

const resetPassword = async () => {
    const result = {returnCode:0, msg:'password reset successfully'}
    try{
        await db.users.update({password: req.body.password}, {where: {username: req.body.username}});
        return res.status(200).json(result);
    }catch(e){
        result.msg = "something went wrong!"
        return res.status(500).json(result);
    }
}

module.exports = { login, resetPassword };