const employees = (sequelize, DataTypes)=>{
    return sequelize.define('employees', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        branch: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }       
      }, {
        timestamps: true
      });
}

module.exports = {employees};