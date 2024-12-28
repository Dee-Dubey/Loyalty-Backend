const db = require("../models");
const { sendEmail } = require("../utilities/utilities");

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
        sendEmail(customer.email, "Your Loyalty Points Have Been Updated!", 
            `Dear ${customer.name},
                We’re pleased to inform you that your loyalty points have been successfully updated!
                Here are the details of your recent points addition:
                •	Company Name: ${req.body.businessName}
                •	Points Added: ${req.body.point}
                •	Total Points Available from ${req.body.businessName}: ${result.currentBalance}
                •	Total Points in Your Account: ${result.totalPointsInAccount}
                Thank you for choosing us! We truly appreciate your business and are excited to continue supporting your loyalty program. If you have any questions or need further assistance, please don’t hesitate to reach out.
                Best regards,

                PassMe Point Team
                `
        );
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
        sendEmail(customer.email, "Your Loyalty Points Have Been Redeemed!", 
            `Dear ${customer.name},
                We would like to inform you that your loyalty points have been successfully redeemed!
                Here are the details of your recent points redemption:
                •	Company Name: ${req.body.businessName}
                •	Points Redeemed: ${-req.body.point}
                •	Total Points Available from ${req.body.businessName}: ${result.currentBalance}
                •	Total Points in Your Account: ${result.totalPointsInAccount}
                Thank you for being a valued customer! We appreciate your business and are always here to support your loyalty program. If you have any questions or need assistance, feel free to reach out.
                Best regards,

                PassMe Point Team
                `
        );
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