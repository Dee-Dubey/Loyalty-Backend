const users = (sequelize, DataTypes)=>{
    return sequelize.define('users', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM,
            values: ['admin', 'superuser', 'user'],
            defaultValue: 'superuser',
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        employee_id:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }       
      }, {
        timestamps: true
      });
}

module.exports = {users};