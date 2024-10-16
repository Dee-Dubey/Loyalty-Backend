const clients = (sequelize, DataTypes)=>{
    return sequelize.define('clients', {
        name: {
            type: DataTypes.STRING
        },
        logo: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }     
      }, {
        timestamps: true
      });
}

module.exports = {clients};