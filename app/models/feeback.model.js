const feedbacks = (sequelize, DataTypes)=>{
    return sequelize.define('feedbacks', {
        name: {
            type: DataTypes.STRING
        },
        rating: {
            type: DataTypes.INTEGER
        },
        feedback: {
            type: DataTypes.STRING
        }     
      }, {
        timestamps: true
      });
}

module.exports = {feedbacks};