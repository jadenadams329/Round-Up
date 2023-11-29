"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		static associate(models) {
			Event.hasMany(models.Event_Image, {
				foreignKey: "eventId",
			});

			Event.hasMany(models.Attendance, {
				foreignKey: "eventId",
			});

			Event.belongsTo(models.Group, {
				foreignKey: "groupId",
			});

			Event.belongsTo(models.Venue, {
				foreignKey: "venueId",
			});
		}

		static async getAllEvents() {
			const allEvents = await Event.findAll({
				include: [
					{
						model: sequelize.models.Group,
						attributes: ["id", "name", "city", "state"],
					},
					{
						model: sequelize.models.Venue,
						attributes: ["id", "city", "state"],
					},
					{
						model: sequelize.models.Attendance,
						attributes: [
							[
								Event.sequelize.fn(
									"COUNT",
									Event.sequelize.col("Attendances.id")
								),
								"numAttending",
							],
						],
					},
					{
						model: sequelize.models.Event_Image,
						attributes: ["url"],
						where: { preview: true },
						required: false,
					},
				],
				attributes: [
					"id",
					"groupId",
					"venueId",
					"name",
					"type",
					"startDate",
					"endDate",
				],
				group: ["Event.id", "Group.id", "Venue.id", "Event_Images.id"],
				raw: true,
			});

			const events = Event.organizeEvents(allEvents);

			return events;
		}

		static organizeEvents(result) {
			const events = result.map((event) => {
        
				let venue = {
					id: event["Venue.id"],
					city: event["Venue.city"],
					state: event["Venue.state"],
				};

        if(!venue.id && !venue.city && !venue.state){
          venue = null
        }

				return {
					id: event.id,
					groupId: event.groupId,
					venueId: event.venueId,
					name: event.name,
					type: event.type,
					startDate: event.startDate,
					endDate: event.endDate,
					numAttending: event.numAttending || 0,
					previewImage: event["Event_Images.url"] || null,
					Group: {
						id: event["Group.id"],
						name: event["Group.name"],
						city: event["Group.city"],
						state: event["Group.state"],
					},
					Venue: venue,
				};
			});
			return events;
		}
	}
	Event.init(
		{
			venueId: DataTypes.INTEGER,
			groupId: DataTypes.INTEGER,
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: DataTypes.STRING,
			type: {
				type: DataTypes.ENUM("Online", "In Person"),
				allowNull: false,
			},
			capacity: DataTypes.INTEGER,
			price: DataTypes.INTEGER,
			startDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			endDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Event",
			defaultScope: {
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
			},
		}
	);
	return Event;
};
