"use strict";
const { Group } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "Groups";
		options.validate = true;
		await Group.bulkCreate(
			[
				{
					organizerId: 1,
					name: "BMW Owners",
					about: "Group for BMW owners",
					type: "In person",
					private: true,
					city: "San Diego",
					state: "CA",
				},
				{
					organizerId: 1,
					name: "Audi Owners",
					about: "Group for Audi owners",
					type: "In person",
					private: false,
					city: "San Diego",
					state: "CA",
				},
				{
					organizerId: 1,
					name: "German Shepherd Dogs",
					about: "Group for all things German Shepherds",
					type: "In person",
					private: true,
					city: "San Diego",
					state: "CA",
				},
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		options.tableName = "Groups";
		return await queryInterface.bulkDelete(
			options,
			{
				name: {
					[Op.in]: ["BMW Owners", "Audi Owners", "German Shepherd Dogs"],
				},
			},
			{}
		);
	},
};
