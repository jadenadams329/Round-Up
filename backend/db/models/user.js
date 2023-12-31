"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			User.hasMany(models.Group, { foreignKey: "organizerId" });
			User.hasMany(models.Membership, { foreignKey: "userId" });
			User.hasMany(models.Attendance, { foreignKey: "userId" });
		}

		static organizeMembers(result) {
			const members = result.map((member) => {
				return {
					id: member.id,
					firstName: member.firstName,
					lastName: member.lastName,
					Membership: {
						status: member["Memberships.status"],
					},
				};
			});
			return members;
		}
	}
	User.init(
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					len: [3, 256],
					isEmail: true,
				},
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					len: [4, 30],
					isNotEmail(value) {
						if (Validator.isEmail(value)) {
							throw new Error("Cannot be an email.");
						}
					},
				},
			},
			hashedPassword: {
				type: DataTypes.STRING.BINARY,
				allowNull: false,
				validate: {
					len: [60, 60],
				},
			},
		},
		{
			sequelize,
			modelName: "User",
			defaultScope: {
				attributes: {
					exclude: ["hashedPassword", "createdAt", "updatedAt"],
				},
			},
			scopes: {
				isOrganizerOrCoHost(userId, groupId) {
					return {
						where: { id: userId },
						include: [
							{
								model: sequelize.models.Group,
								where: {
									id: groupId,
									organizerId: userId,
								},
								required: false,
							},
							{
								model: sequelize.models.Membership,
								where: {
									userId: userId,
									groupId: groupId,
									status: "co-host",
								},
								required: false,
							},
						],
					};
				},
				isAttendeeOrCoHostOrHost(userId, eventId) {
					return {
						where: {
							id: userId,
						},
						include: [
							{
								model: sequelize.models.Attendance,
								where: {
									userId: userId,
									eventId: eventId,
									status: ["host", "co-host", "attending"],
								},
							},
						],
						attributes: ["id", "username"],
					};
				},
				allMembersAuthorized(groupId) {
					return {
						attributes: ["id", "firstName", "lastName"],
						include: [
							{
								model: sequelize.models.Membership,
								where: {
									groupId: groupId,
								},
								attributes: ["status"],
							},
						],
						raw: true,
					};
				},
				allMembers(groupId) {
					return {
						attributes: ["id", "firstName", "lastName"],
						include: [
							{
								model: sequelize.models.Membership,
								where: {
									groupId: groupId,
									status: ["member", "co-host"],
								},
								attributes: ["status"],
							},
						],
						raw: true,
					};
				},
				isMember(userId, groupId) {
					return {
						attributes: ["id", "firstName", "lastName"],
						include: [
							{
								model: sequelize.models.Membership,
								where: {
									groupId: groupId,
									userId: userId,
								},
								attributes: ["status"],
							},
						],
						raw: true,
					};
				},
				allAttendeesAuthorized(eventId) {
					return {
						attributes: ["id", "firstName", "lastName"],
						include: [
							{
								model: sequelize.models.Attendance,
								where: {
									eventId: eventId,
									status: ["attending", "waitlist", "pending"],
								},
								attributes: ["status"],
							},
						],
						raw: true,
					};
				},
				allAttendees(eventId) {
					return {
						attributes: ["id", "firstName", "lastName"],
						include: [
							{
								model: sequelize.models.Attendance,
								where: {
									eventId: eventId,
									status: ["attending", "waitlist"],
								},
								attributes: ["status"],
							},
						],
						raw: true,
					};
				},
			},
		}
	);
	return User;
};
