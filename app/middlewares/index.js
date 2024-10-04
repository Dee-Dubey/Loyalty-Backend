const jwt = require('jsonwebtoken');

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
        return res.status(500).json({ msg: 'Something went wrong!', result:{}})
    }
}

module.exports = { auth, isAdmin }