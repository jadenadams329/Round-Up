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
					url: "https://machineswithsouls.com/wp-content/uploads/2020/10/33.jpg",
					preview: true,
				},
				{
					eventId: 2,
					url: "https://images.squarespace-cdn.com/content/v1/532f75c0e4b0e9d45dd4ef14/1548112179905-7F5S2KEQXXI78RIU9YGF/ACIE+MEET+01.20.2019-7775.jpg?format=2500w",
					preview: true,
				},
				{
					eventId: 3,
					url: "https://i.ytimg.com/vi/LPmi8hgPnuk/maxresdefault.jpg",
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
