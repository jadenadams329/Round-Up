"use strict";
const { Model, Op } = require("sequelize");
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

	Group_Image.addHook("afterCreate", async (groupImage, options) => {
		if (groupImage.preview) {
			await Group_Image.update(
				{ preview: false },
				{
					where: {
						groupId: groupImage.groupId,
						id: { [Op.ne]: groupImage.id },
						preview: true,
					},
				}
			);
		}
	});
	return Group_Image;
};
