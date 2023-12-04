"use strict";
const { Event } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "Events";
		options.validate = true;
		await Event.bulkCreate(
			[
				{
					venueId: 1,
					groupId: 1,
					name: "BMW Meet Up",
					description: "a meet up",
					type: "In person",
					capacity: 200,
					price: 0,
					startDate: Sequelize.literal("CURRENT_TIMESTAMP"),
					endDate: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
				{
					venueId: null,
					groupId: 2,
					name: "Audi Meet Up",
					description: "a meet up",
					type: "In person",
					capacity: 200,
					price: 0,
					startDate: Sequelize.literal("CURRENT_TIMESTAMP"),
					endDate: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
				{
					venueId: 3,
					groupId: 3,
					name: "GSD Walk",
					description: "a dog walk",
					type: "In person",
					capacity: 200,
					price: 0,
					startDate: Sequelize.literal("CURRENT_TIMESTAMP"),
					endDate: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		options.tableName = "Events";
		return await queryInterface.bulkDelete(
			options,
			{
				name: { [Op.in]: ["BMW Meet Up", "Audi Meet Up", "GSD Walk"] },
			},
			{}
		);
	},
};
