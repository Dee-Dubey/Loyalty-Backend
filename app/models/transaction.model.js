const transactions_history = (sequelize, DataTypes)=>{
    return sequelize.define('transactions_history', {
        invoice_no: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        point: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        customer_id: {
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

module.exports = {transactions_history};