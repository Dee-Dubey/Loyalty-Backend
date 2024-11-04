const jwt = require('jsonwebtoken');
const db = require('../models');
const moment = require('moment');

const auth = (req, res ,next) => {
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let { data } = jwt.verify(token, process.env.TOKEN);
        req.data = data;
        next();
    }catch(e){
        return res.status(401).json({ msg: 'Please Relogin And Try Again!' })
    }
}

const isAdmin = (req, res , next) => {
    try{
        const { role } = req.data;
        if(role === 'admin'){
            next();
        }else{
            return res.status(403).json({ msg: 'Permission Denied!', result:{}});
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: 'Something went wrong!', result:{}})
    }
}

const isSuperUser = (req, res , next) => {
    try{
        const { role } = req.data;
        if(role === 'superuser' || role === 'admin'){
            next();
        }else{
            return res.status(403).json({ msg: 'Permission Denied!', result:{}});
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: 'Something went wrong!', result:{}})
    }
}

const validateOtp = async (req, res, next)=>{
    try{
        const otp = await db.otp_masters.findOne({where:{email: req.body.email?req.body.email:req.body.username, expired: false}});
        if(!otp){
            return res.status(200).json({returnCode: 1, msg: 'otp not present!'});
        }else if(+otp.otp !== +req.body.otp){
            return res.status(200).json({returnCode: 1, msg: 'invalid otp!'});
        }
        const minuteDifference = moment().diff(otp.createdAt, 'minutes');
        if(minuteDifference > 3){
            return res.status(200).json({returnCode: 1, msg: 'otp expired'})
        }
        delete req.body.otp;
        next();
    }catch(e){
        console.log(e)
        return res.status(500).json({ msg: 'Something went wrong!'})
    }
}

module.exports = { auth, isAdmin, validateOtp, isSuperUser }