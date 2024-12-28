const { ERROR_RESPONSE } = require("../constants");
const db = require("../models");
const { sendEmail } = require("../utilities/utilities");

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
        sendEmail(req.body.email, "Welcome to PassMe Point Team!", 
            `Dear ${req.body.name},
                Welcome to PassMe Point! We’re excited to have you as part of the team at [Company Name].
                Your account has been created, and here are your login details:
                •	Username: ${req.body.email}
                •	Password: ${req.body.name.split(" ")[0]}
                You can log in to your account at [https://passmepoints.com/login].
                Through your account, you’ll have access to tools and features that help manage and enhance the company’s loyalty program effectively. Should you have any questions or need support, please feel free to reach out to your manager or our support team at info@buypassme.com .
                We’re thrilled to have you on board and look forward to your contributions!
                Best regards,

                PassMe Point Team`
        );
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