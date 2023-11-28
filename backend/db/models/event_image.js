'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event_Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event_Image.belongsTo(models.Event, {
        foreignKey: 'eventId'
      })
    }
  }
  Event_Image.init({
    eventId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
<<<<<<< HEAD
    modelName: 'Event_Images',
=======
    modelName: 'Event_Image',
>>>>>>> dev
  });
  return Event_Image;
};
