"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Group_Image extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Group_Image.belongsTo(models.Group, {
				foreignKey: "groupId",
			});
		}
	}
	Group_Image.init(
		{
			groupId: DataTypes.INTEGER,
			url: DataTypes.STRING,
			preview: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Group_Image",
		}
	);
	return Group_Image;
};
