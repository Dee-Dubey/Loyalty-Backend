const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const fs = require('fs');
const { downloadExcel } = require("../utilities/utilities");
require('dotenv').config('../../.env');


const createClient = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'client uploaded successfully!'}
        await db.clients.create({name: req.body.name, logo: `${process.env.BACKEND_BASE_URL}uploads/${req.file.filename}`, description: req.body.description});
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;;
        return res.status(500).json(ERROR_RESPONSE);
    }
}


const deleteClient = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'client deleted successfully!'}
        const {id} = req.params;
        const client= await db.clients.findOne({where:{id}});
        const splitedFileName = client.logo.split('/');
        fs.unlinkSync(`public/${splitedFileName[splitedFileName.length -1]}`)
        await db.clients.destroy({where:{id}});
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllClient = async(req, res) => {
    try{
        const filters = JSON.parse(req.query.filters?req.query.filters:'{}');
        const result = {returnCode:0, msg: 'client fetched!'};
        const clients = await db.clients.findAll(filters);
        result.data = clients;
        filters.limit = null;
        filters.offset = null;
        result.count = await db.clients.count(filters);
        if(req.query.download){
            return downloadExcel(clients, res, 'clients');
        }
        return res.status(200).json(result);
    }catch(e){
        delete req.query.download;;
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createClient, deleteClient, getAllClient}