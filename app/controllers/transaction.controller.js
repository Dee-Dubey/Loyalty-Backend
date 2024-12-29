const db = require("../models");
const { sendEmail } = require("../utilities/utilities");
const path = require('path');
const ejs = require('ejs');

const getAllTransaction = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { company_id, user_id, role, customer_id, branch } = req.data;
        if(role === 'admin'){
            result.data = await db.transactions_history.findAll({where: {...req.query} });
        }else if(role === 'superuser'){
            result.data = await db.transactions_history.findAll({where: {company_id, ...req.query} });
        }else if(role === 'customer'){
            result.data = await db.transactions_history.findAll({where: {customer_id, ...req.query} });
        }else if(role === 'user'){
            result.data = await db.transactions_history.findAll({ where: { created_by: user_id, ...req.query } });
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
        const { company_id, user_id, username, branch } = req.data;
        const data = await db.inward_rules.findOne({where: {company_id}});
        result.previousBalance = await db.transactions_history.sum('point', {where:{customer_id:req.body.customer_id, company_id}});
        if(!data){
            return res.status(200).json({returnCode:1, msg:'please set the inward rules first!'})
        }
        const { amount } = data;
        req.body.point = parseInt(req.body.amount/amount);
        await db.transactions_history.create({...req.body,invoice_no:req.body.invoiceNo, company_id, created_by: user_id, username, branch});
        result.currentBalance = await db.transactions_history.sum('point', {where:{customer_id:req.body.customer_id, company_id}});
        result.totalPointsInAccount = await db.transactions_history.sum('point', {where:{customer_id:req.body.customer_id}});
        result.msg = 'points added successfully!';
        const customer = await db.customers.findOne({where:{id: req.body.customer_id}});
        ejs.renderFile(path.join(__dirname, 'app','templates', 'add.ejs'), { 
            name: customer.name,
            businessName: req.body.businessName,
            point: req.body.point,
            currentBalance: result.currentBalance,
            totalPointsInAccount: result.totalPointsInAccount
        }, 
        (err, html) => {
                sendEmail(req.body.email, "Welcome to PassMe Point!",'', html);
        });
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const redeemPoints = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { company_id, user_id, username, branch } = req.data;
        const outward = await db.outward_rules.findOne({where: {company_id}});
        result.previousBalance = await db.transactions_history.sum('point', {where:{customer_id:req.body.customer_id, company_id}});
        if(!outward){
            return res.status(200).json({returnCode:1, msg:'please set the redeem rules first!'})
        }
        const balance = await db.transactions_history.sum('point', {where:{customer_id:req.body.customer_id, company_id}})
        if(req.body.point > balance){
            result.returnCode = 1
            result.message = 'reedem points should be less than available points';
            return res.status(200).json(result);
        }
        req.body.value = req.body.point * outward.amount;
        req.body.point= -req.body.point;
        await db.transactions_history.create({...req.body, company_id, created_by: user_id, username, branch});
        result.currentBalance = await db.transactions_history.sum('point', {where:{customer_id:req.body.customer_id, company_id}});
        result.msg = 'redeemed successfully!';
        const customer = await db.customers.findOne({where:{id: req.body.customer_id}});
        result.totalPointsInAccount = await db.transactions_history.sum('point', {where:{customer_id:req.body.customer_id}});
        ejs.renderFile(path.join(__dirname, 'app','templates', 'redeem.ejs'), { 
            name: customer.name,
            businessName: req.body.businessName,
            point: -req.body.point,
            currentBalance: result.currentBalance,
            totalPointsInAccount: result.totalPointsInAccount
        }, 
        (err, html) => {
                sendEmail(req.body.email, "Welcome to PassMe Point!",'', html);
        });
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

const getCustomerTransactionByUserId = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { company_id } = req.data
        result.data = await db.transactions_history.findAll({ where: { company_id } });
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { getAllTransaction, getCustomerTransactions, addPoints, redeemPoints, getCustomerTransactionByUserId };