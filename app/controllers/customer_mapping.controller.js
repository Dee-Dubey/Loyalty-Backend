const db = require("../models");

const mapCustomerToMerchant = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { user_id } = req.data;
        await db.customer_mappings.create({...req.body, user_id});
        result.msg = 'mapped successfully!';
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { mapCustomerToMerchant };