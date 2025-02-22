const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const { downloadExcel } = require("../utilities/utilities");

const createFeedback = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'feedback sybmitted successfully!'}
        await db.feedbacks.create({...req.body});
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}


const deleteFeedback = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'feedback deleted successfully!'}
        const {id} = req.params;
        await db.feedbacks.destroy({where:{id}});
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllfeedback = async(req, res) => {
    try{
        const filters = JSON.parse(req.query.filters?req.query.filters:'{}');
        const result = {returnCode:0, msg: 'feedback fetched!'}
        result.data = await db.feedbacks.findAll(filters);
        filters.limit = null;
        filters.offset = null;
        result.count = await db.feedbacks.count(filters);
        if(req.query.download){
            return downloadExcel(result.data, res, 'feedbacks');
        }
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getFeedbackById = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'feedback fetched!'}
        result.data = await db.feedbacks.findOne({where:{id: req.params.id}});
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const updateFeedback = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'feedback updated successfully!'}
        await db.feedbacks.update({...req.body},{where:{id: req.params.id}});
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createFeedback, deleteFeedback, getAllfeedback, getFeedbackById, updateFeedback}