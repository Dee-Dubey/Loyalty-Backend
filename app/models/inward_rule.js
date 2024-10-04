const inward_rules = (sequelize, DataTypes)=>{
    return sequelize.define('inward_rules', {
        points: {
            type: DataTypes.INTEGER
        },
        amount: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        }     
      }, {
        timestamps: true
      });
}

module.exports = {inward_rules};