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

		static async getAllEvents(params) {
			let { page, size, name, type, startDate } = params;

			page = +page;
			size = +size;

			if (Number.isNaN(page) || page <= 0) page = 1;
			if (Number.isNaN(size) || size <= 0) size = 20;

			if (size > 20) size = 20;
			if (page > 10) page = 10;

			const where = {};

			if (name && name !== "") {
				where.name = name;
			}

			if (type && type !== "") {
				where.type = type;
			}

			if (startDate && startDate !== "") {
				where.startDate = startDate;
			}

			const allEvents = await Event.findAll({
				subQuery: false,
				attributes: [
					"id",
					"groupId",
					"venueId",
					"name",
					"type",
					"startDate",
					"endDate",
				],
				where,
				limit: size,
				offset: (page - 1) * size,
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
						where: {
							status: ["attending", "host", "co-host"]
						},
						attributes: [
							[
								Event.sequelize.fn(
									"COUNT",
									Event.sequelize.fn(
										"DISTINCT",
										Event.sequelize.col("Attendances.id")
									)
								),
								"numAttending",
							],
						],
						required: false,
					},
					{
						model: sequelize.models.Event_Image,
						attributes: ["url"],
						where: { preview: true },
						required: false,
					},
				],

				group: ["Event.id", "Group.id", "Venue.id", "Event_Images.id"],
				raw: true,
			});

			console.log(allEvents);

			const events = Event.organizeEvents(allEvents);

			return events;
		}

		static async getEventsByGroupId(groupId) {
			const result = await Event.findAll({
				where: {
					groupId: groupId,
				},
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
						where: {
							status: ["attending", "host", "co-host"]
						},
						attributes: [
							[
								Event.sequelize.fn(
									"COUNT",
									Event.sequelize.fn(
										"DISTINCT",
										Event.sequelize.col("Attendances.id")
									)
								),
								"numAttending",
							],
						],
						required: false,
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

			const events = this.organizeEvents(result);

			return events;
		}

		static organizeEvents(result) {
			const events = result.map((event) => {
				if(!Number.isInteger(event['Attendances.numAttending'])){
					console.log("numAttending was a string, converting to int...")
					event['Attendances.numAttending'] = parseInt(event['Attendances.numAttending'])
				} else {
					console.log("numAttending is an int")
				}
				let venue = {
					id: event["Venue.id"],
					city: event["Venue.city"],
					state: event["Venue.state"],
				};

				if (!venue.id) {
					venue = null;
				}

				return {
					id: event.id,
					groupId: event.groupId,
					venueId: event.venueId,
					name: event.name,
					type: event.type,
					startDate: event.startDate,
					endDate: event.endDate,
					numAttending: event["Attendances.numAttending"],
					previewImage: event["Event_Images.url"],
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

		static async getEventById(eventId) {
			const event = await Event.findOne({
				where: {
					id: eventId,
				},
				include: [
					{
						model: sequelize.models.Group,
						attributes: ["id", "name", "private", "city", "state"],
					},
					{
						model: sequelize.models.Venue,
						attributes: ["id", "address", "city", "state", "lat", "lng"],
					},
					{
						model: sequelize.models.Event_Image,
						attributes: ["id", "url", "preview"],
					},
				],
			});

			const numAttending = await sequelize.models.Attendance.count({
				where: {
					eventId: eventId,
					status: ["attending", "host", "co-host"]
				},
			});

			if(!Number.isInteger(numAttending)){
				console.log("Converting numAttending into int")
				event.numAttending = parseInt(numAttending)
			} else {
				console.log("numAttending is an int")
				event.numAttending = numAttending;
			}



			const result = Event.organizeEvent(event);
			return result;
		}

		static organizeEvent(obj) {
			return {
				id: obj.id,
				groupId: obj.groupId,
				venueId: obj.venueId,
				name: obj.name,
				description: obj.description,
				type: obj.type,
				capacity: obj.capacity,
				price: obj.price,
				startDate: obj.startDate,
				endDate: obj.endDate,
				numAttending: obj.numAttending,
				Group: obj.Group,
				Venue: obj.Venue,
				EventImages: obj.Event_Images,
			};
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
				type: DataTypes.ENUM("Online", "In person"),
				allowNull: false,
			},
			capacity: DataTypes.INTEGER,
			price: DataTypes.FLOAT,
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
