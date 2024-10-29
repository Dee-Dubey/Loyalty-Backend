const outward_rules = (sequelize, DataTypes)=>{
    return sequelize.define('outward_rules', {
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
      }, {
        timestamps: true
      });
}

module.exports = {outward_rules};