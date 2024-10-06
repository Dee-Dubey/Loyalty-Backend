const otp_masters = (sequelize, DataTypes)=>{
    return sequelize.define('otp_masters', {
        otp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }     
      }, {
        timestamps: true
      });
}

module.exports = {otp_masters};