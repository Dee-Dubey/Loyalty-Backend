const { Op } = require("sequelize");
const db = require("../models");

const getAllTransaction = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id, role } = req.data;
        if(role === 'admin'){
            result.data = await db.transactions_history.findAll();
        }else{
            result.data = await db.transactions_history.findAll({ where: { user_id } });
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
        result.data = await db.transactions_history.findAll({ where: { customer_id: id } });
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const addPoints = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data;
        const data = await db.inward_rules.findAll({where: {user_id}});
        const { amount } = data[0];
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
        const data = await db.outward_rules.findAll({where: {user_id}});
        const { points, amount } = data[0];
        if(req.body.redeem_points > points){
            result.returnCode = 1
            result.message = 'reedem points should be less than available points';
            return res.status(200).json(result);
        }
        req.body.point = req.value.points;
        req.body.value = 0;
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
        const { id } = req.params;
        const { user_id } = req.data
        result.data = await db.transactions_history.findAll({ where: { customer_id: id, user_id } });
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { getAllTransaction, getCustomerTransactions, addPoints, redeemPoints, getCustomerTransactionByUserId };