"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Attendance extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Attendance.belongsTo(models.Event, { foreignKey: "eventId" });
			Attendance.belongsTo(models.User, { foreignKey: "userId" });
		}

		static organizeAttendees(result) {
			const attendees = result.map((attendee) => {
				return {
					id: attendee.id,
					firstName: attendee.firstName,
					lastName: attendee.lastName,
					Attendance: {
						status: attendee["Attendances.status"],
					},
				};
			});
			return attendees;
		}
	}
	Attendance.init(
		{
			eventId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			status: {
				type: DataTypes.ENUM(
					"host",
					"co-host",
					"attending",
					"waitlist",
					"pending"
				),
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Attendance",
		}
	);
	return Attendance;
};
