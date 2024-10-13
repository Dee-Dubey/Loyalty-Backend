const db = require("../models");

const getAllOutwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id, role } = req.data;
        if(role === 'admin'){
            result.data = await db.outward_rules.findAll();
        }else{
            result.data = await db.outward_rules.findAll({ where: { user_id } });
        }
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const getOutwardRuleById = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { id } = req.params;
        result.data = await db.outward_rules.findOne({ where: { id } });
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const createOutwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id, role } = req.data;
        await db.outward_rules.create({...req.body, user_id});
        result.msg = 'created!'
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const updateOutwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data;
        const { id } = req.params;
        const data = await db.outward_rules.update({...req.body}, {where: {id, user_id}});
        result.msg = 'updated!'
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const deleteOutwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const {user_id} = req.data;
        const { id } = req.params;
        await db.outward_rules.destroy({where: {id, user_id}});
        result.msg = 'deleted!';
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { getAllOutwardRule, getOutwardRuleById, createOutwardRule, updateOutwardRule, deleteOutwardRule };