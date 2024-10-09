const customer_mappings = (sequelize, DataTypes)=>{
    return sequelize.define('customer_mappings', {
        customer_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        }     
      }, {
        timestamps: true
      });
}

module.exports = {customer_mappings};