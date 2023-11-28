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
					firstName: "Jaden",
					lastName: "Adams",
					email: "jadenadams329@gmail.com",
					username: "jadenadams329",
					hashedPassword: bcrypt.hashSync("password"),
				},
				{
					firstName: "Fake",
					lastName: "User",
					email: "user1@user.io",
					username: "FakeUser1",
					hashedPassword: bcrypt.hashSync("password1"),
				},
				{
					firstName: "Faker",
					lastName: "Usered",
					email: "user2@user.io",
					username: "FakeUser2",
					hashedPassword: bcrypt.hashSync("password3"),
				},
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				username: { [Op.in]: ["jadenadams329", "FakeUser1", "FakeUser2"] },
			},
			{}
		);
	},
};
