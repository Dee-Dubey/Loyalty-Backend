const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const { sendEmail, downloadExcel } = require("../utilities/utilities");
const path = require('path');
const ejs = require('ejs');
const { Op } = require("sequelize");

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
        const company = await db.companies.findOne({where:{id: employee.company_id}});
        ejs.renderFile('app/templates/employeeRegistration.ejs', { 
            name: req.body.name,
            username:req.body.email,
            password: req.body.name.split(" ")[0],
            companyName : company.name
        }, 
        (err, html) => {
            console.log(err);
            if(html){
                sendEmail(req.body.email, "Welcome to PassMe Point!",'', html);
            }
        });
        return res.status(200).json({returnCode:0, msg:'employee created successfully!', employee, user});
    }catch(e){
        console.log(e);
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getAllEmployees = async(req, res)=>{
    try{
        const filters = JSON.parse(req.query.filters?req.query.filters:'{}');
        if(filters.where.createdAt){
            const startOfDay = new Date(`${filters.where.createdAt}T00:00:00Z`); // Start of the day
            const endOfDay = new Date(`${filters.where.createdAt}T23:59:59Z`); // End of the day

            filters.where = {...filters.where, createdAt: {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay
                }}
        }
        const {company_id, role} = req.data;
        filters.where.company_id = company_id;
        const employees = await db.employees.findAll(filters);
        filters.limit = null;
        filters.offset = null;
        const count = await db.employees.count(filters);
        if(req.query.download){
            return downloadExcel(employees, res, 'employees');
        }
        return res.status(200).json({returnCode:0, msg:'employees fetched successfully!', employees, count});
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
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const updateEmployee = async(req, res)=>{
    try{
        const {company_id} = req.data;
        await db.employees.update({...req.body},{where: {company_id, id: req.params.id}});
        return res.status(200).json({returnCode:0, msg:'employee updated successfully!'});
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

const getEmployeeByCompanyId = async(req, res)=>{
    try{
        const employees = await db.employees.findAll({where: {company_id: req.body.id}});
        if(req.query.download){
            return downloadExcel(data[0], res, 'customers');
        }
        return res.status(200).json({returnCode:0, msg:'employees fetched successfully!', employees});
    }catch(e){
        return res.status(500).json(ERROR_RESPONSE);
    }
}

module.exports = {createEmployee, getAllEmployees, getEmployeeById, updateEmployee, getEmployeeByCompanyId}