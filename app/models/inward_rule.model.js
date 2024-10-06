const inward_rules = (sequelize, DataTypes)=>{
    return sequelize.define('inward_rules', {
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }     
      }, {
        timestamps: true
      });
}

module.exports = {inward_rules};