const companies = (sequelize, DataTypes)=>{
    return sequelize.define('companies', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currencyType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        businessName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        businessType: {
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

module.exports = {companies};