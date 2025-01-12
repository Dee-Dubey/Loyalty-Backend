const db = require("../models");
const { downloadExcel } = require("../utilities/utilities");

const getAllInwardRule = async (req, res) => {
    try{
        const { company_id } = req.data;
        const filters = JSON.parse(req.query.filters?req.query.filters:'{}');
        if(!filters.hasOwnProperty('where')){
            filters.where = {company_id};
        }else{
            filters.where.company_id = company_id;
        }
        const result = {returnCode: 0 }
        result.data = await db.inward_rules.findAll(filters);
        filters.limit = null;
        filters.offset = null;
        result.count = await db.inward_rules.count(filters);
        if(req.query.download){
            return downloadExcel(result.data, res, 'inward_rules');
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
        delete req.query.download;;
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const createInwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { company_id, user_id } = req.data;
        const rules = await db.inward_rules.findOne({ where: { amount: req.body.amount, company_id } });
        if(rules){
            result.data = rules;
            result.msg = "record already exists!";
            return res.status(200).json(result);
        }
        await db.inward_rules.create({...req.body, company_id, created_by: user_id});
        result.msg = 'created!'
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;;
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const updateInwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { company_id } = req.data;
        const { id } = req.params;
        await db.inward_rules.update({...req.body, points:1}, {where: {id, company_id}});
        result.msg = 'updated!'
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;;
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const deleteInwardRule = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const {company_id} = req.data;
        const { id } = req.params;
        await db.inward_rules.destroy({where: {id, company_id}});
        result.msg = 'deleted!';
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;;
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { getAllInwardRule, getInwardRuleById, createInwardRule, updateInwardRule, deleteInwardRule };