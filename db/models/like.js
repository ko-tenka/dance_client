'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
 
    static associate({ User, Task }) {
      this.belongsTo(User, { foreignKey: 'user_id' });
      this.belongsTo(Task, { foreignKey: 'task_id' });
    }
  }
  Like.init({
    user_id: DataTypes.INTEGER,
    task_id: DataTypes.INTEGER,
    correct: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};