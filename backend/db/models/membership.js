'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
<<<<<<< HEAD
      // define association here
=======
      Membership.belongsTo(models.Group, {foreignKey: "groupId"})
      Membership.belongsTo(models.User, { foreignKey: "userId" })
>>>>>>> dev
    }
  }
  Membership.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('co-host', 'member', 'pending'),
      allowNull: false
    }
  }, {
    sequelize,
<<<<<<< HEAD
    modelName: 'Memberships',
=======
    modelName: 'Membership',
>>>>>>> dev
  });
  return Membership;
};
