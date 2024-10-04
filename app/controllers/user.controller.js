const db = require("../models");

const getAllUsers = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id, role } = req.data;
        if(role === 'admin'){
            result.data = await db.users.findAll();
        }else{
            result.data = await db.users.findAll({ where: { user_id } });
        }
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const createUser= async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id, role } = req.data;
        await db.users.upsert({...req.body, user_id});
        result.msg = 'created successfully!';
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const updateUser = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data;
        const { id } = req.params;
        await db.users.update({...req.body}, {where:{id, user_id}});
        result.msg = 'updated successfully!';
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { getAllUsers, createUser, updateUser};