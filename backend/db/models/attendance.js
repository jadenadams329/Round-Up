'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
<<<<<<< HEAD
      // define association here
=======
      Attendance.belongsTo(models.Event, { foreignKey: "eventId" });
      Attendance.belongsTo(models.User, { foreignKey: "userId" });
>>>>>>> dev
    }
  }
  Attendance.init({
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('attending', 'waitlist', 'pending'),
      allowNull: false
    }
  }, {
    sequelize,
<<<<<<< HEAD
    modelName: 'Attendances',
=======
    modelName: 'Attendance',
>>>>>>> dev
  });
  return Attendance;
};
