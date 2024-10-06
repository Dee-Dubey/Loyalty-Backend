const db = require("../models");

const getAllInwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id, role } = req.data;
        if(role === 'admin'){
            result.data = await db.inward_rules.findAll();
        }else{
            result.data = await db.inward_rules.findAll({ where: { user_id } });
        }
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const getInwardRuleById = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { id } = req.params;
        result.data = await db.inward_rules.findOne({ where: { id } });
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const createInwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data;
        const rules = await db.inward_rules.findOne({ where: { amount: req.body.amount, user_id } });
        if(rules){
            result.data = rules;
            result.msg = "record already exists!";
            return res.status(200).json(result);
        }
        await db.inward_rules.create({...req.body, user_id});
        result.msg = 'created!'
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const updateInwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data;
        const { id } = req.params;
        await db.inward_rules.update({...req.body, points:1}, {where: {id, user_id}});
        result.msg = 'updated!'
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const deleteInwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const {user_id} = req.data;
        const { id } = req.params;
        await db.inward_rules.destroy({where: {id, user_id}});
        result.msg = 'deleted!';
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { getAllInwardRule, getInwardRuleById, createInwardRule, updateInwardRule, deleteInwardRule };