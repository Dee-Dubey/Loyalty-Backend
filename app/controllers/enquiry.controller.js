const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");

const createEnquiry = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'enquiry created successfully!'}
        await db.enqueries.create({...req.body});
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}


const deleteEnquiry = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'enquiry deleted successfully!'}
        const {id} = req.params;
        await db.enqueries.distroy({id});
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllEnquiry = async(req, res) => {
    try{
        const result = {returnCode:0, msg: 'enquiry fetched!'}
        result.data = await db.enqueries.findAll();
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const convertEnquiryToUser = async(req, res) =>{
    try{
        const result = {returnCode:0, msg: 'enquiry converted to user!'};
        const enquiry = await db.enqueries.findOne({where: {id: req.body.id}});
        if(!enquiry){
            result.returnCode = 1;
            result.msg = "enquiry not present!"
        }else{
            await db.users.create({
                name: enquiry.name,
                category: "others",
                contact: enquiry.contact,
                email: enquiry.email,
                address: enquiry.address,
                password: enquiry.name.split(' ')[0]
            });
            await db.enqueries.destroy({where:{id:enquiry.id}});
        }
        return res.status(200).json(result);
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createEnquiry, deleteEnquiry, getAllEnquiry, convertEnquiryToUser}