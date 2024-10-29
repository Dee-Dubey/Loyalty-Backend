const db = require("../models");

const mapCustomerToMerchant = async (req, res) => {
    try{
        const result = {returnCode: 0 }
        const { company_id } = req.data;
        await db.customer_mappings.create({...req.body, company_id});
        result.msg = 'mapped successfully!';
        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({msg: 'Something went wrong!' });
    }
}

module.exports = { mapCustomerToMerchant };