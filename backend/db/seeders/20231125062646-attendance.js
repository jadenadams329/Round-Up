"use strict";
const { Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "Attendances";
		options.validate = true;
		await Attendance.bulkCreate(
			[
				{
					eventId: 1,
					userId: 2,
					status: "attending",
				},
				{
					eventId: 2,
					userId: 3,
					status: "pending",
				},
				{
					eventId: 3,
					userId: 1,
					status: "waitlist",
				},
				{
					eventId: 1,
					userId: 1,
					status: "host",
				},
				{
					eventId: 2,
					userId: 2,
					status: "co-host",
				},
				{
					eventId: 3,
					userId: 3,
					status: "host",
				},
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		options.tableName = "Attendances";
		return await queryInterface.bulkDelete(
			options,
			{
				status: { [Op.in]: ["pending", "waitlist", "attending"] },
			},
			{}
		);
	},
};
