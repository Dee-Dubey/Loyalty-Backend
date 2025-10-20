const customers = (sequelize, DataTypes)=>{
    return sequelize.define('customers', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country_code: {
            type: DataTypes.STRING,
            defaultValue: false
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }      
      }, {
        timestamps: true
      });
}

module.exports = {customers};