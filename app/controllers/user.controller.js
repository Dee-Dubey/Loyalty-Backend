const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");

const getAllUsers = async (req, res) => {
    try {
        const {company_id, role} = req.data;
        const condition = role==='admin'?{where:{...req.query}}:{where:{...req.query, company_id}}
        const data = await db.users.findAll(condition);
        return res.status(200).json({ returnCode: 0, msg:'user fetched successfully!', data });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: 'Something went wrong!' });
    }
}

const createUser= async (req, res) => {
    try{
        const result = {returnCode: 0 };
        const { user_id } = req.data; 
        if(!req.body.id){
            const user = await db.users.findOne({where:{email:req.body.email}});
            if(user){
                return res.status(200).json({returnCode:1, msg:'user already exists!'});
            }
            result.user = (await db.users.upsert({...req.body, user_id}))[0];
        }else{
            result.user = (await db.users.upsert({...req.body, user_id}))[0];
        }
        result.msg = 'created successfully!';
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: 'Something went wrong!' });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.users.update({...req.body}, {where:{id}});
        return res.status(200).json({ returnCode: 0, msg:'user updated successfully!' });
    } catch (e) {
        console.log(e)
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const changePassword = async (req, res) => {
    try{
        const {user_id} = req.data;
        await db.users.update({password: req.body.password}, {where: {id: user_id}});
        return res.status(200).json({returnCode:0, msg:'password changes successfully'});
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getUserById = async (req, res) =>{
    try{
        const {id} = req.params;
        const user = await db.users.findOne({where:{id}});
        return res.status(200).json({returnCode:0, msg: 'user fetched successfully!' ,user});
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const resetPassword = async (req, res) =>{
    try{
        await db.users.update({password: req.body.password},{where: {username: req.body.username}})
        return res.status(200).json({returnCode:0, msg: 'password reset successfully!'});
    }catch(e){
        console.log(e)
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const userProfile = async (req, res) =>{
    try{
        const response = { returnCode:0, msg:'profile fetched successfully!'}
        const {company_id, user_id, role} = req.data;
        const resolvedPromises = await Promise.all([
            await db.users.findOne({where:{id: user_id}}),
            await db.companies.findOne({where:{id: company_id}})
        ]);
        response.user = resolvedPromises[0];
        response.company = resolvedPromises[1];
        if(role === 'user'){
            console.log(await db.employees.findOne({where:{id: resolvedPromises[0].dataValues.employee_id}}))
            response.employee = await db.employees.findOne({where:{id: resolvedPromises[0].dataValues.employee_id}})
        }
        return res.status(200).json(response);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = { getAllUsers, createUser, updateUser, changePassword, getUserById, resetPassword, userProfile};
