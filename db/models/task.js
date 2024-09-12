'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {

    static associate({User, Like}) {
      this.belongsTo(User, { foreignKey: 'user_id' });
      this.hasMany(Like, { foreignKey: 'task_id' });
    }
  }
  Task.init({
    img: DataTypes.BLOB,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};