"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Group extends Model {
		static associate(models) {
			Group.belongsTo(models.User, {
				foreignKey: "organizerId",

			});

			Group.hasMany(models.Membership, {
				foreignKey: "groupId",
			});

			Group.hasMany(models.Group_Image, {
				foreignKey: "groupId",
			});

			Group.hasMany(models.Venue, {
				foreignKey: "groupId",
			});

			Group.hasMany(models.Event, {
				foreignKey: "groupId",
			});
		}

		static async getAllGroups() {
			const result = await Group.findAll({
				include: [
					{
						model: sequelize.models.Membership,
						separate: true,
					},
					{
						model: sequelize.models.Group_Image,
						separate: true,
					},
				],
				group: ["Group.id"],
			});

			const groups = Group.organizeGroupDetails(result);

			return groups;
		}

		static async getUserGroups(userId) {
			let allGroups = [];

			const created = await Group.scope({
				method: ["currentUserCreatedGroups", userId],
			}).findAll();

			const joined = await Group.scope({
				method: ["currentUserJoinedGroups", userId],
			}).findAll();

			created.forEach((group) => {
				allGroups.push(group);
			});

			joined.forEach((group) => {
				allGroups.push(group);
			});

			const groups = Group.organizeGroupDetails(allGroups);

			return groups;
		}

		static async getGroupById(groupId) {
			console.log(groupId);

			const group = await Group.findByPk(groupId, {
				include: [
					{
						model: sequelize.models.Group_Image,
						attributes: ["id", "url", "preview"],
						separate: true,
					},
					{
						model: sequelize.models.User,
						attributes: ["id", "firstName", "lastName"],
					},
					{
						model: sequelize.models.Venue,
						attributes: {
							exclude: ["createdAt", "updatedAt"]
						},
						separate: true,
					},
				],
			});
			return group;
		}

		static organizeGroupDetails(result) {
			const groups = result.map((group) => {
				let previewImage = null;
				const numMembers = group.Memberships.reduce((count, membership) => {
					const status = membership.get("status");
					if (status === "co-host" || status === "member") {
						return count + 1;
					}
					return count;
				}, 0);

				for (let i = 0; i < group.Group_Images.length; i++) {
					if (group.Group_Images[i].preview && group.Group_Images[i].url) {
						previewImage = group.Group_Images[i].url;
					}
				}


				return {
					id: group.get("id"),
					organizerId: group.get("organizerId"),
					name: group.get("name"),
					about: group.get("about"),
					type: group.get("type"),
					private: group.get("private"),
					city: group.get("city"),
					state: group.get("state"),
					createdAt: group.get("createdAt"),
					updatedAt: group.get("updatedAt"),
					numMembers,
					previewImage,
				};
			});
			return groups;
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
				type: DataTypes.ENUM("In person", "Online"),
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
			modelName: "Group",
			scopes: {
				currentUserCreatedGroups(userId) {
					return {
						where: {
							organizerId: userId,
						},
						include: [
							{
								model: sequelize.models.Membership,
								separate: true,
							},
							{
								model: sequelize.models.Group_Image,
								separate: true,
							},
						],
					};
				},
				currentUserJoinedGroups(userId) {
					return {
						include: [
							{
								model: sequelize.models.Membership,
								where: {
									userId: userId,
									status: ["member", "co-host"],
								},
							},
							{
								model: sequelize.models.Group_Image,
								separate: true,
							},
						],
					};
				},
				isGroupOrganizer(groupId, userId) {
					return {
						where: {
							id: groupId,
							organizerId: userId
						}
					}
				}
			},
		}
	);
	return Group;
};
