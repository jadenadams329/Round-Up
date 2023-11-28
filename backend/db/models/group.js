"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Group extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Group.belongsToMany(models.User, {
				through: models.Membership,
				foreignKey: "groupId",
				otherKey: "userId",
			});

			Group.belongsTo(models.User, {
				foreignKey: "organizerId",
			});

			Group.hasMany(models.Group_Image, {
				foreignKey: "groupId",
			});

			Group.belongsToMany(models.Venue, {
				through: models.Event,
				foreignKey: "groupId",
				otherKey: "venueId",
			});

			Group.hasMany(models.Venue, {
				foreignKey: "groupId",
			});

			Group.hasMany(models.Event, {
				foreignKey: "groupId",
			});
		}
	}
	Group.init(
		{
			organizerId: DataTypes.INTEGER,
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			about: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM("In person"),
				allowNull: false,
			},
			private: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			city: DataTypes.STRING,
			state: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Groups",
		}
	);
	return Group;
};
