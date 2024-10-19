const { Op } = require("sequelize");
const db = require("../models");

const getAllTransaction = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id, role } = req.data;
        if(role === 'admin'){
            result.data = await db.transactions_history.findAll({...req.query});
        }else{
            result.data = await db.transactions_history.findAll({ where: { user_id, ...req.query } });
        }
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const getCustomerTransactions = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { id } = req.params;
        result.data = await db.transactions_history.findAll({ where: { customer_id: id, ...req.query } });
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const addPoints = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data;
        const data = await db.inward_rules.findOne({where: {user_id}});
        if(!data){
            return res.status(200).json({returnCode:1, msg:'please set the inward rules first!'})
        }
        const { amount } = data;
        req.body.point = parseInt(req.body.amount/amount);
        await db.transactions_history.create({...req.body, user_id});
        result.msg = 'points added successfully!';
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const redeemPoints = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data;
        const outward = await db.outward_rules.findOne({where: {user_id}});
        if(!outward){
            return res.status(200).json({returnCode:1, msg:'please set the redeem rules first!'})
        }
        const balance = await db.transactions_history.sum('point', {where:{customer_id:req.body.customer_id, user_id}})
        if(req.body.point > balance){
            result.returnCode = 1
            result.message = 'reedem points should be less than available points';
            return res.status(200).json(result);
        }
        req.body.value = req.body.point * outward.amount;
        req.body.point= -req.body.point;
        await db.transactions_history.create({...req.body, user_id});
        result.msg = 'redeemed successfully!';
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const getCustomerTransactionByUserId = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data
        result.data = await db.transactions_history.findAll({ where: { user_id } });
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { getAllTransaction, getCustomerTransactions, addPoints, redeemPoints, getCustomerTransactionByUserId };