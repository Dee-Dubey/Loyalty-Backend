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
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_name: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        username: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        branch: {
            type: DataTypes.STRING,
            allowNull: false
        }          
      }, {
        timestamps: true
      });
}

module.exports = {transactions_history};