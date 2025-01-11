const db = require("../models");
const { downloadExcel } = require("../utilities/utilities");

const getAllOutwardRule = async (req, res) => {
    try{
        const filters = JSON.parse(req.query.filters?req.query.filters:'{}');
        const result = {returnCode: 0 }
        const { company_id } = req.data;
        filters.where.company_id = company_id;
        result.data = await db.outward_rules.findAll(filters);
        filters.limit = null;
        filters.offset = null;
        result.count = await db.outward_rules.count(filters);
        if(req.query.download){
            return downloadExcel(result.data, res, 'outward_rules');
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
        const { company_id, user_id } = req.data;
        const rules = await db.outward_rules.findOne({ where: { amount: req.body.amount, company_id } });
        if(rules){
            result.data = rules;
            result.msg = "record already exists!";
            return res.status(200).json(result);
        }
        await db.outward_rules.create({...req.body, company_id, created_by: user_id});
        result.msg = 'created!'
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const updateOutwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { company_id } = req.data;
        const { id } = req.params;
        const data = await db.outward_rules.update({...req.body}, {where: {id, company_id}});
        result.msg = 'updated!'
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const deleteOutwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const {company_id} = req.data;
        const { id } = req.params;
        await db.outward_rules.destroy({where: {id, company_id}});
        result.msg = 'deleted!';
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { getAllOutwardRule, getOutwardRuleById, createOutwardRule, updateOutwardRule, deleteOutwardRule };