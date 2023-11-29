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
				attributes: [
					"id",
					"organizerId",
					"name",
					"about",
					"type",
					"private",
					"city",
					"state",
					"createdAt",
					"updatedAt",
					[
						sequelize.fn("COUNT", sequelize.col("Memberships.id")),
						"numMembers",
					],
				],
				include: [
					{
						model: sequelize.models.Membership,
						where: {
							status: ["member", "co-host"],
						},
						attributes: [],
						required: false,
					},
					{
						model: sequelize.models.Group_Image,
						where: { preview: true },
						attributes: ["url"],
						required: false,
					},
				],
				group: ["Group.id"],
				raw: true,
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

			console.log(allGroups);
			const groups = Group.organizeGroupDetails(allGroups);

			return groups;
		}

		static async getGroupById(groupId) {
			const group = await Group.findByPk(groupId, {
				attributes: [
					"id",
					"organizerId",
					"name",
					"about",
					"type",
					"private",
					"city",
					"state",
					"createdAt",
					"updatedAt",
				],
				include: [
					{
						model: sequelize.models.Group_Image,
						attributes: ["id", "url", "preview"],
					},
					{
						model: sequelize.models.User,
						attributes: ["id", "firstName", "lastName"],
					},
					{
						model: sequelize.models.Venue,
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
				],
			});

			const numMembers = await sequelize.models.Membership.count({
				where: {
					groupId: groupId,
					status: ["member", "co-host"],
				},
			});

			group.numMembers = numMembers;

			let result = Group.organizeGroupById(group);
			return result;
		}

		static organizeGroupById(result) {
			console.log(result.numMembers);

			let group = {
				id: result.id,
				organizerId: result.organizerId,
				name: result.name,
				about: result.about,
				type: result.type,
				private: result.private,
				city: result.city,
				state: result.state,
				createdAt: result.createdAt,
				updatedAt: result.updatedAt,
				numMembers: result.numMembers,
				GroupImages: result.Group_Images,
				Organzier: result.User,
				Venues: result.Venues,
			};
			return group;
		}

		static organizeGroupDetails(result) {
			const groups = result.map((group) => {
				return {
					id: group.id,
					organizerId: group.organizerId,
					name: group.name,
					about: group.about,
					type: group.type,
					private: group.private,
					city: group.city,
					state: group.state,
					createdAt: group.createdAt,
					updatedAt: group.updatedAt,
					numMembers: group.numMembers,
					previewImage: group["Group_Images.url"],
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
						attributes: [
							"id",
							"organizerId",
							"name",
							"about",
							"type",
							"private",
							"city",
							"state",
							"createdAt",
							"updatedAt",
							[
								sequelize.fn("COUNT", sequelize.col("Memberships.id")),
								"numMembers",
							],
						],
						include: [
							{
								model: sequelize.models.Membership,
								where: {
									status: ["member", "co-host"],
								},
								attributes: [],
								required: false,
							},
							{
								model: sequelize.models.Group_Image,
								where: { preview: true },
								attributes: ["url"],
								required: false,
							},
						],
						group: ["Group.id"],
						raw: true,
					};
				},
				currentUserJoinedGroups(userId) {
					return {
						attributes: [
							"id",
							"organizerId",
							"name",
							"about",
							"type",
							"private",
							"city",
							"state",
							"createdAt",
							"updatedAt",
							[
								sequelize.fn("COUNT", sequelize.col("Memberships.id")),
								"numMembers",
							],
						],
						include: [
							{
								model: sequelize.models.Membership,
								where: {
									userId: userId,
									status: ["member", "co-host"],
								},
								attributes: [],
							},
							{
								model: sequelize.models.Group_Image,
								where: { preview: true },
								attributes: ["url"],
								required: false,
							},
						],
						group: ["Group.id"],
						raw: true,
					};
				},
				isGroupOrganizer(groupId, userId) {
					return {
						where: {
							id: groupId,
							organizerId: userId,
						},
					};
				},
			},
		}
	);
	return Group;
};
