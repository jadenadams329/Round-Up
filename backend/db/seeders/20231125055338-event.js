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
					description:
						"felis bibendum ut tristique et egestas quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim sit amet venenatis urna cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat in ante metus dictum at tempor commodo ullamcorper a lacus vestibulum sed arcu non odio euismod lacinia at quis risus sed vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in dictum non consectetur a erat nam at lectus urna",
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
					description:
						"felis bibendum ut tristique et egestas quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim sit amet venenatis urna cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat in ante metus dictum at tempor commodo ullamcorper a lacus vestibulum sed arcu non odio euismod lacinia at quis risus sed vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in dictum non consectetur a erat nam at lectus urna",
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
					description:
						"felis bibendum ut tristique et egestas quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim sit amet venenatis urna cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat in ante metus dictum at tempor commodo ullamcorper a lacus vestibulum sed arcu non odio euismod lacinia at quis risus sed vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in dictum non consectetur a erat nam at lectus urna",
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
