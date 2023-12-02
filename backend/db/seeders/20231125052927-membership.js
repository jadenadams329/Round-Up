"use strict";
const { Membership } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "Memberships";
		options.validate = true;
		await Membership.bulkCreate(
			[
				{
					userId: 2,
					groupId: 1,
					status: "co-host",
				},
				{
					userId: 2,
					groupId: 2,
					status: "co-host",
				},
				{
					userId: 2,
					groupId: 3,
					status: "co-host",
				},
				{
					userId: 3,
					groupId: 1,
					status: "member",
				},
				{
					userId: 3,
					groupId: 2,
					status: "member",
				},
				{
					userId: 3,
					groupId: 3,
					status: "member",
				},
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		options.tableName = "Memberships";
		return await queryInterface.bulkDelete(
			options,
			{
				status: { [Op.in]: ["pending", "co-host", "member"] },
			},
			{}
		);
	},
};
