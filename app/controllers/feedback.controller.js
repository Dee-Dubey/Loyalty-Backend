const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");

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
        const result = {returnCode:0, msg: 'feedback fetched!'}
        result.data = await db.feedbacks.findAll();
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createFeedback, deleteFeedback, getAllfeedback}