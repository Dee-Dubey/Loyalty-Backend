const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const { sendEmail } = require("../utilities/utilities");
const path = require('path');
const ejs = require('ejs');

const createEmployee = async(req, res)=>{
    try{
        const {company_id} = req.data;
        const existingUser = await db.employees.findOne({where: {email: req.body.email}});
        if(existingUser){
            return res.status(200).json({returnCode:1, msg:'email already exist!'})
        }
        const employee = await db.employees.create({...req.body, company_id});
        const user = await db.users.create({
            username: req.body.email,
            password: req.body.name.split(" ")[0],
            role: "user",
            status: true,
            employee_id: employee.id,
            company_id: employee.company_id
        });
        ejs.renderFile(path.join(__dirname, 'app','templates', 'employeeRegistration.ejs'), { 
            name: req.body.name,
            username:req.body.email,
            password: req.body.name.split(" ")[0]
        }, 
        (err, html) => {
                sendEmail(req.body.email, "Welcome to PassMe Point!",'', html);
        });
        return res.status(200).json({returnCode:0, msg:'employee created successfully!', employee, user});
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllEmployees = async(req, res)=>{
    try{
        const {company_id, role} = req.data;
        const condition = role==='admin'?{}:{where: {company_id}}
        const employees = await db.employees.findAll(condition);
        return res.status(200).json({returnCode:0, msg:'employees fetched successfully!', employees});
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getEmployeeById = async(req, res)=>{
    try{
        const {company_id} = req.data;
        const employee = await db.employees.findOne({where: {company_id, id: req.params.id}});
        return res.status(200).json({returnCode:0, msg:'employee fetched successfully!', employee});
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const updateEmployee = async(req, res)=>{
    try{
        const {company_id} = req.data;
        await db.employees.update({...req.body},{where: {company_id, id: req.params.id}});
        return res.status(200).json({returnCode:0, msg:'employee updated successfully!'});
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getEmployeeByCompanyId = async(req, res)=>{
    try{
        const employees = await db.employees.findAll({where:{company_id: req.body.id}});
        return res.status(200).json({returnCode:0, msg:'employees fetched successfully!', employees});
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createEmployee, getAllEmployees, getEmployeeById, updateEmployee, getEmployeeByCompanyId}