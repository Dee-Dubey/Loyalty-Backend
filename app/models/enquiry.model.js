const enqueries = (sequelize, DataTypes)=>{
    return sequelize.define('enqueries', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        businessName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currencyType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        businessDetails: {
            type: DataTypes.STRING,
            allowNull: true
        },
        businessType: {
            type: DataTypes.STRING,
            allowNull: true
        }
      }, {
        timestamps: true
      });
}

module.exports = {enqueries};