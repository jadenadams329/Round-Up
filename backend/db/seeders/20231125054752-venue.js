"use strict";
const { Venue } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "Venues";
		options.validate = true;
		await Venue.bulkCreate(
			[
				{
					groupId: 1,
					address: "123 Fake St",
					city: "San Diego",
					state: "California",
					lat: null,
					lng: null,
				},
				{
					groupId: 2,
					address: "44 Egg St",
					city: "San Diego",
					state: "California",
					lat: null,
					lng: null,
				},
				{
					groupId: 3,
					address: "29 Apple Ave",
					city: "San Diego",
					state: "California",
					lat: null,
					lng: null,
				},
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		options.tableName = "Venues";
		return await queryInterface.bulkDelete(
			options,
			{
				address: { [Op.in]: ["123 Fake St", "44 Egg St", "29 Apple Ave"] },
			},
			{}
		);
	},
};
