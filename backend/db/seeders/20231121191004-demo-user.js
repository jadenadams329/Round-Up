"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "Users";
		options.validate = true;
		await User.bulkCreate(
			[
				{
					firstName: "host",
					lastName: "host",
					email: "host@gmail.com",
					username: "host",
					hashedPassword: bcrypt.hashSync("password"),
				},
				{
					firstName: "co-host",
					lastName: "co-host",
					email: "co-host@gmail.com",
					username: "co-host",
					hashedPassword: bcrypt.hashSync("password"),
				},
				{
					firstName: "member",
					lastName: "member",
					email: "member@gmail.com",
					username: "member",
					hashedPassword: bcrypt.hashSync("password"),
				},
				{
					firstName: "member1",
					lastName: "member1",
					email: "member1@gmail.com",
					username: "member1",
					hashedPassword: bcrypt.hashSync("password"),
				}
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		options.tableName = "Users";
		return await queryInterface.bulkDelete(
			options,
			{
				username: { [Op.in]: ["jadenadams329", "FakeUser1", "FakeUser2"] },
			},
			{}
		);
	},
};
