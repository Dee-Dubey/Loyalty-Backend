const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const fs = require('fs');
const createClient = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'client uploaded successfully!'}
        await db.clients.create({name: req.body.name, logo: `localhost:3000/uploads/${req.file.filename}`, description: req.body.description});
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
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
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllClient = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'client fetched!'}
        result.data = await db.clients.findAll();
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createClient, deleteClient, getAllClient}