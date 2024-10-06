const enqueries = (sequelize, DataTypes)=>{
    return sequelize.define('enqueries', {
        name: {
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
        business_details: {
            type: DataTypes.STRING,
            allowNull: true
        }
      }, {
        timestamps: true
      });
}

module.exports = {enqueries};