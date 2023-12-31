"use strict";
const { Event_Image } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "Event_Images";
		options.validate = true;
		await Event_Image.bulkCreate(
			[
				{
					eventId: 1,
					url: "event1",
					preview: true,
				},
				{
					eventId: 2,
					url: "event2",
					preview: true,
				},
				{
					eventId: 3,
					url: "event3",
					preview: true,
				},
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		options.tableName = "Event_Images";
		return await queryInterface.bulkDelete(
			options,
			{
				preview: { [Op.in]: [true, false] },
			},
			{}
		);
	},
};
